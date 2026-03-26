import { C } from "./colors";

const StaticCard = ({ title, children, color = C.secondary }) => (
  <div style={{ background: C.card, border: `1px solid ${color}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
    <div style={{ padding: "16px 20px", fontSize: 15, fontWeight: 600, color: C.text }}>{title}</div>
    <div style={{ padding: "0 20px 20px", color: C.muted, fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default StaticCard;
