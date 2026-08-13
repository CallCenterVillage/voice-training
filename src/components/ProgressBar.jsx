import { C } from "./colors";

// The visual bar stays 3px; the padding around it is a transparent hit area.
// At the old "2px 0 8px" each segment was ~13px tall and packed edge to edge,
// so a thumb tap routinely navigated to the wrong section.
const HIT_PADDING = "20px 0";

const srOnly = {
  position: "absolute", width: 1, height: 1, overflow: "hidden",
  clip: "rect(0,0,0,0)", whiteSpace: "nowrap",
};

// role="progressbar" is a read-only status role and cannot legally contain
// focusable buttons. So when the bar is navigable it becomes a group of nav
// buttons plus a visually-hidden status line; when it is purely decorative it
// stays a real progressbar.
const ProgressBar = ({ current, total, activeColor = C.accent, onNavigate }) => (
  <div
    style={{ display: "flex", gap: 4, margin: "-8px 0" }}
    {...(onNavigate
      ? { role: "group", "aria-label": "Section navigation" }
      : { role: "progressbar", "aria-valuenow": current, "aria-valuemin": 0, "aria-valuemax": total - 1, "aria-label": "Module progress" })}
  >
    {onNavigate && <span style={srOnly}>Section {current + 1} of {total}</span>}
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        role={onNavigate ? "button" : undefined}
        tabIndex={onNavigate ? 0 : undefined}
        aria-label={onNavigate ? `Go to section ${i + 1} of ${total}` : undefined}
        aria-current={onNavigate && i === current ? "true" : undefined}
        onClick={() => onNavigate?.(i)}
        onKeyDown={e => { if (onNavigate && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onNavigate(i); } }}
        onMouseEnter={e => { const bar = e.currentTarget.firstChild; bar.style.background = i <= current ? activeColor : `${activeColor}66`; bar.style.transform = "scaleY(1.8)"; bar.style.boxShadow = `0 0 8px ${activeColor}66`; }}
        onMouseLeave={e => { const bar = e.currentTarget.firstChild; bar.style.background = i <= current ? activeColor : C.borderStrong; bar.style.transform = "scaleY(1)"; bar.style.boxShadow = i <= current ? `0 0 8px ${activeColor}66` : "none"; }}
        style={{ flex: 1, padding: HIT_PADDING, cursor: onNavigate ? "pointer" : "default" }}
      >
        {/* Unvisited segments used C.border at 1.17:1 — the track was invisible,
            so "3 of 8" was not perceivable without reading the text. */}
        <div style={{ height: 3, borderRadius: 2, background: i <= current ? activeColor : C.borderStrong, transition: "all 0.2s ease", boxShadow: i <= current ? `0 0 8px ${activeColor}66` : "none" }} />
      </div>
    ))}
  </div>
);

export default ProgressBar;
