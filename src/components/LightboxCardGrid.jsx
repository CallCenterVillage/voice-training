import { useState } from "react";
import { C } from "./colors";
import Icon from "./Icon";
import Lightbox from "./Lightbox";

const renderDesc = (desc, color, size = "small") => {
  const fontSize = size === "large" ? 16 : 13;
  if (typeof desc !== "string" || !desc.includes("\n\n")) {
    return <div style={{ fontSize, color: C.muted, lineHeight: 1.6 }}>{desc}</div>;
  }
  return desc.split("\n\n").map((para, pi) => {
    const isSection = /^(Goal|Red Flags|Defense|Why|How):/.test(para);
    const showDivider = pi > 0 && isSection;
    const isRedFlags = /^Red Flags:/.test(para);

    if (isRedFlags) {
      const flagContent = para.slice(para.indexOf(":") + 1).trim();
      const flags = flagContent.split(/,\s*/).map(f => f.trim()).filter(Boolean);
      return (
        <div key={pi}>
          {showDivider && <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "12px 0" }} />}
          <div style={{ fontSize, color: C.muted, lineHeight: 1.7 }}>
            <strong style={{ color }}>Red Flags:</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {flags.map((flag, fi) => (
              <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Icon name="flag" size={14} style={{ color, flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize, color: C.muted, lineHeight: 1.5 }}>{flag}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={pi}>
        {showDivider && <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "12px 0" }} />}
        <div style={{ fontSize, color: C.muted, lineHeight: 1.7, marginBottom: pi > 0 || !isSection ? 0 : 4 }}>
          {isSection ? <><strong style={{ color }}>{para.split(":")[0]}:</strong>{para.slice(para.indexOf(":") + 1)}</> : para}
        </div>
      </div>
    );
  });
};

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
            style={{ background: C.card, border: "1px solid transparent", borderRadius: 12, padding: 16, cursor: "pointer", transition: "border-color 0.2s ease" }}
          >
            <div style={{ color: item.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.name}</div>
            {renderDesc(item.desc, item.color, "small")}
          </div>
        ))}
      </div>
      {openIdx !== null && (
        <Lightbox onClose={() => setOpenIdx(null)}>
          <div style={{ fontSize: 24, color: items[openIdx].color, fontWeight: 700, marginBottom: 16 }}>{items[openIdx].name}</div>
          {renderDesc(items[openIdx].desc, items[openIdx].color, "large")}
        </Lightbox>
      )}
    </>
  );
};

export default LightboxCardGrid;
