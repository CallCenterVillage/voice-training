import { C, CodeBlock } from '../../components';
import { funTools } from "./data/funTools";
import { toAnchorId } from './_helpers';



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
