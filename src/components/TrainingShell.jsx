import { useState } from "react";
import { C } from "./colors";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const TrainingShell = ({ sections, sectionComponents, moduleTitle, logoUrl = "/images/ccv-logo.png", topOffset = 0 }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const Section = sectionComponents[currentSection];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>

      <header style={{ background: C.headerBg, borderBottom: `1px solid ${C.border}`, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: topOffset, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logoUrl} alt="CCV" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <div style={{ fontSize: 14, fontWeight: 800, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Call Center Village</div>
          <div style={{ fontSize: 14, color: C.dim }}>{moduleTitle}</div>
        </div>
        <button onClick={() => setNavOpen(!navOpen)} aria-label={navOpen ? "Close navigation" : "Open sections navigation"} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
          {navOpen ? <><XMarkIcon style={{ width: 16, height: 16 }} aria-hidden="true" /> Close</> : <><Bars3Icon style={{ width: 16, height: 16 }} aria-hidden="true" /> Sections</>}
        </button>
      </header>

      {navOpen && (
        <nav aria-label="Sections navigation" style={{ position: "fixed", top: 45 + topOffset, right: 0, background: C.headerBg, border: `1px solid ${C.border}`, borderRadius: "0 0 0 12px", padding: 12, zIndex: 200, minWidth: 220 }}>
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => { setCurrentSection(i); setNavOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: i === currentSection ? `${C.accent}10` : "transparent", border: "none", borderRadius: 6, padding: "8px 12px", color: i === currentSection ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: i === currentSection ? 700 : 400, marginBottom: 2 }}>
              {typeof s.icon === "string" ? <Icon name={s.icon} size={16} style={{ color: "currentColor" }} /> : s.icon} {s.title}
            </button>
          ))}
        </nav>
      )}

      <div style={{ padding: "0 12px" }}><ProgressBar current={currentSection} total={sections.length} /></div>
      <main style={{ flex: 1, maxWidth: 960, margin: "0 auto", padding: "24px 12px 80px", width: "100%" }}><Section /></main>

      <div style={{ position: "sticky", bottom: 0, background: `${C.headerBg}ee`, borderTop: `1px solid ${C.border}`, padding: "12px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(10px)" }}>
        <button onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)} disabled={currentSection === 0} aria-disabled={currentSection === 0 ? "true" : undefined} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 20px", color: currentSection === 0 ? C.border : C.muted, cursor: currentSection === 0 ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}><ChevronLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" /> Previous</button>
        <div style={{ fontSize: 14, color: C.dim }}>{currentSection + 1} / {sections.length}</div>
        <button onClick={() => currentSection < sections.length - 1 && setCurrentSection(currentSection + 1)} disabled={currentSection === sections.length - 1} aria-disabled={currentSection === sections.length - 1 ? "true" : undefined} style={{ background: currentSection === sections.length - 1 ? C.border : C.primary, border: "none", borderRadius: 8, padding: "8px 20px", color: currentSection === sections.length - 1 ? C.dim : "#fff", cursor: currentSection === sections.length - 1 ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>Next <ChevronRightIcon style={{ width: 14, height: 14 }} aria-hidden="true" /></button>
      </div>
    </div>
  );
};

export default TrainingShell;
