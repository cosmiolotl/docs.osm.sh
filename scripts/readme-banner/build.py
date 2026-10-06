"""Build .github/banner.svg, the README banner.

Text is outlined from the project's own Fira Code (via @fontsource) so the
banner renders identically when GitHub serves it as an <img>, where web fonts
never load. The mark is public/favicon.svg itself, inlined, so the two never
drift. Run from the repo root: python scripts/readme-banner/build.py
"""

import re
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
FONT_DIR = ROOT / "node_modules/@fontsource/fira-code/files"
ICON = ROOT / "public/favicon.svg"
OUT = ROOT / ".github/banner.svg"

INK = "#121b35"
INK_3 = "#676d8a"
GROUND = "#f4f2ec"
RULE = "#c9c6ba"

UPM = 2000
ADVANCE = 0.6  # em; Fira Code is 1200/2000

NAME, DOMAIN = "docs", ".osm.sh"
TEXT_SIZE = 40
ICON_SIZE = 80
GAP = 28  # icon to wordmark
PAD_X, PAD_Y = 40, 32
RADIUS = 16

FONT = TTFont(FONT_DIR / "fira-code-latin-500-normal.woff")
GLYPHS = FONT.getGlyphSet()
CMAP = FONT.getBestCmap()


def num(n: float) -> str:
    s = f"{n:.2f}".rstrip("0").rstrip(".")
    return "0" if s == "-0" else s


def text(s: str, x: float, baseline: float, size: float, fill: str) -> str:
    """One <path> of outlined glyphs; no shaping, so no ligatures (as on the site)."""
    k = size / UPM
    pen = SVGPathPen(GLYPHS, ntos=num)
    for i, ch in enumerate(s):
        GLYPHS[CMAP[ord(ch)]].draw(TransformPen(pen, (k, 0, 0, -k, x + i * ADVANCE * size, baseline)))
    return f'<path fill="{fill}" d="{pen.getCommands()}"/>'


def ink_extent(s: str) -> tuple[float, float]:
    """Lowest and highest inked point of s, in em, y up from the baseline."""
    pen = BoundsPen(GLYPHS)
    for ch in s:
        GLYPHS[CMAP[ord(ch)]].draw(pen)
    _, y_min, _, y_max = pen.bounds
    return y_min / UPM, y_max / UPM


def icon(x: float, y: float, size: float) -> str:
    """public/favicon.svg, placed at (x, y) and scaled from its 64-unit box."""
    source = ICON.read_text(encoding="utf-8")
    inner = re.search(r"<svg[^>]*>(.*)</svg>", source, re.S)
    if not inner:
        raise SystemExit(f"{ICON.relative_to(ROOT)}: no <svg> element")
    body = re.sub(r">\s+<", "><", inner.group(1).strip())
    return f'<g transform="translate({num(x)} {num(y)}) scale({num(size / 64)})">{body}</g>'


def build(domain_fill: str = INK_3) -> str:
    name_w = len(NAME) * ADVANCE * TEXT_SIZE
    text_w = len(NAME + DOMAIN) * ADVANCE * TEXT_SIZE
    w = PAD_X * 2 + ICON_SIZE + GAP + text_w
    h = PAD_Y * 2 + ICON_SIZE
    cy = h / 2

    # Centre the wordmark's ink (ascenders to descenders) on the icon.
    low, high = ink_extent(NAME + DOMAIN)
    baseline = cy + (high + low) / 2 * TEXT_SIZE
    tx = PAD_X + ICON_SIZE + GAP

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{num(w)}" height="{h}" viewBox="0 0 {num(w)} {h}" '
        f'role="img" aria-labelledby="t"><title id="t">{NAME}{DOMAIN}</title>'
        f'<rect x=".5" y=".5" width="{num(w - 1)}" height="{h - 1}" rx="{RADIUS}" fill="{GROUND}" stroke="{RULE}"/>'
        + icon(PAD_X, cy - ICON_SIZE / 2, ICON_SIZE)
        + text(NAME, tx, baseline, TEXT_SIZE, INK)
        + text(DOMAIN, tx + name_w, baseline, TEXT_SIZE, domain_fill)
        + "</svg>\n"
    )


if __name__ == "__main__":
    import sys

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(build(*sys.argv[1:2]), encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes)")
