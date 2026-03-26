import { C } from "./colors";

const ServiceCardGrid = ({ services }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
    {services.map((svc, i) => (
      <div key={i} style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <img src={svc.logo} alt={svc.name} style={{ width: 40, height: 40, borderRadius: 8, background: svc.logoBg || "transparent", padding: svc.logoBg ? 4 : 0 }} />
          <a href={svc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 800, color: svc.color, textDecoration: svc.strikethrough ? "line-through" : "none" }}>{svc.name} ↗</a>
        </div>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{svc.desc}</div>
      </div>
    ))}
  </div>
);

export default ServiceCardGrid;
