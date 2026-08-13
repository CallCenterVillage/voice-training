import { C } from '../../components';
import { seResources } from "./data/seResources";
import { toAnchorId } from './_helpers';



const SocialEngineeringResourcesSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Social Engineering Resources</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Books, frameworks, research, and tools for understanding social engineering — both the human psychology side and the AI/LLM attack surface. These resources complement the social engineering training module.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {seResources.map(r => (
        <div key={r.name} id={`se-${toAnchorId(r.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", scrollMarginTop: 120 }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{r.name}</span>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: "0 0 8px 0" }}>{r.desc}</p>
          <div style={{ fontSize: 12 }}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>{r.url} ↗</a>
            {r.archiveUrl && <> [<a href={r.archiveUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.secondary, opacity: 0.6, textDecoration: "none" }}>archive</a>]</>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SocialEngineeringResourcesSection;
