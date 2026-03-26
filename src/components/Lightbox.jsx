import { C } from "./colors";

const Lightbox = ({ children, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 40 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#06040c", borderRadius: 16, padding: 32, border: `1px solid ${C.border}`, maxWidth: 720, width: "100%", cursor: "default", position: "relative" }}>
      <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, fontFamily: "inherit", lineHeight: 1 }}>×</button>
      {children}
    </div>
  </div>
);

export default Lightbox;
