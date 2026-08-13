import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MODULES } from '../App';
import { buildRoutes, socialHead } from '../../scripts/socialHead.mjs';
import { SITE_ORIGIN } from '../siteMeta';

// What scrapers read is built at build time and never re-checked, so these
// assertions stand in for "paste the link into Slack and look at it".
const routes = buildRoutes(MODULES);
const headFor = (path) => socialHead(routes.find(r => r.path === path));

const tag = (html, attr, key) => {
  const m = html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)" />`));
  return m ? m[1] : null;
};
const og = (html, key) => tag(html, 'property', key);
const tw = (html, key) => tag(html, 'name', key);
const jsonLd = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">\n {4}([\s\S]*?)\n {4}<\/script>/)[1]);

describe('buildRoutes', () => {
  it('covers the home page, every section and the quiz', () => {
    const sectionCount = Object.values(MODULES).reduce((n, m) => n + m.sections.length, 0);
    expect(routes).toHaveLength(sectionCount + 2);
  });

  it('gives every route a unique path', () => {
    const paths = routes.map(r => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe('socialHead — every route', () => {
  it.each(routes.map(r => [r.path]))('%s carries the tags a preview needs', (path) => {
    const html = headFor(path);
    expect(html).toMatch(/<title>.+<\/title>/);
    expect(tag(html, 'name', 'description')).toBeTruthy();
    expect(tag(html, 'name', 'author')).toBe('Patrick Labbett');
    expect(og(html, 'og:site_name')).toBe('Call Center Village');
    expect(og(html, 'og:title')).toBeTruthy();
    expect(og(html, 'og:description')).toBeTruthy();
    expect(og(html, 'og:image:alt')).toBeTruthy();
    expect(tw(html, 'twitter:card')).toBe('summary_large_image');
    expect(tw(html, 'twitter:image:alt')).toBeTruthy();
    expect(tw(html, 'fediverse:creator')).toBe('@callcentervillage@defcon.social');
  });

  it.each(routes.map(r => [r.path]))('%s points og:url and canonical at itself', (path) => {
    const html = headFor(path);
    const expected = `${SITE_ORIGIN}${path}`;
    expect(og(html, 'og:url')).toBe(expected);
    expect(html).toContain(`<link rel="canonical" href="${expected}" />`);
  });

  // A relative og:image is treated as missing by every scraper, and a 404 image
  // shows as a blank card.
  it.each(routes.map(r => [r.path]))('%s uses an absolute image URL', (path) => {
    const html = headFor(path);
    expect(og(html, 'og:image')).toMatch(new RegExp(`^${SITE_ORIGIN}/images/og-[a-z-]*\\.?p?n?g?`));
    expect(og(html, 'og:image')).toBe(tw(html, 'twitter:image'));
    expect(og(html, 'og:image:width')).toBe('1200');
    expect(og(html, 'og:image:height')).toBe('630');
  });

  it.each(routes.map(r => [r.path]))('%s emits JSON-LD that parses', (path) => {
    const graph = jsonLd(headFor(path))['@graph'];
    expect(graph.find(n => n['@type'] === 'Person').name).toBe('Patrick Labbett');
    expect(graph.find(n => n['@type'] === 'WebPage').url).toBe(`${SITE_ORIGIN}${path}`);
  });
});

describe('socialHead — per route type', () => {
  it('serves the default card and website type on the home page', () => {
    const html = headFor('/');
    expect(og(html, 'og:type')).toBe('website');
    expect(og(html, 'og:image')).toBe(`${SITE_ORIGIN}/images/og-card.png`);
    expect(html).not.toContain('article:author');
  });

  it('serves the module card on a module section', () => {
    const html = headFor('/voice-cloning/intro');
    expect(og(html, 'og:image')).toBe(`${SITE_ORIGIN}/images/og-voice-cloning.png`);
    expect(og(html, 'og:image:alt')).toContain('Voice Cloning');
  });

  it('serves the quiz card on the quiz', () => {
    expect(og(headFor('/quiz'), 'og:image')).toBe(`${SITE_ORIGIN}/images/og-quiz.png`);
  });

  // article is what makes Facebook and LinkedIn show a byline at all.
  it('marks section pages as articles with an author and section', () => {
    const html = headFor('/social-engineering/intro');
    expect(og(html, 'og:type')).toBe('article');
    expect(og(html, 'article:author')).toBe('Patrick Labbett');
    expect(og(html, 'article:publisher')).toBe('Call Center Village');
    expect(og(html, 'article:section')).toBe('Social Engineering');
  });

  it('gives section pages a home > module > section trail', () => {
    const graph = jsonLd(headFor('/voice-agents/intro'))['@graph'];
    const crumbs = graph.find(n => n['@type'] === 'BreadcrumbList').itemListElement;
    expect(crumbs.map(c => c.name)).toEqual(['Call Center Village', 'Voice Agents', expect.any(String)]);
    expect(crumbs.map(c => c.position)).toEqual([1, 2, 3]);
  });

  it('leaves the home page without a breadcrumb trail', () => {
    expect(jsonLd(headFor('/'))['@graph'].find(n => n['@type'] === 'BreadcrumbList')).toBeUndefined();
  });
});

describe('socialHead — escaping', () => {
  const nasty = {
    path: '/x', canonical: '/x', cardKey: 'default', ogType: 'website', breadcrumbs: [],
    title: 'Quote " & <b>bold</b>', description: 'Ampersand & "quoted"',
  };

  it('escapes quotes and angle brackets in attribute values', () => {
    const html = socialHead(nasty);
    expect(html).toContain('&quot;');
    expect(html).not.toMatch(/content="[^"]*<b>/);
    // Attributes must still parse: exactly one og:title with a closing quote.
    expect(og(html, 'og:title')).toBeTruthy();
  });

  // A raw </script> in the JSON-LD would end the block and dump markup into the
  // page, so the "<" is escaped as <.
  it('never lets a raw </script> into the JSON-LD', () => {
    const html = socialHead({ ...nasty, title: 'a</script><img src=x>' });
    const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
    expect(block).not.toContain('</script>');
    expect(JSON.parse(block.trim())['@graph'].find(n => n['@type'] === 'WebPage').name)
      .toContain('</script>');
  });
});

// The prerenderer swaps everything between the markers. If a tag in index.html
// sits outside them it survives the swap and the page ships two of it — and
// scrapers take the first, which would be the stale home-page value.
describe('index.html marker region', () => {
  const SOCIAL_REGION = /<!-- social:start -->[\s\S]*?<!-- social:end -->/;
  const template = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
  const swapped = template.replace(SOCIAL_REGION,
    () => `<!-- social:start -->\n    ${socialHead(routes.find(r => r.path === '/quiz'))}\n    <!-- social:end -->`);

  const count = (haystack, needle) => haystack.split(needle).length - 1;

  it.each([
    ['<title>'],
    ['name="description"'],
    ['name="author"'],
    ['rel="canonical"'],
    ['property="og:title"'],
    ['property="og:description"'],
    ['property="og:url"'],
    ['property="og:image"'],
    ['property="og:type"'],
    ['name="twitter:title"'],
    ['name="twitter:image"'],
    ['name="fediverse:creator"'],
    ['application/ld+json'],
  ])('leaves exactly one %s after the swap', (needle) => {
    expect(count(swapped, needle)).toBe(1);
  });

  it('actually replaced the home values', () => {
    expect(swapped).toContain(`${SITE_ORIGIN}/quiz`);
    expect(count(swapped, 'og-card.png')).toBe(0);
  });
});
