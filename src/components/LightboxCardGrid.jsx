import { useState } from "react";
import { C } from "./colors";
import Lightbox from "./Lightbox";

const LightboxCardGrid = ({ items }) => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => setOpenIdx(i)}
            onMouseEnter={e => e.currentTarget.style.borderColor = item.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
            style={{ background: C.card, border: "1px solid transparent", borderRadius: 12, padding: 14, cursor: "pointer", transition: "border-color 0.2s ease" }}
          >
            <div style={{ color: item.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.name}</div>
            <div style={{ fontSize: 13, color: C.dim }}>Click to learn more</div>
          </div>
        ))}
      </div>
      {openIdx !== null && (
        <Lightbox onClose={() => setOpenIdx(null)}>
          <div style={{ fontSize: 20, color: items[openIdx].color, fontWeight: 700, marginBottom: 8 }}>{items[openIdx].name}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{items[openIdx].desc}</div>
        </Lightbox>
      )}
    </>
  );
};

export default LightboxCardGrid;
