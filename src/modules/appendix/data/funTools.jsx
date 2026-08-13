// Data only — no JSX. Split out so the appendix section components can be
// code-split: index.jsx needs these lists to build anchor links, but does
// not need the components that render them.
import { C } from "../../../components/colors";

export const funTools = [
  { name: "cmatrix", desc: "Terminal-based Matrix digital rain animation",
    installCode: `# === Install cmatrix ===
sudo apt install -y cmatrix` },
  { name: "cowsay", desc: "Generate ASCII art of a cow with a message",
    installCode: `# === Install cowsay ===
sudo apt install -y cowsay` },
  { name: "ddate", desc: "Convert Gregorian dates to Discordian calendar dates",
    installCode: `# === Install ddate ===
sudo apt install -y ddate` },
  { name: "htop", desc: "Interactive process viewer and system monitor",
    installCode: `# === Install htop ===
sudo apt install -y htop` },
  { name: "lolcat", desc: "Colorize terminal output with rainbow gradients",
    installCode: `# === Install lolcat ===
sudo apt install -y lolcat` },
  { name: "librewolf", desc: "Privacy-focused Firefox fork — no telemetry, hardened defaults",
    installCode: `# === Install LibreWolf ===
# See https://librewolf.net/installation/ for your distro

# Ubuntu/Pop!_OS
sudo apt update && sudo apt install -y extrepo
sudo extrepo enable librewolf
sudo apt update && sudo apt install -y librewolf` },
  { name: "lynx", desc: "Text-based web browser for the terminal",
    installCode: `# === Install lynx ===
sudo apt install -y lynx` },
  { name: "neofetch", desc: "Display system info with ASCII art logo",
    installCode: `# === Install neofetch ===
sudo apt install -y neofetch` },
  { name: "sunshine", desc: "Self-hosted game streaming server",
    installCode: `# === Install Sunshine ===
sudo apt install -y sunshine`,
    note: <>Sunshine streams to <strong style={{ color: C.muted }}>Moonlight</strong> clients — see the Moonlight entry in this section.</> },
  { name: "moonlight", desc: "Open-source game streaming client",
    installCode: `# === Install Moonlight ===
sudo snap install moonlight`,
    note: <>Moonlight connects to a <strong style={{ color: C.muted }}>Sunshine</strong> server — see the Sunshine entry in this section.</> },
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
