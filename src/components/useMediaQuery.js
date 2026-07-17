import { useCallback, useSyncExternalStore } from "react";

// Inline styles can't express media queries, so layout that must change by
// viewport reads the breakpoint as a value instead. useSyncExternalStore keeps
// this out of an effect — no setState-in-effect, no cascading render.
export const useMediaQuery = (query) => {
  const subscribe = useCallback((onChange) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Fall back to desktop where matchMedia is unavailable.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};

export const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
