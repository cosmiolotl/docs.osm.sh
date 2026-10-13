"""Seam masks for the header and footer, and footer art tall enough to fill one.

The seams used to be painted strips of navy and paper, so the plasma above
stopped dead where the strip began. They are now alpha masks: the night and
its art run on through the seam and are cut away cell by cell, so the rose
dissolves into the paper along with the navy.

Masks are baked at display size, 4px a cell, so the browser never resamples
them. The footer art gains 24 rows on top (96px, one seam) so it reaches up
through the dissolve at the same 4px cell; the new rows mirror the plasma's
tone back up, fade it a little, and re-dither it on the same Bayer lattice.

    python scripts/seam-art.py design/dither public/dither
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

CELL = 4
SEAM = 24  # rows, 96px
INK = (0x12, 0x1B, 0x35)
RAMP = np.array([INK, (0x5E, 0x2E, 0x45), (0xC6, 0x7B, 0x8B), (0xF0, 0xD9, 0xDF)], dtype=np.uint8)


def bayer(n):
    m = np.array([[0, 2], [3, 1]])
    while m.shape[0] < n:
        m = np.block([[4 * m, 4 * m + 2], [4 * m + 3, 4 * m + 1]])
    return (m + 0.5) / (n * n)


def mask(strip: Image.Image, flip: bool) -> Image.Image:
    """Navy cells opaque, paper cells clear, at display size."""
    ink = np.all(np.asarray(strip.convert("RGB")) == INK, axis=-1)
    if flip:
        ink = ink[::-1, ::-1]
    alpha = Image.fromarray(np.where(ink, 255, 0).astype(np.uint8))
    alpha = alpha.resize((alpha.width * CELL, alpha.height * CELL), Image.Resampling.NEAREST)
    out = Image.new("LA", alpha.size, 0)
    out.putalpha(alpha)
    return out


def extend(art: Image.Image) -> Image.Image:
    """Grow the art upward by one seam, continuing the plasma's tone."""
    pixels = np.asarray(art.convert("RGB"))
    levels = np.zeros(pixels.shape[:2])
    for i, color in enumerate(RAMP):
        levels[np.all(pixels == color, axis=-1)] = i
    # Ordered dither keeps the local mean, so a blur recovers the tone.
    blurred = Image.fromarray((levels * 85).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
    tone = np.asarray(blurred, dtype=float) / 85
    top = tone[:SEAM][::-1] * np.linspace(0.55, 1, SEAM)[:, None]
    # SEAM is a multiple of 8, so the new rows keep the lattice's phase.
    t = np.tile(bayer(8), (SEAM // 8, art.width // 8 + 1))[:, : art.width]
    idx = np.clip(np.floor(top + t), 0, len(RAMP) - 1).astype(int)
    return Image.fromarray(np.vstack([RAMP[idx], pixels]))


src, out = Path(sys.argv[1]), Path(sys.argv[2])
mask(Image.open(src / "seam-down-2.png"), flip=False).save(out / "seam-down.png", optimize=True)
mask(Image.open(src / "seam-up-2.png"), flip=True).save(out / "seam-up.png", optimize=True)
extend(Image.open(src / "footer-2.png")).save(out / "footer.png", optimize=True)
print("ok")
