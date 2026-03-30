import { useEffect, useRef, useCallback } from "react";
import { C } from "./colors";

const Lightbox = ({ children, onClose, ariaLabelledBy }) => {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, [onClose]);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    const dialog = dialogRef.current;
    if (dialog) {
      const closeBtn = dialog.querySelector("button");
      if (closeBtn) closeBtn.focus();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus();
      }
    };
  }, [handleKeyDown]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 40 }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        onClick={e => e.stopPropagation()}
        style={{ background: "#06040c", borderRadius: 16, padding: 40, border: `1px solid ${C.border}`, maxWidth: 800, width: "100%", cursor: "default", position: "relative", fontSize: 16, lineHeight: 1.8 }}
      >
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, fontFamily: "inherit", lineHeight: 1 }}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Lightbox;
