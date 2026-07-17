import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { C } from "./colors";
import { SEARCH_INDEX } from "../searchIndex";
import Icon from "./Icon";

const CATEGORY_COLORS = {
  Section: C.accent,
  Quiz: C.secondary,
  Resource: C.tertiary,
  Tool: C.highlight,
};

const SearchModal = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => query.length < 2 ? [] : SEARCH_INDEX.filter(entry =>
    entry.text.includes(query.toLowerCase())
  ).slice(0, 20), [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); return; }
    if (e.key === "Enter" && results[selectedIdx]) { e.preventDefault(); handleSelect(results[selectedIdx]); }
  }, [results, selectedIdx, handleSelect, onClose]);

  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const selected = listRef.current.children[selectedIdx];
      if (selected) selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx, results.length]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#06040c", borderRadius: 16, border: `1px solid ${C.border}`, width: "100%", maxWidth: 720, maxHeight: "70vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="magnifying-glass" size={18} style={{ color: C.dim, flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search sections, tools, resources, quiz questions..."
            style={{
              flex: 1, background: "none", border: "none", color: C.text,
              fontSize: 16, fontFamily: "inherit", outline: "none",
            }}
          />
          <button onClick={onClose} style={{ background: `${C.border}`, border: "none", borderRadius: 4, padding: "2px 8px", color: C.dim, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>ESC</button>
        </div>

        <div ref={listRef} style={{ overflowY: "auto", padding: results.length > 0 ? "8px 0" : 0 }}>
          {query.length >= 2 && results.length === 0 && (
            <div style={{ padding: "24px 20px", textAlign: "center", color: C.dim, fontSize: 14 }}>No results found</div>
          )}
          {results.map((result, i) => {
            const isSelected = i === selectedIdx;
            const catColor = CATEGORY_COLORS[result.category] || C.muted;
            return (
              <div
                key={i}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIdx(i)}
                style={{
                  padding: "10px 20px", cursor: "pointer",
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
                <span style={{ fontSize: 11, fontWeight: 600, color: catColor, background: `${catColor}15`, padding: "2px 8px", borderRadius: 4, flexShrink: 0 }}>
                  {result.category}
                </span>
                <span style={{ fontSize: 11, color: C.dim, flexShrink: 0 }}>
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
