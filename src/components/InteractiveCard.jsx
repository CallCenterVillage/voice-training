import { useState } from "react";
import { C } from "./colors";

const InteractiveCard = ({ title, children, color = C.secondary, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: C.card, border: `1px solid ${open ? color : C.border}`, borderRadius: 12, marginBottom: 12, overflow: "hidden", transition: "border-color 0.3s ease" }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} style={{ width: "100%", background: "none", border: "none", color: C.text, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 600 }}>
        {title}
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease", color }}>&#9660;</span>
      </button>
      {open && <div style={{ padding: "0 20px 20px", color: C.muted, fontSize: 14, lineHeight: 1.8 }}>{children}</div>}
    </div>
  );
};

export default InteractiveCard;
