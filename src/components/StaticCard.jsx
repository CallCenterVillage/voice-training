import { C } from "./colors";

const StaticCard = ({ title, children, color = C.secondary }) => (
  <div style={{ background: C.card, border: `1px solid ${color}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
    {/* A real heading, not a styled div — the document had 84 h2s and no h3s,
        which left heading-jump navigation unusable below the section level. */}
    <h3 style={{ margin: 0, padding: "16px 20px", fontSize: 15, fontWeight: 600, color: C.text }}>{title}</h3>
    <div style={{ padding: "0 20px 20px", color: C.muted, fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default StaticCard;
