# Licensing

This repository is dual-licensed: the code and the training content carry
different terms, and the Call Center Village branding is not licensed at all.

Copyright © 2026 Patrick Labbett / Call Center Village.

| What | License | File |
| --- | --- | --- |
| Source code — app source, components, build config, scripts, styles | MIT | [`LICENSE`](LICENSE) |
| Training content — lesson text, quiz questions, diagrams, original images, written appendix material | CC BY-SA 4.0 | [`LICENSE-CONTENT`](LICENSE-CONTENT) |
| "Call Center Village" name, the CCV logo, the OG card branding | **Not licensed — all rights reserved** | see [Trademarks](#trademarks-and-branding--not-licensed) |
| Third-party code, fonts, logos and figures | Their own terms | [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) |

GitHub only detects the root `LICENSE` file, so the repository is labelled
"MIT". That label describes the code. The content terms are this document plus
`LICENSE-CONTENT`.

## What counts as code (MIT)

Everything whose purpose is to run or build the site:

- `src/**/*.js`, `src/**/*.jsx` — components, hooks, routing, colour system,
  `siteMeta.js`, tests
- `scripts/**` — `build-fonts.py`, `build-og-images.py`, `prerender.mjs`,
  `socialHead.mjs`
- `netlify/edge-functions/**`, `netlify.toml`, `vite.config.js`,
  `eslint.config.js`, `index.html`, `public/404.html`, packaging files
- `.github/workflows/**`

## What counts as content (CC BY-SA 4.0)

The material a learner reads, regardless of which file it happens to live in:

- Lesson prose, section headings, callouts and tables in `src/modules/**`
- Quiz questions, answer options and explanations in `src/quizData.js` and in
  the `QuizBank` blocks inside module sections
- Tool descriptions, glossary entries, resource lists and commentary in
  `src/modules/appendix/data/**`
- Original diagrams and images in `public/images/` (excluding branding and
  third-party material listed in `THIRD-PARTY-NOTICES.md`)

Content and code are interleaved in the same `.jsx` files. The rule is purpose,
not file extension: the JSX scaffolding around a paragraph is MIT, the paragraph
is CC BY-SA. If you reuse a whole section file, comply with both — in practice
that means keeping the copyright notice, attributing, and sharing derivatives of
the text alike.

### How to attribute

> "Call Center Village Voice Security Training" by Patrick Labbett / Call Center
> Village, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
> Source: https://github.com/CallCenterVillage/voice-training

Indicate if you changed the material, and license your adaptation of the content
under CC BY-SA 4.0 (or a compatible license). Attribution must not imply that
Call Center Village endorses you or your use.

## Trademarks and branding — not licensed

The following are **excluded from both licenses** and remain all rights
reserved:

- The name "Call Center Village" and the abbreviation "CCV" as a mark
- The CCV logo — `public/images/ccv-logo.png`, `public/images/apple-touch-icon.png`
- The social card branding — `public/images/og-*.png` and the layout constants,
  logo placement and wordmark reproduced by `scripts/build-og-images.py`

Neither the MIT license nor CC BY-SA 4.0 grants trademark rights (MIT covers
copyright only; CC BY-SA 4.0 § 2(b)(2) expressly withholds trademark rights), so
this section states explicitly what those licenses already leave untouched.

You may use the name nominatively — to say truthfully where the material came
from, as the attribution line above does. You may not use the name or logo as
your own branding, in a way that suggests endorsement or affiliation, or in a
fork presented as an official Call Center Village release. If you publish a
fork, replace the branding assets with your own and adjust `src/siteMeta.js`,
`public/images/` and the OG card script accordingly.

Third-party names and logos in `public/images/` belong to their respective
owners; see `THIRD-PARTY-NOTICES.md`.

## Contributions

Contributions are accepted under the same terms as the material they touch —
MIT for code, CC BY-SA 4.0 for content. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Not legal advice

This file describes the project's intent. It is a summary; the license texts
govern.
