import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { C } from "./components/colors";
import { useIsMobile } from "./components/useMediaQuery";
import { SECTIONS as VC_SECTIONS, COMPS as VC_COMPS } from "./modules/voice-cloning";
import { SECTIONS as VA_SECTIONS, COMPS as VA_COMPS } from "./modules/voice-agents";
import { SECTIONS as SE_SECTIONS, COMPS as SE_COMPS } from "./modules/social-engineering";
import { SECTIONS as AP_SECTIONS, COMPS as AP_COMPS } from "./modules/appendix";
import TrainingShell from "./components/TrainingShell";
// QuizPage drags in the whole 54 KB quiz bank; only /quiz needs it.
const QuizPage = lazy(() => import("./modules/quiz/QuizPage"));
const SearchModal = lazy(() => import("./components/SearchModal"));
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Exported for the prerenderer, which enumerates routes and derives per-page
// titles from the same source the app routes on.
export const MODULES = {
  "voice-cloning": { sections: VC_SECTIONS, comps: VC_COMPS, title: "Voice Cloning", name: "Voice Cloning" },
  "voice-agents": { sections: VA_SECTIONS, comps: VA_COMPS, title: "Voice Agents", name: "Voice Agents" },
  "social-engineering": { sections: SE_SECTIONS, comps: SE_COMPS, title: "Social Engineering", name: "Social Engineering" },
  "appendix": { sections: AP_SECTIONS, comps: AP_COMPS, title: "Appendix", name: "Appendix" },
};

const MAIN_MODULES = ["voice-cloning", "voice-agents", "social-engineering"];

export const SITE_ORIGIN = "https://callcentervillage.org";

// Height of the fixed module nav. Buttons are 44px (WCAG 2.5.5) plus 6px of
// vertical padding either side. Content offset must match, so it lives here
// rather than being repeated as a literal.
const NAV_HEIGHT = 56;

function getRouteFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "quiz") return { moduleSlug: "quiz", sectionId: null };
  const moduleSlug = parts[0] && MODULES[parts[0]] ? parts[0] : "voice-cloning";
  const sectionId = parts[1] || null;
  return { moduleSlug, sectionId };
}

function resolveSectionIndex(moduleSlug, sectionId) {
  const mod = MODULES[moduleSlug];
  if (!mod || !sectionId) return 0;
  const idx = mod.sections.findIndex(s => s.id === sectionId);
  return idx >= 0 ? idx : 0;
}

// `initialPath` is supplied by the prerenderer, which has no window.
export default function App({ initialPath }) {
  const isBrowser = typeof window !== "undefined";

  const getState = useCallback(() => {
    const pathname = isBrowser ? window.location.pathname : (initialPath || "/");
    const { moduleSlug, sectionId } = getRouteFromPath(pathname);
    if (moduleSlug === "quiz") return { moduleSlug: "quiz", sectionIndex: 0 };
    return { moduleSlug, sectionIndex: resolveSectionIndex(moduleSlug, sectionId) };
  }, [isBrowser, initialPath]);

  const [route, setRoute] = useState(() => {
    const state = getState();
    if (!isBrowser) return state;
    if (state.moduleSlug === "quiz") {
      if (window.location.pathname !== "/quiz") history.replaceState(null, "", "/quiz");
      return state;
    }
    const expectedPath = `/${state.moduleSlug}/${MODULES[state.moduleSlug].sections[state.sectionIndex].id}`;
    if (window.location.pathname !== expectedPath) {
      history.replaceState(null, "", expectedPath);
    }
    return state;
  });

  const navigate = useCallback((moduleSlug, sectionIndex) => {
    if (moduleSlug === "quiz") {
      history.pushState(null, "", "/quiz");
      setRoute({ moduleSlug: "quiz", sectionIndex: 0 });
      window.scrollTo(0, 0);
      return;
    }
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

  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const isQuiz = route.moduleSlug === "quiz";
  const mod = isQuiz ? null : MODULES[route.moduleSlug];

  // Every route otherwise shares one title and one canonical, which reads as ~36
  // duplicate pages to crawlers and gives screen readers no page-change signal.
  useEffect(() => {
    const section = isQuiz ? null : MODULES[route.moduleSlug].sections[route.sectionIndex];
    const label = isQuiz
      ? "Knowledge Test"
      : `${section.title} — ${MODULES[route.moduleSlug].title}`;
    document.title = `${label} | Call Center Village`;

    const path = isQuiz ? "/quiz" : `/${route.moduleSlug}/${section.id}`;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${SITE_ORIGIN}${path}`;
  }, [route.moduleSlug, route.sectionIndex, isQuiz]);

  const renderNavButton = (slug, label, isActive) => (
    <button
      key={slug}
      onClick={() => navigate(slug, 0)}
      // These change window.location — they are navigation links, not tabs. A
      // tablist role would override the nav landmark and promise arrow-key
      // traversal that doesn't exist.
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={e => { if (!isActive) { e.target.style.borderColor = C.accent; e.target.style.color = C.text; e.target.style.background = `${C.accent}15`; } }}
      onMouseLeave={e => { if (!isActive) { e.target.style.borderColor = C.border; e.target.style.color = C.muted; e.target.style.background = "transparent"; } }}
      style={{
        background: isActive ? C.primary : "transparent",
        border: `1px solid ${isActive ? C.primary : C.border}`,
        borderRadius: 6, padding: isMobile ? "8px 12px" : "8px 20px",
        minHeight: 44,
        color: isActive ? "#fff" : C.muted,
        cursor: "pointer", fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: 14, fontWeight: 600,
        transition: "all 0.2s ease",
        // Keep the nav a single NAV_HEIGHT row.
        flexShrink: 0, whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        *:focus-visible { outline: 2px solid #38b6ff; outline-offset: 2px; }
        .module-tabs::-webkit-scrollbar { display: none; }
      `}</style>
      <nav aria-label="Module switcher" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: `${C.bg}ee`, borderBottom: `1px solid ${C.border}`,
        padding: isMobile ? "6px 8px" : "6px 16px", display: "flex", alignItems: "center",
        gap: 8,
        backdropFilter: "blur(10px)",
      }}>
        {/* Scrolls horizontally rather than wrapping — the nav must stay one row. */}
        <div className="module-tabs" style={{
          display: "flex", gap: 8, flex: 1,
          justifyContent: isMobile ? "flex-start" : "center",
          overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none",
        }}>
          {MAIN_MODULES.map(slug => renderNavButton(slug, MODULES[slug].name, slug === route.moduleSlug))}
          {renderNavButton("quiz", "Knowledge Test", isQuiz)}
          {/* On mobile the right-hand cluster shrinks to the search icon, so Appendix
              moves in here rather than becoming unreachable. */}
          {isMobile && renderNavButton("appendix", "Appendix", route.moduleSlug === "appendix")}
        </div>
        {/* In flow, not absolute — absolute took it out of layout and let it paint over the tabs. */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            style={{
              background: "none", border: `1px solid ${C.border}`, borderRadius: 6,
              padding: isMobile ? "7px 12px" : "7px 16px", color: C.muted, cursor: "pointer",
              minWidth: isMobile ? 44 : 160, minHeight: 44, justifyContent: "center",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 13,
              transition: "all 0.2s ease", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
          >
            <MagnifyingGlassIcon style={{ width: 14, height: 14, flexShrink: 0 }} aria-hidden="true" />
            {!isMobile && "Search"}
          </button>
          {!isMobile && renderNavButton("appendix", "Appendix", route.moduleSlug === "appendix")}
        </div>
      </nav>
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchModal onClose={() => setSearchOpen(false)} onNavigate={navigate} />
        </Suspense>
      )}
      {isQuiz ? (
        // QuizPage and TrainingShell each render their own <main>; a wrapper <main>
        // here would nest landmarks and produce invalid HTML.
        <div style={{ paddingTop: NAV_HEIGHT }}>
          <Suspense fallback={<div style={{ minHeight: "60vh" }} role="status" />}>
            <QuizPage onBack={() => navigate("voice-cloning", 0)} />
          </Suspense>
        </div>
      ) : (
        <div style={{ paddingTop: NAV_HEIGHT }}>
          <TrainingShell
            sections={mod.sections}
            sectionComponents={mod.comps}
            moduleTitle={mod.title}
            topOffset={NAV_HEIGHT}
            currentSection={route.sectionIndex}
            onNavigate={(index) => navigate(route.moduleSlug, index)}
          />
        </div>
      )}
    </div>
  );
}
