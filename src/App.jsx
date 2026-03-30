import { useState, useEffect, useCallback } from "react";
import { C } from "./components";
import { SECTIONS as VC_SECTIONS, COMPS as VC_COMPS } from "./modules/voice-cloning";
import { SECTIONS as VA_SECTIONS, COMPS as VA_COMPS } from "./modules/voice-agents";
import { SECTIONS as SE_SECTIONS, COMPS as SE_COMPS } from "./modules/social-engineering";
import { SECTIONS as AP_SECTIONS, COMPS as AP_COMPS } from "./modules/appendix";
import TrainingShell from "./components/TrainingShell";

const MODULES = {
  "voice-cloning": { sections: VC_SECTIONS, comps: VC_COMPS, title: "Voice Cloning", name: "Voice Cloning" },
  "voice-agents": { sections: VA_SECTIONS, comps: VA_COMPS, title: "Voice Agents", name: "Voice Agents" },
  "social-engineering": { sections: SE_SECTIONS, comps: SE_COMPS, title: "Social Engineering", name: "Social Engineering" },
  "appendix": { sections: AP_SECTIONS, comps: AP_COMPS, title: "Appendix", name: "Appendix" },
};

const MODULE_SLUGS = Object.keys(MODULES);

function getRouteFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const moduleSlug = parts[0] && MODULES[parts[0]] ? parts[0] : "voice-cloning";
  const sectionId = parts[1] || null;
  return { moduleSlug, sectionId };
}

function resolveSectionIndex(moduleSlug, sectionId) {
  const mod = MODULES[moduleSlug];
  if (!sectionId) return 0;
  const idx = mod.sections.findIndex(s => s.id === sectionId);
  return idx >= 0 ? idx : 0;
}

export default function App() {
  const getState = useCallback(() => {
    const { moduleSlug, sectionId } = getRouteFromPath(window.location.pathname);
    return { moduleSlug, sectionIndex: resolveSectionIndex(moduleSlug, sectionId) };
  }, []);

  const [route, setRoute] = useState(() => {
    const state = getState();
    // Redirect if URL needs normalization
    const expectedPath = `/${state.moduleSlug}/${MODULES[state.moduleSlug].sections[state.sectionIndex].id}`;
    if (window.location.pathname !== expectedPath) {
      history.replaceState(null, "", expectedPath);
    }
    return state;
  });

  const navigate = useCallback((moduleSlug, sectionIndex) => {
    const mod = MODULES[moduleSlug];
    const sectionId = mod.sections[sectionIndex].id;
    const path = `/${moduleSlug}/${sectionId}`;
    history.pushState(null, "", path);
    setRoute({ moduleSlug, sectionIndex });
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const state = getState();
      setRoute(state);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [getState]);

  const mod = MODULES[route.moduleSlug];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`*:focus-visible { outline: 2px solid #38b6ff; outline-offset: 2px; }`}</style>
      <nav aria-label="Module switcher" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: `${C.bg}ee`, borderBottom: `1px solid ${C.border}`,
        padding: "8px 16px", display: "flex", gap: 8, justifyContent: "center",
        backdropFilter: "blur(10px)",
      }} role="tablist">
        {MODULE_SLUGS.map((slug) => {
          const isActive = slug === route.moduleSlug;
          return (
            <button
              key={slug}
              onClick={() => navigate(slug, 0)}
              role="tab"
              aria-selected={isActive}
              onMouseEnter={e => { if (!isActive) { e.target.style.borderColor = C.accent; e.target.style.color = C.text; e.target.style.background = `${C.accent}15`; } }}
              onMouseLeave={e => { if (!isActive) { e.target.style.borderColor = C.border; e.target.style.color = C.muted; e.target.style.background = "transparent"; } }}
              style={{
                background: isActive ? C.primary : "transparent",
                border: `1px solid ${isActive ? C.primary : C.border}`,
                borderRadius: 6, padding: "8px 20px",
                color: isActive ? "#fff" : C.muted,
                cursor: "pointer", fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontSize: 14, fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              {MODULES[slug].name}
            </button>
          );
        })}
      </nav>
      <main style={{ paddingTop: 48 }}>
        <TrainingShell
          sections={mod.sections}
          sectionComponents={mod.comps}
          moduleTitle={mod.title}
          topOffset={48}
          currentSection={route.sectionIndex}
          onNavigate={(index) => navigate(route.moduleSlug, index)}
        />
      </main>
    </div>
  );
}
