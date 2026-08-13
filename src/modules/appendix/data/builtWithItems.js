// Data only — no JSX. Split out so the appendix section components can be
// code-split: index.jsx needs these lists to build anchor links, but does
// not need the components that render them.
export const builtWithItems = [
  { name: "React", url: "https://react.dev", note: "UI framework" },
  { name: "Vite", url: "https://vite.dev", note: "Build tool and dev server" },
  { name: "Heroicons", url: "https://heroicons.com", note: "Icon library" },
  { name: "Inter", url: "https://rsms.me/inter", note: "UI font (self-hosted)" },
  { name: "JetBrains Mono", url: "https://www.jetbrains.com/lp/mono/", note: "Code font (self-hosted)" },
  { name: "ESLint", url: "https://eslint.org", note: "Code linting" },
  { name: "Node.js", url: "https://nodejs.org", note: "JavaScript runtime" },
  { name: "wavesurfer.js", url: "https://wavesurfer.xyz", note: "Audio waveform player" },
  { name: "Handy", url: "https://handy.computer", note: "Free and open-source speech-to-text" },
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
