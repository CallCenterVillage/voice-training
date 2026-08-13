// Contrast ratios below are against C.card (#0f0d18), the darkest common text
// backdrop. WCAG AA needs 4.5:1 for body text and 3:1 for meaningful non-text.
export const C = {
  // Brand fills. These are BACKGROUND colours — primary at 2.56:1 and secondary
  // at 4.37:1 both fail as text on dark. Use primaryText / secondaryText instead.
  primary: "#5e17eb",
  secondary: "#8c52ff",
  tertiary: "#cb6ce6",
  accent: "#38b6ff",     // 8.5:1 — safe as text
  highlight: "#5170ff",

  // Text-safe brand tints, for when the brand purple has to carry a word.
  primaryText: "#a97cff",   // 6.4:1
  secondaryText: "#b18cff", // 7.4:1

  // Hover fill for primary buttons. The old hover swapped to `secondary`, which
  // dropped white-on-purple to 4.41:1 — the CTA lost AA exactly on interaction.
  primaryHover: "#4a12bd",  // white on this: 9.9:1

  bg: "#08060f",
  card: "#0f0d18",
  border: "#1c1830",      // decorative only (1.12:1) — never to convey state
  borderStrong: "#655d92", // 3.2:1 — for borders/tracks that DO convey state
  text: "#d4d0e8",
  muted: "#9e97c0",
  dim: "#9a91be",
  headerBg: "#0c0a14",
  codeBg: "#06040c",
};
