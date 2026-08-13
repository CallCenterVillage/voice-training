/**
 * Render every route to static HTML at build time.
 *
 * Without this, all ~36 URLs serve one empty shell with one title: crawlers and
 * social scrapers see nothing, and every route looks like a duplicate. The
 * client still takes over on load — this only changes what arrives in the HTML.
 *
 * Run via `pnpm build`, which does: vite build -> vite build --ssr -> this.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const DIST = "dist";
const SSR_ENTRY = "../dist-ssr/entry-server.js";

const { render, MODULES, SITE_ORIGIN } = await import(SSR_ENTRY);

const template = readFileSync(join(DIST, "index.html"), "utf8");

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// One description per route. Generic enough to be honest, specific enough that
// no two pages read identically.
const describe = (moduleTitle, sectionTitle) =>
  `${sectionTitle} — part of the ${moduleTitle} module in Call Center Village's ` +
  `voice security training. Free, hands-on material on voice cloning, voice ` +
  `agents and social engineering.`;

const routes = [
  { path: "/", title: "Voice Security Training", description: null, canonical: "/" },
];

for (const [slug, mod] of Object.entries(MODULES)) {
  for (const section of mod.sections) {
    routes.push({
      path: `/${slug}/${section.id}`,
      title: `${section.title} — ${mod.title}`,
      description: describe(mod.title, section.title),
      canonical: `/${slug}/${section.id}`,
    });
  }
}
routes.push({
  path: "/quiz",
  title: "Knowledge Test",
  description: "Test your understanding of voice cloning, voice agents and social engineering with the full Call Center Village question bank.",
  canonical: "/quiz",
});

/** Swap the content of a meta/title/link tag already present in the template. */
const replaceTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: template is missing an expected tag: ${pattern}`);
  }
  return html.replace(pattern, replacement);
};

let written = 0;

for (const route of routes) {
  const appHtml = await render(route.path);

  const fullTitle = `${route.title} | Call Center Village`;
  const description = route.description
    ?? "Free, hands-on training in voice security: AI voice cloning, voice agent architecture and attack surface, and social engineering against humans and AI agents.";
  const url = `${SITE_ORIGIN}${route.canonical}`;

  let html = template;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  html = replaceTag(html, /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`);
  html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${escapeHtml(url)}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${escapeHtml(url)}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  html = replaceTag(html, /<div id="root"><\/div>/, `<div id="root">${appHtml}</div>`);

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
