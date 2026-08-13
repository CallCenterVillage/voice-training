import { useEffect } from "react";

/**
 * Freezes background scrolling while an overlay is mounted.
 *
 * Without this the page scrolls under the modal — on iOS Safari that also
 * collapses and re-expands the URL bar mid-interaction, and closing the overlay
 * leaves you at a different scroll position than you opened it from.
 *
 * Nested overlays are handled by refcounting: only the first lock records the
 * original overflow and only the last unlock restores it.
 */
let lockCount = 0;
let previousOverflow = "";

export const useLockBodyScroll = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [enabled]);
};

export default useLockBodyScroll;
