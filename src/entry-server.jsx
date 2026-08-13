import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import App from "./App.jsx";

export { MODULES, SITE_ORIGIN } from "./App.jsx";

/**
 * Render one route to a static HTML string.
 *
 * renderToPipeableStream (not renderToString) because sections are React.lazy;
 * only the streaming renderer waits for Suspense boundaries to resolve, via
 * onAllReady. renderToString would emit the fallbacks instead.
 */
export function render(path) {
  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <App initialPath={path} />
      </StrictMode>,
      {
        onAllReady() {
          const sink = new PassThrough();
          const chunks = [];
          sink.on("data", c => chunks.push(c));
          sink.on("end", () => {
            if (didError) reject(new Error(`render failed for ${path}`));
            else resolve(Buffer.concat(chunks).toString("utf8"));
          });
          sink.on("error", reject);
          pipe(sink);
        },
        onError(err) {
          didError = true;
          console.error(`[prerender] ${path}:`, err.message);
        },
      },
    );

    // A hung lazy import should fail the build, not stall it forever.
    setTimeout(() => {
      abort();
      reject(new Error(`render timed out for ${path}`));
    }, 20000).unref?.();
  });
}
