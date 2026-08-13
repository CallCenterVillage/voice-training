# Call Center Village — Training Modules

Interactive training platform for voice security topics, built for [Call Center Village](https://www.callcentervillage.com). Three self-contained training modules covering voice cloning, voice agents, and social engineering.

## Modules

- **Voice Cloning** — Audio fundamentals, traditional voice modification, AI cloning tools (local & commercial), and detection/defense techniques.
- **Voice Agents** — Full-stack voice agent architecture (STT → LLM → TTS), LiveKit framework, building agents, and attack surface analysis.
- **Social Engineering** — Psychology of SE, attacks against humans and AI agents, call center scenarios, combined attack chains, and defense playbooks.

Each module includes interactive components: quizzes, expandable cards, pipeline diagrams, scenario simulations, and hands-on lab exercises.

## Tech Stack

- React 19 + Vite
- Heroicons for iconography
- No external CSS — all inline styles with a shared color system
- wavesurfer.js for audio waveform playback

## Getting Started

```bash
pnpm install
pnpm dev
```

## Project Structure

```
src/
  components/            # Shared UI components
    colors.js             # Brand color constants (C object)
    Icon.jsx              # Heroicon wrapper component
    ProgressBar.jsx       # Section progress indicator
    CodeBlock.jsx         # Syntax-highlighted code display
    Lightbox.jsx          # Accessible modal dialog (focus trap + restore)
    LightboxCardGrid.jsx  # Expandable content cards
    QuizBank.jsx          # Multi-question quiz component
    SearchModal.jsx       # Site-wide search
    TrainingShell.jsx     # Module layout shell (header, nav, footer)
    useMediaQuery.js      # Responsive breakpoint hook
    useLockBodyScroll.js  # Scroll lock for overlays
    index.js              # Barrel exports
  modules/
    voice-cloning/        # Voice Cloning module (SECTIONS + COMPS)
    voice-agents/         # Voice Agents module
    social-engineering/   # Social Engineering module
    appendix/             # Glossaries and resources
    quiz/                 # Combined knowledge test
  App.jsx                 # Router + module switcher
  main.jsx                # Entry point
  siteMeta.js             # Site identity + link-preview metadata (one source)

public/                   # Served verbatim: fonts, images, audio,
                          # robots.txt, sitemap.xml, .well-known/
fonts-src/                # Source TTFs — build input, NOT published
scripts/build-fonts.py    # Subsets fonts-src/*.ttf -> public/fonts/*.woff2
scripts/build-og-images.py # Renders the social cards -> public/images/og-*.png
scripts/socialHead.mjs    # Builds the per-route <head> the prerenderer writes
netlify/edge-functions/   # Cloudflare origin auth
```

## Routing

Every section is a real URL (`/:module/:section`, plus `/quiz`) driven by the
History API in `App.jsx`. `netlify.toml` rewrites those prefixes to the SPA
shell and lets everything else fall through to a genuine 404.

Adding a module means adding a redirect rule in `netlify.toml`, entries to
`public/sitemap.xml`, and a social card in `src/siteMeta.js` plus
`scripts/build-og-images.py` — `src/test/staticFiles.test.js` fails if you
forget any of them.

## Prerendering

`pnpm build` runs three steps: a client build, an SSR build of
`src/entry-server.jsx`, then `scripts/prerender.mjs`, which renders all 37
routes to `dist/<route>/index.html` with their own `<title>`, description,
canonical and Open Graph tags.

Netlify serves those static files ahead of the SPA rewrites, so crawlers and
social scrapers get real content instead of an empty shell. The browser still
runs the normal client app — `src/main.jsx` uses `createRoot` rather than
`hydrateRoot`, and the comment there explains why.

Anything rendered at build time must tolerate having no `window`. `App` takes
an `initialPath` prop for exactly this reason.

## Link previews

Everything a scraper reads — title, description, author, Open Graph, Twitter
cards, JSON-LD — comes from `src/siteMeta.js`. Three places consume it and must
not drift apart, so change the constants there rather than the markup:

- `index.html` holds the home-page version between `<!-- social:start -->` and
  `<!-- social:end -->`. That is the dev-server fallback.
- `scripts/socialHead.mjs` builds the real per-route head; `prerender.mjs` swaps
  it into that marked region for each of the 37 pages.
- `App.jsx` re-syncs the tags after a client-side navigation. Not for scrapers —
  none of them run JS — but for share sheets and previewers that read the DOM.

Authorship shows up as `<meta name="author">`, `article:author`, and a
schema.org `Person` referenced by `@id` from every page, with Call Center
Village as the `Organization` publisher. Mastodon's byline comes from
`fediverse:creator`. There is no X account, so `twitter:site`/`twitter:creator`
are deliberately absent.

Each module has its own 1200×630 card so a shared deep link says which module it
points at. They are generated and committed — Netlify does not run Python:

```bash
pip install pillow
python3 scripts/build-og-images.py
```

Card copy lives in `CARDS` in that script; the layout constants are measured
from the original hand-made `og-card.png`, which the script reproduces exactly.
`src/test/socialHead.test.js` and `staticFiles.test.js` check every route's tags,
that each card file exists at the right dimensions, and that no tag survives
outside the marker region (which would ship two of it).

## Code splitting

Each section is a `React.lazy` chunk, so a visitor downloads the one section
they asked for rather than all four modules. Two consequences worth knowing:

- **Don't import from `src/components/index.js` in eagerly-loaded code.** The
  barrel re-exports `WaveformPlayer`, which pulls `wavesurfer.js` (~40 KB) into
  the initial payload. `App.jsx` and the module `index.jsx` files import
  specific modules directly.
- **Appendix tool lists live in `src/modules/appendix/data/`,** separate from
  the components that render them, so the components can be split out. The data
  itself is still eager because `index.jsx` needs the tool names to build the
  "On this page" anchor links.

## Fonts

`public/fonts/*.woff2` is generated, not hand-edited. The full Inter family is
~2.3 MB of TTF; subsetting to the glyph ranges actually rendered brings it to
~440 KB. After changing or adding a source font:

```bash
pip install fonttools brotli
python3 scripts/build-fonts.py
```

If you introduce a character outside the subset ranges it silently falls back to
the system sans — add its Unicode block to `UNICODES` in that script.

## Build

```bash
pnpm build         # client build + SSR build + prerender -> dist/
pnpm build:client  # client build only (skips prerendering)
pnpm preview       # Preview production build
pnpm test          # Vitest
pnpm lint          # ESLint
```
