import { C, CodeBlock } from '../../components';
import { toAnchorId } from './_helpers';

export const builtWithItems = [
  { name: "React", url: "https://react.dev", note: "UI framework" },
  { name: "Vite", url: "https://vite.dev", note: "Build tool and dev server" },
  { name: "Heroicons", url: "https://heroicons.com", note: "Icon library" },
  { name: "Inter", url: "https://rsms.me/inter", note: "UI font (self-hosted)" },
  { name: "JetBrains Mono", url: "https://www.jetbrains.com/lp/mono/", note: "Code font (self-hosted)" },
  { name: "ESLint", url: "https://eslint.org", note: "Code linting" },
  { name: "Node.js", url: "https://nodejs.org", note: "JavaScript runtime" },
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const BuiltWithSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Project Credits</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      This training application is built with the following open-source projects.
    </p>

    <div id="bw-ai-disclosure" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 24, scrollMarginTop: 120 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>AI Disclosure</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
        This training application UI was built with the assistance of <a href="https://claude.ai/claude-code" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>Claude Code</a> and <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>Claude</a> by Anthropic. Claude was also used to figure out the (often ancient) Python environments for the tools configured on the Call Center Village laptops.
      </p>
    </div>

    <div id="bw-getting-started" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 24, scrollMarginTop: 120 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>Getting Started</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px 0" }}>
        Clone this project and run it locally in your browser.
      </p>
      <CodeBlock language="bash" code={`# Clone the repository
git clone https://github.com/CallCenterVillage/voice-training.git
cd voice-training

# Install dependencies
pnpm install

# Start the dev server
pnpm run dev
# Open http://localhost:5173 in your browser

# Or build for production
pnpm run build
pnpm run preview`} />
    </div>

    <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>Application Stack</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
      {builtWithItems.map(t => (
        <a key={t.name} id={`bw-${toAnchorId(t.name)}`} href={t.url} target="_blank" rel="noopener noreferrer"
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", textDecoration: "none", scrollMarginTop: 120, transition: "border-color 0.2s ease", display: "block" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {t.name} <span style={{ color: C.accent, fontSize: 13 }}>↗</span>
          </div>
          <div style={{ fontSize: 13, color: C.muted }}>{t.note}</div>
        </a>
      ))}
    </div>
  </div>
);

export default BuiltWithSection;
