import { C } from "./colors";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const NextModuleLink = ({ href, label }) => (
  <div style={{ textAlign: "center", padding: "20px 0" }}>
    <p style={{ fontSize: 15, color: C.muted, marginBottom: 16 }}>Satisfied with your knowledge? Continue to the next module.</p>
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); history.pushState(null, "", href); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo(0, 0); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.primary, border: "none", borderRadius: 8, padding: "12px 24px", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s ease" }}
      onMouseEnter={e => { e.currentTarget.style.background = C.primaryHover; e.currentTarget.style.boxShadow = `0 0 12px ${C.primary}66`; }}
      onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.boxShadow = "none"; }}
    >{label} <ArrowRightIcon style={{ width: 16, height: 16 }} /></a>
  </div>
);

export default NextModuleLink;
