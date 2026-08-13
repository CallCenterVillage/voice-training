import { useRef } from "react";

/**
 * WAI-ARIA tab pattern: roving tabIndex, arrow/Home/End traversal, and tabs
 * wired to their panel.
 *
 * The hand-rolled `role="tablist"` markup this replaces had none of that — a
 * screen reader announced "tab 2 of 5" and users reached for arrow keys that
 * did nothing, while Tab stepped through every tab instead of skipping to the
 * panel.
 *
 * Styling stays with the caller via `tabStyle(isSelected, tab)` so each site
 * keeps its own look.
 */

// Panels are conditionally rendered, so only the selected tab gets
// aria-controls — pointing it at an id that is not in the DOM would be invalid.
export const tabPanelProps = (idBase, selectedKey) => ({
  role: "tabpanel",
  id: `${idBase}-panel-${selectedKey}`,
  "aria-labelledby": `${idBase}-tab-${selectedKey}`,
  tabIndex: 0,
});

const Tabs = ({ idBase, label, tabs, selected, onSelect, tabStyle, style }) => {
  const refs = useRef({});
  const found = tabs.findIndex(t => t.key === selected);
  const activeIdx = found >= 0 ? found : 0;

  const handleKeyDown = (e) => {
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (activeIdx + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (activeIdx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;

    e.preventDefault();
    const key = tabs[next].key;
    onSelect(key);
    refs.current[key]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={handleKeyDown} style={style}>
      {tabs.map((t, i) => {
        const isSelected = i === activeIdx;
        return (
          <button
            key={t.key}
            ref={el => { refs.current[t.key] = el; }}
            role="tab"
            id={`${idBase}-tab-${t.key}`}
            aria-selected={isSelected}
            aria-controls={isSelected ? `${idBase}-panel-${t.key}` : undefined}
            // Roving tabIndex: Tab moves into the strip once, then into the panel.
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(t.key)}
            style={tabStyle(isSelected, t)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
