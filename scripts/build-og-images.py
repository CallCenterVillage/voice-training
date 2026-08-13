#!/usr/bin/env python3
"""Render the Open Graph / Twitter cards in public/images/.

One card per module, plus the site default. Sharing a single card across ~37
routes means every link to the site looks identical in Slack, Discord, Mastodon
and LinkedIn; a per-module card at least tells the reader which module they are
being sent to.

The layout is measured from the original hand-made og-card.png so the whole set
stays visually consistent — see LAYOUT below. Fonts come from fonts-src/*.ttf
(the same sources scripts/build-fonts.py subsets for the web), not the published
woff2, which PIL cannot read.

    pip install pillow
    python3 scripts/build-og-images.py

Re-run after changing a module title or tagline. Output is committed: the
Netlify build does not run Python.
"""

import os
import sys

from PIL import Image, ImageDraw, ImageFont

FONT_DIR = "fonts-src"
OUT_DIR = "public/images"
LOGO = "public/images/ccv-logo.png"

# Facebook, LinkedIn, Slack and X all key off 1200x630 (1.91:1). Anything else
# gets letterboxed or cropped by at least one of them.
WIDTH, HEIGHT = 1200, 630

BG = (8, 6, 15)            # C.bg
BAR = (94, 23, 235)        # C.primary
TITLE_FG = (232, 230, 240)
SUBTITLE_FG = (140, 82, 255)   # C.secondary
TAGLINE_FG = (156, 152, 179)

# Every value here is measured from the original card. `cap_top` is the y of the
# cap line — what the eye aligns on — rather than PIL's text origin, which sits
# at the top of the line box and drifts with font size. Round letters (C, S, o)
# overshoot the cap line by 2-3px at these sizes, so the topmost ink in a
# rendered card sits slightly above the value here. That is correct.
LAYOUT = {
    "bar_width": 11,
    "margin_x": 80,
    "logo": {"x": 80, "y": 80, "size": 150},
    "title": {"cap_top": 294, "font": "inter-800.ttf", "size": 78, "fill": TITLE_FG},
    "subtitle": {"cap_top": 385, "font": "inter-600.ttf", "size": 40, "fill": SUBTITLE_FG},
    "tagline": {"cap_top": 477, "font": "inter-400.ttf", "size": 28, "fill": TAGLINE_FG},
}

SEP = "  ·  "

# Keep these in sync with MODULES in src/App.jsx and OG_IMAGES in
# src/siteMeta.js. src/test/staticFiles.test.js fails the build if a path
# referenced by siteMeta.js has no file here.
CARDS = [
    {
        "file": "og-card.png",
        "title": "Call Center Village",
        "subtitle": "Voice Security Training",
        "tagline": SEP.join(["Voice cloning", "Voice agents", "Social engineering"]),
    },
    {
        "file": "og-voice-cloning.png",
        "title": "Voice Cloning",
        "subtitle": "Call Center Village",
        "tagline": SEP.join(["Audio fundamentals", "AI cloning tools", "Detection & defense"]),
    },
    {
        "file": "og-voice-agents.png",
        "title": "Voice Agents",
        "subtitle": "Call Center Village",
        "tagline": SEP.join(["STT → LLM → TTS", "LiveKit", "Attack surface"]),
    },
    {
        "file": "og-social-engineering.png",
        "title": "Social Engineering",
        "subtitle": "Call Center Village",
        "tagline": SEP.join(["Psychology", "Human & AI targets", "Defense playbooks"]),
    },
    {
        "file": "og-appendix.png",
        "title": "Appendix",
        "subtitle": "Call Center Village",
        "tagline": "Commands, cheat sheets and lab recipes",
    },
    {
        "file": "og-quiz.png",
        "title": "Knowledge Test",
        "subtitle": "Call Center Village",
        "tagline": "Test what you know across all three modules",
    },
]


def load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def fitted_font(spec: dict, text: str, max_width: int) -> ImageFont.FreeTypeFont:
    """The spec's size, stepped down until `text` fits inside `max_width`.

    Only long module titles ever trigger this, but a title that silently ran off
    the right edge would be invisible until someone shared the link.
    """
    size = spec["size"]
    while size > 12:
        font = load_font(spec["font"], size)
        if font.getbbox(text)[2] <= max_width:
            return font
        size -= 1
    return load_font(spec["font"], 12)


def draw_line(draw: ImageDraw.ImageDraw, spec: dict, text: str, max_width: int) -> None:
    font = fitted_font(spec, text, max_width)
    # The gap between PIL's text origin and the top of a capital. Subtracting it
    # pins the cap-top to the measured y. This has to come from draw.textbbox,
    # not font.getbbox — the latter rounds differently from the rasteriser and
    # lands 2-3px off at these sizes.
    cap_offset = draw.textbbox((0, 0), "H", font=font)[1]
    draw.text(
        (LAYOUT["margin_x"], spec["cap_top"] - cap_offset),
        text,
        font=font,
        fill=spec["fill"],
    )


def render_card(card: dict, logo: Image.Image) -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, LAYOUT["bar_width"] - 1, HEIGHT - 1], fill=BAR)
    img.paste(logo, (LAYOUT["logo"]["x"], LAYOUT["logo"]["y"]))

    # Right margin is wider than the left so text never crowds the edge in the
    # cropped previews some clients render.
    max_width = WIDTH - LAYOUT["margin_x"] - 60
    for key in ("title", "subtitle", "tagline"):
        draw_line(draw, LAYOUT[key], card[key], max_width)

    return img


def main() -> int:
    if not os.path.isdir(FONT_DIR):
        print(f"error: {FONT_DIR}/ not found — run from the project root", file=sys.stderr)
        return 1

    size = LAYOUT["logo"]["size"]
    logo = Image.open(LOGO).convert("RGB").resize((size, size), Image.LANCZOS)

    os.makedirs(OUT_DIR, exist_ok=True)
    for card in CARDS:
        out = os.path.join(OUT_DIR, card["file"])
        render_card(card, logo).save(out, "PNG", optimize=True)
        print(f"{out}  {os.path.getsize(out) // 1024} KB")

    print(f"rendered {len(CARDS)} cards")
    return 0


if __name__ == "__main__":
    sys.exit(main())
