import { useEffect, useRef, useCallback } from "react";
import { C } from "./colors";
import { useIsMobile } from "./useMediaQuery";
import { useLockBodyScroll } from "./useLockBodyScroll";

const Lightbox = ({ children, onClose, ariaLabelledBy, ariaLabel }) => {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const isMobile = useIsMobile();
  useLockBodyScroll();

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
    // alignItems flex-start + overflowY auto: centring with no scroll clipped
    // long card bodies at BOTH ends on short viewports, with no way to reach them.
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center", overflowY: "auto", cursor: "zoom-out", padding: isMobile ? 16 : 40 }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        onClick={e => e.stopPropagation()}
        // 40 + 40 of padding left a 215px text column at 375px wide.
        style={{ background: "#06040c", borderRadius: 16, padding: isMobile ? "48px 20px 20px" : 40, border: `1px solid ${C.border}`, maxWidth: 800, width: "100%", margin: "auto", cursor: "default", position: "relative", fontSize: 16, lineHeight: 1.8 }}
      >
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 24, fontFamily: "inherit", lineHeight: 1, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Lightbox;
