import { C } from "./colors";

const ProgressBar = ({ current, total, activeColor = C.accent, onNavigate }) => (
  <div role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total - 1} aria-label="Module progress" style={{ display: "flex", gap: 4, padding: "12px 0" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        role={onNavigate ? "button" : undefined}
        tabIndex={onNavigate ? 0 : undefined}
        aria-label={onNavigate ? `Go to section ${i + 1}` : undefined}
        onClick={() => onNavigate?.(i)}
        onKeyDown={e => { if (onNavigate && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onNavigate(i); } }}
        onMouseEnter={e => { const bar = e.currentTarget.firstChild; bar.style.background = i <= current ? activeColor : `${activeColor}66`; bar.style.transform = "scaleY(1.8)"; bar.style.boxShadow = `0 0 8px ${activeColor}66`; }}
        onMouseLeave={e => { const bar = e.currentTarget.firstChild; bar.style.background = i <= current ? activeColor : C.border; bar.style.transform = "scaleY(1)"; bar.style.boxShadow = i <= current ? `0 0 8px ${activeColor}66` : "none"; }}
        style={{ flex: 1, padding: "2px 0 8px", cursor: onNavigate ? "pointer" : "default" }}
      >
        <div style={{ height: 3, borderRadius: 2, background: i <= current ? activeColor : C.border, transition: "all 0.2s ease", boxShadow: i <= current ? `0 0 8px ${activeColor}66` : "none" }} />
      </div>
    ))}
  </div>
);

export default ProgressBar;
