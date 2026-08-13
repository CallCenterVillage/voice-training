#!/usr/bin/env python3
"""Subset the source TTFs in fonts-src/ into published woff2 files.

The full Inter family ships every script it supports (Cyrillic, Greek, the lot),
which is ~2.3 MB of TTF for an English-only site. Subsetting to the ranges we
actually render and converting to woff2 takes that to ~440 KB.

Only public/fonts/*.woff2 is served; fonts-src/*.ttf is the input and stays out
of the build. Run this after replacing or adding a source font:

    pip install fonttools brotli
    python3 scripts/build-fonts.py

If you introduce a glyph outside UNICODES below, add its block and re-run —
otherwise that character silently falls back to Segoe UI / the system sans.
"""

import glob
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

SRC_DIR = "fonts-src"
OUT_DIR = "public/fonts"

# Latin + Latin-Ext + IPA, punctuation, currency, letterlike, arrows, math,
# box-drawing, geometric shapes, misc symbols and dingbats. The symbol blocks
# are not optional: the UI uses ★ ☆ ⚠ ✓ · × ↗ ↘ ▲ ▼ ● − ≈ ≤ ≥ in body text.
UNICODES = (
    "U+0000-024F,U+0250-02AF,U+1E00-1E9F,U+1EF2-1EFF,"
    "U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,"
    "U+2190-21FF,U+2200-22FF,U+2500-257F,U+2580-259F,U+25A0-25FF,"
    "U+2600-27BF,U+FEFF,U+FFFD"
)


def main() -> int:
    sources = sorted(glob.glob(os.path.join(SRC_DIR, "*.ttf")))
    if not sources:
        print(f"No .ttf files in {SRC_DIR}/", file=sys.stderr)
        return 1

    os.makedirs(OUT_DIR, exist_ok=True)
    total_before = total_after = 0

    for src in sources:
        name = os.path.basename(src).replace(".ttf", ".woff2")
        out = os.path.join(OUT_DIR, name)
        before = os.path.getsize(src)

        subset.main([
            src,
            f"--unicodes={UNICODES}",
            "--flavor=woff2",
            "--layout-features=*",
            f"--output-file={out}",
        ])

        after = os.path.getsize(out)
        total_before += before
        total_after += after

        # Warn if a glyph present in the source was dropped by the ranges above.
        src_cmap = set(TTFont(src).getBestCmap())
        out_cmap = set(TTFont(out).getBestCmap())
        print(f"{name:26s} {before:>9,} -> {after:>8,}  "
              f"({len(out_cmap)}/{len(src_cmap)} glyphs)")

    pct = 100 * (total_before - total_after) // total_before
    print("-" * 58)
    print(f"{'TOTAL':26s} {total_before:>9,} -> {total_after:>8,}  ({pct}% smaller)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
