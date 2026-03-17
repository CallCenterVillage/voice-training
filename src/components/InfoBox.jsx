import { C } from "./colors";
import Icon from "./Icon";

const InfoBox = ({ children }) => (
  <div style={{ background: `${C.highlight}10`, border: `1px solid ${C.highlight}33`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
    <Icon name="info" size={18} style={{ color: C.highlight, flexShrink: 0, marginTop: 2 }} />
    <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{children}</div>
  </div>
);

export default InfoBox;
