import { C, CodeBlock } from '../../components';
import { allProjectTools } from "./data/projectTools";

const categoryColors = {
  "Speech-to-Text": "#38b6ff",
  "Language Model": "#cb6ce6",
  "Text-to-Speech": "#5e17eb",
  "Voice Conversion": "#8c52ff",
  "Framework": "#5170ff",
  "Detection": "#38b6ff",
};
import { toAnchorId } from './_helpers';



const ProjectGlossarySection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>AI Tool Glossary</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      AI and audio tools used across the training.
      Each tool includes installation instructions for setting up in <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>/opt</code> and
      creating a system wrapper in <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>/usr/local/bin</code>.
    </p>
    <div style={{ display: "grid", gap: 24 }}>
      {allProjectTools.map(t => (
        <div key={t.name} id={`tool-${toAnchorId(t.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 24px 20px", scrollMarginTop: 120 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
            <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: C.text, fontSize: 20, fontWeight: 800, textDecoration: "none" }}>
              {t.name} <span style={{ color: C.accent, fontSize: 14 }}>↗</span>
            </a>
            <span style={{
              background: categoryColors[t.category] || C.secondary,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 10px",
              borderRadius: 99,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}>{t.category}</span>
          </div>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px 0" }}>{t.desc}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: t.installCode ? 16 : 0 }}>
            {t.path && (
              <code style={{ background: C.codeBg, color: C.dim, padding: "3px 10px", borderRadius: 6, fontSize: 12 }}>{t.path}</code>
            )}
            {!t.path && (
              <span style={{ color: C.dim, fontSize: 12, fontStyle: "italic" }}>reference only</span>
            )}
          </div>
          {t.installCode && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Installation & Wrapper</div>
              <CodeBlock language="bash" code={t.installCode} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ProjectGlossarySection;
