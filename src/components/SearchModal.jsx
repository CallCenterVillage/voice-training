import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { C } from "./colors";
import { useIsMobile } from "./useMediaQuery";
import { useLockBodyScroll } from "./useLockBodyScroll";
import Icon from "./Icon";

const CATEGORY_COLORS = {
  Section: C.accent,
  Quiz: C.secondary,
  Resource: C.tertiary,
  Tool: C.highlight,
};

const srOnly = {
  position: "absolute", width: 1, height: 1, overflow: "hidden",
  clip: "rect(0,0,0,0)", whiteSpace: "nowrap",
};

const SearchModal = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const isMobile = useIsMobile();
  useLockBodyScroll();

  // The index pulls in every module's section list, all the appendix tool data
  // and the full quiz bank. Loading it when the modal opens keeps ~90 KB out of
  // the initial bundle for the majority of visits that never search.
  const [index, setIndex] = useState(null);
  useEffect(() => {
    let cancelled = false;
    import("../searchIndex").then(m => {
      if (!cancelled) setIndex(m.SEARCH_INDEX);
    });
    return () => { cancelled = true; };
  }, []);

  const results = useMemo(() => (!index || query.length < 2) ? [] : index.filter(entry =>
    entry.text.includes(query.toLowerCase())
  ).slice(0, 20), [query, index]);

  const handleSelect = useCallback((result) => {
    onNavigate(result.route.moduleSlug, result.route.sectionIndex);
    onClose();
    if (result.route.anchor) {
      setTimeout(() => {
        const el = document.getElementById(result.route.anchor);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [onNavigate, onClose]);

  // Bound to the document, not the input. Previously Escape only worked while
  // the input held focus, so tabbing to the close button killed the shortcut,
  // and Tab walked straight out of the overlay into the page behind it.
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }

    if (e.key === "Tab") {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else if (document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
      return;
    }

    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); return; }
    if (e.key === "Enter" && results[selectedIdx]) { e.preventDefault(); handleSelect(results[selectedIdx]); }
  }, [results, selectedIdx, handleSelect, onClose]);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    inputRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Without this, closing search drops focus to <body> and a keyboard user
      // restarts tabbing from the top of the document.
      if (previousFocus.current?.focus) previousFocus.current.focus();
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const selected = listRef.current.children[selectedIdx];
      if (selected) selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx, results.length]);

  const activeId = results.length > 0 ? `search-result-${selectedIdx}` : undefined;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? "16px 12px" : "80px 16px 16px" }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={e => e.stopPropagation()}
        style={{ background: "#06040c", borderRadius: 16, border: `1px solid ${C.border}`, width: "100%", maxWidth: 720, maxHeight: isMobile ? "80dvh" : "70dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="magnifying-glass" size={18} style={{ color: C.dim, flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search sections, tools, resources and quiz questions"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Search sections, tools, resources, quiz questions..."
            style={{
              flex: 1, background: "none", border: "none", color: C.text,
              // 16px keeps iOS from zooming the viewport on focus.
              fontSize: 16, fontFamily: "inherit", outline: "none", minWidth: 0,
            }}
          />
          <button onClick={onClose} aria-label="Close search" style={{ background: `${C.border}`, border: "none", borderRadius: 6, minWidth: 44, minHeight: 44, color: C.dim, cursor: "pointer", fontFamily: "inherit", fontSize: 12, flexShrink: 0 }}>ESC</button>
        </div>

        {/* Arrow keys moved a purely visual highlight that no screen reader could
            perceive, and the result count was never announced. */}
        <div aria-live="polite" aria-atomic="true" style={srOnly}>
          {query.length >= 2 && index && `${results.length} result${results.length === 1 ? "" : "s"} for ${query}`}
        </div>

        <div
          ref={listRef}
          id="search-results"
          role="listbox"
          aria-label="Search results"
          style={{ overflowY: "auto", padding: results.length > 0 ? "8px 0" : 0 }}
        >
          {query.length >= 2 && !index && (
            <div style={{ padding: "24px 20px", textAlign: "center", color: C.dim, fontSize: 14 }} role="status">Loading search index…</div>
          )}
          {query.length >= 2 && index && results.length === 0 && (
            <div style={{ padding: "24px 20px", textAlign: "center", color: C.dim, fontSize: 14 }}>No results found</div>
          )}
          {results.map((result, i) => {
            const isSelected = i === selectedIdx;
            const catColor = CATEGORY_COLORS[result.category] || C.muted;
            return (
              <div
                key={i}
                id={`search-result-${i}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIdx(i)}
                style={{
                  padding: "12px 20px", minHeight: 44, cursor: "pointer",
                  background: isSelected ? `${C.accent}10` : "transparent",
                  display: "flex", alignItems: "center", gap: 12,
                  transition: "background 0.1s ease",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: isSelected ? C.text : C.muted, fontWeight: isSelected ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {result.label}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: catColor, background: `${catColor}15`, padding: "2px 8px", borderRadius: 4, flexShrink: 0 }}>
                  {result.category}
                </span>
                <span style={{ fontSize: 12, color: C.dim, flexShrink: 0 }}>
                  {result.module}
                </span>
              </div>
            );
          })}
        </div>

        {query.length < 2 && (
          <div style={{ padding: "24px 20px", textAlign: "center", color: C.dim, fontSize: 13 }}>
            Type at least 2 characters to search
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
