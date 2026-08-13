/**
 * Build the per-route <head> that link scrapers read.
 *
 * Split out of prerender.mjs so it can be tested without a full vite build —
 * see src/test/socialHead.test.js. This is the only thing Slack, Discord,
 * Mastodon, Facebook and LinkedIn ever see, and none of them run JS, so a bug
 * here is invisible until someone pastes a link somewhere.
 *
 * Imports src/siteMeta.js directly rather than through the SSR bundle: it is
 * plain ESM with no JSX, so node loads it as-is.
 */
import {
  SITE_ORIGIN,
  SITE_NAME,
  LOCALE,
  DEFAULT_DESCRIPTION,
  AUTHOR,
  FEDIVERSE_CREATOR,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  socialCardFor,
  structuredData,
} from "../src/siteMeta.js";

export const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// A literal "</script>" anywhere in the JSON would close the block early, so the
// escape has to happen on the raw "<" rather than being left to JSON.stringify.
export const escapeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

// One description per route. Generic enough to be honest, specific enough that
// no two pages read identically.
const describe = (moduleTitle, sectionTitle) =>
  `${sectionTitle} — part of the ${moduleTitle} module in Call Center Village's ` +
  `voice security training. Free, hands-on material on voice cloning, voice ` +
  `agents and social engineering.`;

/** Every route to prerender, in sitemap order. */
export function buildRoutes(MODULES) {
  const home = { name: SITE_NAME, url: `${SITE_ORIGIN}/` };

  const routes = [
    {
      path: "/",
      title: "Voice Security Training",
      description: null,
      canonical: "/",
      cardKey: "default",
      ogType: "website",
      breadcrumbs: [],
    },
  ];

  for (const [slug, mod] of Object.entries(MODULES)) {
    // Bare /:module redirects to the first section, so that section stands in
    // for the module in the trail.
    const moduleUrl = `${SITE_ORIGIN}/${slug}/${mod.sections[0].id}`;
    for (const section of mod.sections) {
      routes.push({
        path: `/${slug}/${section.id}`,
        title: `${section.title} — ${mod.title}`,
        description: describe(mod.title, section.title),
        canonical: `/${slug}/${section.id}`,
        cardKey: slug,
        // These are pages of training material with a byline, not landing
        // pages. The article type is what makes consumers show an author.
        ogType: "article",
        articleSection: mod.title,
        breadcrumbs: [
          home,
          { name: mod.title, url: moduleUrl },
          { name: section.title, url: `${SITE_ORIGIN}/${slug}/${section.id}` },
        ],
      });
    }
  }

  routes.push({
    path: "/quiz",
    title: "Knowledge Test",
    description: "Test your understanding of voice cloning, voice agents and social engineering with the full Call Center Village question bank.",
    canonical: "/quiz",
    cardKey: "quiz",
    ogType: "website",
    breadcrumbs: [home, { name: "Knowledge Test", url: `${SITE_ORIGIN}/quiz` }],
  });

  return routes;
}

/** The whole head block a scraper reads, for one route. */
export function socialHead(route) {
  const fullTitle = `${route.title} | ${SITE_NAME}`;
  const description = route.description ?? DEFAULT_DESCRIPTION;
  const url = `${SITE_ORIGIN}${route.canonical}`;
  const card = socialCardFor(route.cardKey);

  const meta = (attr, key, value) =>
    `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  const prop = (key, value) => meta("property", key, value);
  const name = (key, value) => meta("name", key, value);

  const lines = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    name("description", description),
    name("author", AUTHOR.name),
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    "",
    "<!-- Open Graph -->",
    prop("og:type", route.ogType),
    prop("og:site_name", SITE_NAME),
    prop("og:url", url),
    prop("og:title", fullTitle),
    prop("og:description", description),
    prop("og:image", card.image),
    prop("og:image:type", "image/png"),
    prop("og:image:width", String(OG_IMAGE_WIDTH)),
    prop("og:image:height", String(OG_IMAGE_HEIGHT)),
    prop("og:image:alt", card.alt),
    prop("og:locale", LOCALE),
  ];

  if (route.ogType === "article") {
    lines.push(
      prop("article:author", AUTHOR.name),
      prop("article:publisher", SITE_NAME),
      prop("article:section", route.articleSection),
    );
  }

  lines.push(
    "",
    "<!-- Twitter / X -->",
    name("twitter:card", "summary_large_image"),
    name("twitter:title", fullTitle),
    name("twitter:description", description),
    name("twitter:image", card.image),
    name("twitter:image:alt", card.alt),
    "",
    "<!-- Mastodon 4.3+ renders this as the byline on the preview card. -->",
    name("fediverse:creator", FEDIVERSE_CREATOR),
    "",
    '<script type="application/ld+json">',
    escapeJsonLd(structuredData({
      url,
      title: fullTitle,
      description,
      image: card.image,
      breadcrumbs: route.breadcrumbs,
    })),
    "</script>",
  );

  // Re-indent to sit inside <head>, without leaving the blank separator lines
  // as four spaces of trailing whitespace.
  return lines.join("\n    ").split("\n").map(line => line.trimEnd()).join("\n");
}
