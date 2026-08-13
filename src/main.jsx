import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// createRoot, not hydrateRoot, even though #root arrives prerendered.
//
// Hydration requires the client's first render to match the server's, and two
// things here deliberately do not: QuizBank shuffles its questions with
// Math.random on mount, and useIsMobile resolves to desktop on the server (no
// matchMedia) then to the real breakpoint in the browser. Hydrating would mean
// mismatch errors on most pages.
//
// So the prerendered HTML is there for crawlers, social scrapers and first
// paint; React then replaces it in a single commit. The visible cost is that
// phones briefly show the desktop layout before the breakpoint resolves.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
