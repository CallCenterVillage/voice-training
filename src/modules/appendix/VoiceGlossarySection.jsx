import { C, CodeBlock } from '../../components';
import { voiceTools } from "./data/voiceTools";
import { toAnchorId } from './_helpers';



const VoiceGlossarySection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Voice Tool Glossary</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Audio and voice tools used across the training modules — recording, playback, synthesis, and analysis.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {voiceTools.map(t => (
        <div key={t.name} id={`voice-${toAnchorId(t.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", scrollMarginTop: 120 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: t.installCode ? 12 : 0 }}>
            <code style={{ background: C.codeBg, color: C.accent, padding: "2px 8px", borderRadius: 4, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{t.name}</code>
            <span style={{ color: C.text, fontSize: 14, flex: 1, minWidth: 200 }}>{t.desc}</span>
            <span style={{ color: C.dim, fontSize: 12, whiteSpace: "nowrap" }}>{t.install}</span>
          </div>
          {t.installCode && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Installation</div>
              <CodeBlock language="bash" code={t.installCode} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default VoiceGlossarySection;
