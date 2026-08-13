import { useState, useEffect, Suspense } from "react";
import { C } from "./colors";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";
import { useIsMobile } from "./useMediaQuery";
import { useLockBodyScroll } from "./useLockBodyScroll";
import { Bars3Icon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DRAWER_WIDTH = 260;

const TrainingShell = ({ sections, sectionComponents, moduleTitle, logoUrl = "/images/ccv-logo.png", topOffset = 0, currentSection, onNavigate }) => {
  const isMobile = useIsMobile();
  // On a phone the drawer overlays the whole column, so it starts closed.
  const [navOpen, setNavOpen] = useState(!isMobile);
  const [activeAnchor, setActiveAnchor] = useState(null);

  // useState reads isMobile once. Without this, rotating a tablet to portrait
  // left the drawer open AND rendered the scrim, giving the user a dark overlay
  // over a drawer they never opened. Adjusted during render rather than in an
  // effect so there is no second paint with the stale value.
  const [prevIsMobile, setPrevIsMobile] = useState(isMobile);
  if (prevIsMobile !== isMobile) {
    setPrevIsMobile(isMobile);
    setNavOpen(!isMobile);
  }

  // The scrim blocks taps but not scroll, so the page scrolled under the drawer.
  useLockBodyScroll(isMobile && navOpen);
  const Section = sectionComponents[currentSection];
  const anchors = sections[currentSection].anchors;

  useEffect(() => {
    if (!anchors) return;
    const ids = anchors.map(a => a.id);
    const onScroll = () => {
      const cutoff = 140 + topOffset;
      let best = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= cutoff) best = id;
      }
      setActiveAnchor(best || ids[0]);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [anchors, currentSection, topOffset]);

  const [skipFocused, setSkipFocused] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape" && !document.querySelector('[role="dialog"]')) setNavOpen(false); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [navOpen]);

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, color: C.text, fontFamily: "'Inter', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <a href="#main-content" onFocus={() => setSkipFocused(true)} onBlur={() => setSkipFocused(false)} style={{ position: "absolute", top: skipFocused ? topOffset + 52 : -40, left: 16, background: C.accent, color: "#000", padding: "8px 16px", borderRadius: 6, fontSize: 14, fontWeight: 700, zIndex: 10000, textDecoration: "none", transition: "top 0.2s ease" }}>Skip to main content</a>

      <header style={{ background: C.headerBg, borderBottom: `1px solid ${C.border}`, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: topOffset, zIndex: 160 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <img src={logoUrl} alt="CCV" style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }} />
          {/* The wordmark is the first thing to go — the logo already carries the brand. */}
          {!isMobile && <div style={{ fontSize: 14, fontWeight: 800, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>CALL CENTER VILLAGE</div>}
          <div style={{ fontSize: 14, color: C.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{moduleTitle}</div>
        </div>
        {/* aria-expanded carries the state, so the label stays stable. It must not
            collide with the "Sections navigation" landmark below it. */}
        <button onClick={() => setNavOpen(!navOpen)} aria-label="Sections menu" aria-expanded={navOpen} aria-controls="sections-drawer"
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text; e.currentTarget.style.background = `${C.accent}15`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "none"; }}
          style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", minHeight: 44, color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s ease", flexShrink: 0, whiteSpace: "nowrap" }}>
          {navOpen ? <><ChevronDoubleRightIcon style={{ width: 16, height: 16 }} aria-hidden="true" /> Hide</> : <><Bars3Icon style={{ width: 16, height: 16 }} aria-hidden="true" /> Sections</>}
        </button>
      </header>

      {/* Scrim — mobile only, where the drawer overlays content instead of pushing it */}
      {isMobile && navOpen && (
        <div onClick={() => setNavOpen(false)} aria-hidden="true" style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 149,
        }} />
      )}

      {/* Drawer nav — slides in from right. Pushes content on desktop, overlays on mobile. */}
      <nav id="sections-drawer" aria-label="Sections navigation" style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: isMobile ? "min(280px, 85vw)" : DRAWER_WIDTH,
        background: C.headerBg,
        borderLeft: `1px solid ${C.border}`,
        zIndex: 150,
        // Percentage keeps this correct whatever the width resolves to.
        transform: navOpen ? "translateX(0)" : "translateX(100%)",
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
            <button key={s.id} onClick={() => { onNavigate(i); if (isMobile) setNavOpen(false); }}
              onMouseEnter={e => { if (i !== currentSection) { e.currentTarget.style.background = `${C.accent}10`; e.currentTarget.style.color = C.text; } }}
              onMouseLeave={e => { if (i !== currentSection) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
              aria-current={i === currentSection ? "page" : undefined}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: i === currentSection ? `${C.accent}10` : "transparent", border: "none", borderRadius: 6, padding: "10px 12px", minHeight: 44, color: i === currentSection ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: i === currentSection ? 700 : 400, marginBottom: 2, transition: "all 0.2s ease" }}>
              {typeof s.icon === "string" ? <Icon name={s.icon} size={16} style={{ color: "currentColor" }} /> : s.icon} {s.title}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ padding: "0 12px", marginRight: navOpen && !isMobile ? DRAWER_WIDTH : 0, transition: "margin-right 0.25s ease" }}><ProgressBar current={currentSection} total={sections.length} onNavigate={onNavigate} /></div>
      <div style={{ display: "flex", flex: 1, justifyContent: "center", marginRight: navOpen && !isMobile ? DRAWER_WIDTH : 0, transition: "margin-right 0.25s ease" }}>
        {/* Rendered only when there are anchors — an empty unnamed complementary
            landmark otherwise showed up in the landmark rotor on every intro page. */}
        {anchors && <aside aria-label="Page index" style={{
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
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, paddingLeft: 8 }}>On this page</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: `calc(100vh - ${220 + topOffset}px)`, overflowY: "auto" }}>
              {anchors.map(a => {
                const isActive = activeAnchor === a.id;
                return <a key={a.id} href={`#${a.id}`} aria-current={isActive ? "true" : undefined} onClick={e => { e.preventDefault(); document.getElementById(a.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = C.text; e.currentTarget.style.background = `${C.accent}10`; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = C.dim; e.currentTarget.style.background = "transparent"; } }}
                  style={{ fontSize: 12, color: isActive ? C.accent : C.dim, fontWeight: isActive ? 600 : 400, textDecoration: "none", padding: "4px 8px", borderRadius: 4, lineHeight: 1.5, transition: "all 0.15s ease", background: isActive ? `${C.accent}10` : "transparent" }}>
                  {a.label}
                </a>;
              })}
            </div>
          </>
        </aside>}
        <main id="main-content" tabIndex={-1} className="training-content-area" style={{ flex: 1, maxWidth: 960, padding: isMobile ? "24px 12px 60vh 12px" : "24px 12px 60vh 48px", width: "100%", minWidth: 0 }}>
          {/* Sections are code-split, so the first paint of a new one may wait
              on a chunk. Reserve height to keep the sticky chrome from jumping. */}
          <Suspense fallback={<div style={{ minHeight: "60vh", color: C.dim, fontSize: 14 }} role="status">Loading…</div>}>
            <Section />
          </Suspense>
        </main>
      </div>
      <style>{`
        @media (min-width: 1280px) { .anchor-nav { display: block !important; } .training-content-area { max-width: 1040px !important; } }
        /* Content sections hardcode 2- and 3-column grids inline. Inline styles outrank
           stylesheet rules, so collapsing them to a single column on narrow screens needs
           !important. Scoped to the content area so app chrome is unaffected. Grids already
           using auto-fit/minmax resolve to one column at this width anyway — no-op for them. */
        @media (max-width: 768px) {
          /* :not([role="tablist"]) — some grids are tab strips styled to sit side by
             side and fuse with the panel below. Stacking those breaks the illusion. */
          .training-content-area [style*="grid-template-columns"]:not([role="tablist"]) { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav aria-label="Section pagination" style={{ position: "sticky", bottom: 0, background: `${C.headerBg}ee`, borderTop: `1px solid ${C.border}`, padding: "12px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(10px)", zIndex: 160 }}>
        <button onClick={() => currentSection > 0 && onNavigate(currentSection - 1)} disabled={currentSection === 0} aria-disabled={currentSection === 0 ? "true" : undefined}
          onMouseEnter={e => { if (currentSection > 0) { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text; e.currentTarget.style.background = `${C.accent}15`; } }}
          onMouseLeave={e => { if (currentSection > 0) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "none"; } }}
          // C.border as the disabled label was 1.14:1 — invisible rather than dimmed.
          // C.dim at 40% opacity reads as disabled while staying legible.
          style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 20px", minHeight: 44, color: C.dim, opacity: currentSection === 0 ? 0.45 : 1, cursor: currentSection === 0 ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s ease" }}><ChevronLeftIcon style={{ width: 14, height: 14 }} aria-hidden="true" /> Previous</button>
        <div style={{ fontSize: 14, color: C.dim }}>{currentSection + 1} / {sections.length}</div>
        <button onClick={() => currentSection < sections.length - 1 && onNavigate(currentSection + 1)} disabled={currentSection === sections.length - 1} aria-disabled={currentSection === sections.length - 1 ? "true" : undefined}
          // Hovering to C.secondary dropped white-on-purple to 4.41:1, so the CTA
          // failed AA exactly when pointed at. primaryHover is 9.9:1.
          onMouseEnter={e => { if (currentSection < sections.length - 1) { e.currentTarget.style.background = C.primaryHover; e.currentTarget.style.boxShadow = `0 0 12px ${C.primary}66`; } }}
          onMouseLeave={e => { if (currentSection < sections.length - 1) { e.currentTarget.style.background = C.primary; e.currentTarget.style.boxShadow = "none"; } }}
          style={{ background: currentSection === sections.length - 1 ? C.border : C.primary, border: "none", borderRadius: 8, padding: "8px 20px", minHeight: 44, color: currentSection === sections.length - 1 ? C.dim : "#fff", cursor: currentSection === sections.length - 1 ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s ease" }}>Next <ChevronRightIcon style={{ width: 14, height: 14 }} aria-hidden="true" /></button>
      </nav>
    </div>
  );
};

export default TrainingShell;
