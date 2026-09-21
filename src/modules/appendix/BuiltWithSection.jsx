import { C, CodeBlock } from '../../components';
import { builtWithItems } from "./data/builtWithItems";
import { toAnchorId } from './_helpers';



const BuiltWithSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Project Credits</h1>
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

    {/* CC BY-SA asks that the licence notice travel with the work, and the
        deployed site is a distribution of it — so the terms live here, not
        only in the repository. */}
    <div id="bw-license" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 24, scrollMarginTop: 120 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>License</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 10px 0" }}>
        Copyright © 2026 Patrick Labbett / Call Center Village.
      </p>
      <ul style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: "0 0 10px 0", paddingLeft: 20 }}>
        <li>Source code — <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>MIT</a>.</li>
        <li>Training content — lesson text, quiz questions, diagrams and original images — <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>CC BY-SA 4.0</a>. Reuse it, adapt it, credit us, and share your version alike.</li>
        <li>The Call Center Village name, the CCV logo and the social card branding are not licensed — all rights reserved.</li>
      </ul>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
        Bundled fonts, provider logos and third-party diagrams keep their own terms. Full details in <a href="https://github.com/CallCenterVillage/voice-training/blob/main/LICENSING.md" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>LICENSING.md</a> and <a href="https://github.com/CallCenterVillage/voice-training/blob/main/THIRD-PARTY-NOTICES.md" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>THIRD-PARTY-NOTICES.md</a>.
      </p>
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
