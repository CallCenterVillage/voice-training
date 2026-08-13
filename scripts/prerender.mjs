/**
 * Render every route to static HTML at build time.
 *
 * Without this, all ~37 URLs serve one empty shell with one title: crawlers and
 * social scrapers see nothing, and every route looks like a duplicate. The
 * client still takes over on load — this only changes what arrives in the HTML.
 *
 * The head each route gets is built by scripts/socialHead.mjs, which is where
 * the og:/twitter:/JSON-LD markup and the route list live. This file only walks
 * the routes and writes the files.
 *
 * Run via `pnpm build`, which does: vite build -> vite build --ssr -> this.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

import { buildRoutes, socialHead } from "./socialHead.mjs";

const DIST = "dist";
const SSR_ENTRY = "../dist-ssr/entry-server.js";

const { render, MODULES } = await import(SSR_ENTRY);

const template = readFileSync(join(DIST, "index.html"), "utf8");

/** Swap a region of the template, failing loudly if it is not there. */
const replaceOnce = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: template is missing an expected region: ${pattern}`);
  }
  return html.replace(pattern, replacement);
};

const SOCIAL_REGION = /<!-- social:start -->[\s\S]*?<!-- social:end -->/;
const ROOT_DIV = /<div id="root"><\/div>/;

const routes = buildRoutes(MODULES);
let written = 0;

for (const route of routes) {
  const appHtml = await render(route.path);

  let html = template;
  // $ in a replacement string is special to String.replace, so pass a function.
  html = replaceOnce(html, SOCIAL_REGION,
    () => `<!-- social:start -->\n    ${socialHead(route)}\n    <!-- social:end -->`);
  html = replaceOnce(html, ROOT_DIV, () => `<div id="root">${appHtml}</div>`);

  const outPath = route.path === "/"
    ? join(DIST, "index.html")
    : join(DIST, route.path, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  written++;
}

// The SSR bundle is a build artifact, not something to publish.
rmSync("dist-ssr", { recursive: true, force: true });

console.log(`prerendered ${written} routes`);
