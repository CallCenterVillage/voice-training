import { C, CodeBlock } from '../../components';
import { toAnchorId } from './_helpers';

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

const FunToolsSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Other Tools</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Tools that aren't strictly necessary but make the terminal a little more enjoyable.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {funTools.map(t => (
        <div key={t.name} id={`fun-${toAnchorId(t.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", scrollMarginTop: 120 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: t.installCode ? 12 : 0 }}>
            <code style={{ background: C.codeBg, color: C.accent, padding: "2px 8px", borderRadius: 4, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{t.name}</code>
            <span style={{ color: C.text, fontSize: 14, flex: 1, minWidth: 200 }}>{t.desc}</span>
          </div>
          {t.installCode && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Installation</div>
              <CodeBlock language="bash" code={t.installCode} />
            </div>
          )}
          {t.note && <p style={{ fontSize: 12, color: C.dim, marginTop: 10, marginBottom: 0 }}>{t.note}</p>}
        </div>
      ))}
    </div>
  </div>
);

export default FunToolsSection;
