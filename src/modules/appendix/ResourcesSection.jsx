import { C } from '../../components';
import { resources } from "./data/resources";
import { toAnchorId } from './_helpers';



const allResources = resources.flatMap(g => g.items.map(r => ({ ...r, category: g.category })))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const ResourcesSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Additional Resources</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      External websites, resources, and educational materials referenced throughout the training.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {allResources.map(r => (
        <div key={r.name} id={`res-${toAnchorId(r.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", scrollMarginTop: 120 }}>
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

export default ResourcesSection;
