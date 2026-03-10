import { C } from "./colors";

const ProgressBar = ({ current, total, activeColor = C.accent }) => (
  <div role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total - 1} aria-label="Module progress" style={{ display: "flex", gap: 4, padding: "12px 0" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= current ? activeColor : C.border, transition: "background 0.5s ease", boxShadow: i <= current ? `0 0 8px ${activeColor}66` : "none" }} />
    ))}
  </div>
);

export default ProgressBar;
