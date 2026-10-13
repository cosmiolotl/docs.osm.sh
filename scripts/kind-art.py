"""Shelf art for the index: one sampling source and one resting poster per kind.

The source is the transparent cutout fitted into the 136x69 canvas the card
draws on, so the browser samples it 1:1 and never resamples. The poster is
that source dithered with the same Bayer lattice and four-ink ramp as
src/lib/dither.ts at rest, so swapping the <img> for the <canvas> is invisible.

    python scripts/kind-art.py design/dither public/kinds
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

W, H = 136, 69
PAPER = (244, 242, 236)
PALETTES = {
    "writing": ["#121b35", "#78384f", "#c67b8b", "#f0d9df"],
    "projects": ["#121b35", "#365573", "#779bc6", "#d1e1f2"],
    "notes": ["#121b35", "#766038", "#c5a064", "#efe0bd"],
}
BAYER = np.array([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]).reshape(4, 4)


def rgb(hex_: str):
    return tuple(int(hex_[i : i + 2], 16) for i in (1, 3, 5))


def luminance(c):
    return (c[..., 0] * 0.2126 + c[..., 1] * 0.7152 + c[..., 2] * 0.0722) / 255


def fit(cutout: Image.Image) -> Image.Image:
    scale = min(W / cutout.width, H / cutout.height) * 0.9
    w, h = round(cutout.width * scale), round(cutout.height * scale)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(cutout.resize((w, h), Image.Resampling.LANCZOS), ((W - w) // 2, (H - h) // 2))
    return canvas


def dither(source: Image.Image, palette: list[str]) -> Image.Image:
    px = np.asarray(source, dtype=np.float64)
    inks = np.array([rgb(c) for c in palette], dtype=np.float64)
    shades = luminance(inks)
    lum = luminance(px)
    # Piecewise-linear position of each pixel's brightness along the ink ramp.
    tone = np.interp(lum, shades, np.arange(len(shades)))
    ys, xs = np.mgrid[0:H, 0:W]
    threshold = (BAYER[ys % 4, xs % 4] + 0.5) / 16
    level = np.clip(np.floor(tone + threshold), 0, 3).astype(int)
    coverage = px[..., 3] / 255
    out = np.where((coverage > threshold)[..., None], inks[level], np.array(PAPER, dtype=np.float64))
    return Image.fromarray(out.astype(np.uint8), "RGB")


def main(src: Path, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    for kind, palette in PALETTES.items():
        source = fit(Image.open(src / f"{kind}-cutout.png").convert("RGBA"))
        source.save(out / f"{kind}-source.png", optimize=True)
        dither(source, palette).save(out / f"{kind}-poster.png", optimize=True)
        print(kind, "ok")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
