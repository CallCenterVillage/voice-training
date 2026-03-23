import { useState, useEffect } from "react";
import { C } from "./colors";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";
import { Bars3Icon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DRAWER_WIDTH = 260;

const TrainingShell = ({ sections, sectionComponents, moduleTitle, logoUrl = "/images/ccv-logo.png", topOffset = 0, currentSection, onNavigate }) => {
  const [navOpen, setNavOpen] = useState(true);
  const [activeAnchor, setActiveAnchor] = useState(null);
  const Section = sectionComponents[currentSection];
  const anchors = sections[currentSection].anchors;

  useEffect(() => {
    if (!anchors) return;
    const ids = anchors.map(a => a.id);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveAnchor(entry.target.id);
          break;
        }
      }
    }, { rootMargin: "-120px 0px -60% 0px", threshold: 0 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [anchors, currentSection]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>

      <header style={{ background: C.headerBg, borderBottom: `1px solid ${C.border}`, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: topOffset, zIndex: 160 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logoUrl} alt="CCV" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <div style={{ fontSize: 14, fontWeight: 800, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Call Center Village</div>
          <div style={{ fontSize: 14, color: C.dim }}>{moduleTitle}</div>
        </div>
        <button onClick={() => setNavOpen(!navOpen)} aria-label={navOpen ? "Close navigation" : "Open sections navigation"}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text; e.currentTarget.style.background = `${C.accent}15`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "none"; }}
          style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s ease" }}>
          {navOpen ? <><ChevronDoubleRightIcon style={{ width: 16, height: 16 }} aria-hidden="true" /> Hide</> : <><Bars3Icon style={{ width: 16, height: 16 }} aria-hidden="true" /> Sections</>}
        </button>
      </header>

      {/* Drawer nav — slides in from right, overlays content */}
      <nav aria-label="Sections navigation" style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        background: C.headerBg,
        borderLeft: `1px solid ${C.border}`,
        zIndex: 150,
        transform: navOpen ? "translateX(0)" : `translateX(${DRAWER_WIDTH}px)`,
        transition: "transform 0.25s ease",
        display: "flex",
        flexDirection: "column",
        paddingTop: 45 + topOffset,
      }}>
        <div style={{ padding: "16px 12px 8px 16px", fontSize: 11, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Sections
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => onNavigate(i)}
              onMouseEnter={e => { if (i !== currentSection) { e.currentTarget.style.background = `${C.accent}10`; e.currentTarget.style.color = C.text; } }}
              onMouseLeave={e => { if (i !== currentSection) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: i === currentSection ? `${C.accent}10` : "transparent", border: "none", borderRadius: 6, padding: "8px 12px", color: i === currentSection ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: i === currentSection ? 700 : 400, marginBottom: 2, transition: "all 0.2s ease" }}>
              {typeof s.icon === "string" ? <Icon name={s.icon} size={16} style={{ color: "currentColor" }} /> : s.icon} {s.title}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ padding: "0 12px", marginRight: navOpen ? DRAWER_WIDTH : 0, transition: "margin-right 0.25s ease" }}><ProgressBar current={currentSection} total={sections.length} onNavigate={onNavigate} /></div>
      <div style={{ display: "flex", flex: 1, justifyContent: "center", marginRight: navOpen ? DRAWER_WIDTH : 0, transition: "margin-right 0.25s ease" }}>
        <aside aria-label={anchors ? "Page index" : undefined} style={{
            width: 220,
            flexShrink: 0,
            position: "sticky",
            top: 140 + topOffset,
            alignSelf: "flex-start",
            padding: "24px 0 24px 16px",
            display: "none",
          }}
          className="anchor-nav"
        >
          {anchors && <>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, paddingLeft: 8 }}>On this page</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: `calc(100vh - ${160 + topOffset}px)`, overflowY: "auto" }}>
              {anchors.map(a => {
                const isActive = activeAnchor === a.id;
                return <a key={a.id} href={`#${a.id}`} onClick={e => { e.preventDefault(); document.getElementById(a.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = C.text; e.currentTarget.style.background = `${C.accent}10`; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = C.dim; e.currentTarget.style.background = "transparent"; } }}
                  style={{ fontSize: 12, color: isActive ? C.accent : C.dim, fontWeight: isActive ? 600 : 400, textDecoration: "none", padding: "4px 8px", borderRadius: 4, lineHeight: 1.5, transition: "all 0.15s ease", background: isActive ? `${C.accent}10` : "transparent" }}>
                  {a.label}
                </a>;
              })}
            </div>
          </>}
        </aside>
        <main className="training-content-area" style={{ flex: 1, maxWidth: 960, padding: "24px 12px 80px 48px", width: "100%" }}><Section /></main>
      </div>
      <style>{`@media (min-width: 1280px) { .anchor-nav { display: block !important; } .training-content-area { max-width: 1040px !important; } }`}</style>

      <div style={{ position: "sticky", bottom: 0, background: `${C.headerBg}ee`, borderTop: `1px solid ${C.border}`, padding: "12px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(10px)", zIndex: 160 }}>
        <button onClick={() => currentSection > 0 && onNavigate(currentSection - 1)} disabled={currentSection === 0} aria-disabled={currentSection === 0 ? "true" : undefined}
          onMouseEnter={e => { if (currentSection > 0) { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text; e.currentTarget.style.background = `${C.accent}15`; } }}
          onMouseLeave={e => { if (currentSection > 0) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "none"; } }}
          style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 20px", color: currentSection === 0 ? C.border : C.muted, cursor: currentSection === 0 ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s ease" }}><ChevronLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" /> Previous</button>
        <div style={{ fontSize: 14, color: C.dim }}>{currentSection + 1} / {sections.length}</div>
        <button onClick={() => currentSection < sections.length - 1 && onNavigate(currentSection + 1)} disabled={currentSection === sections.length - 1} aria-disabled={currentSection === sections.length - 1 ? "true" : undefined}
          onMouseEnter={e => { if (currentSection < sections.length - 1) { e.currentTarget.style.background = C.secondary; e.currentTarget.style.boxShadow = `0 0 12px ${C.primary}66`; } }}
          onMouseLeave={e => { if (currentSection < sections.length - 1) { e.currentTarget.style.background = C.primary; e.currentTarget.style.boxShadow = "none"; } }}
          style={{ background: currentSection === sections.length - 1 ? C.border : C.primary, border: "none", borderRadius: 8, padding: "8px 20px", color: currentSection === sections.length - 1 ? C.dim : "#fff", cursor: currentSection === sections.length - 1 ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s ease" }}>Next <ChevronRightIcon style={{ width: 14, height: 14 }} aria-hidden="true" /></button>
      </div>
    </div>
  );
};

export default TrainingShell;
