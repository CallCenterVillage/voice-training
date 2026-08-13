import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SECTIONS as VC } from '../modules/voice-cloning';
import { SECTIONS as VA } from '../modules/voice-agents';
import { SECTIONS as SE } from '../modules/social-engineering';
import { SECTIONS as AP } from '../modules/appendix';

const ORIGIN = 'https://callcentervillage.org';

const MODULES = {
  'voice-cloning': VC,
  'voice-agents': VA,
  'social-engineering': SE,
  appendix: AP,
};

const expectedRoutes = Object.entries(MODULES)
  .flatMap(([slug, sections]) => sections.map(s => `/${slug}/${s.id}`))
  .concat('/quiz');

// Vitest runs from the project root.
const read = (p) => readFileSync(join(process.cwd(), p), 'utf8');

// These files are hand-maintained but must track the SECTIONS arrays. Without a
// test they rot silently the first time somebody adds a section.
describe('sitemap.xml', () => {
  const sitemap = read('public/sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  it('lists every route', () => {
    const missing = expectedRoutes.filter(r => !locs.includes(`${ORIGIN}${r}`));
    expect(missing).toEqual([]);
  });

  it('lists no route that does not exist', () => {
    const extra = locs
      .map(l => l.replace(ORIGIN, ''))
      .filter(p => p !== '/' && !expectedRoutes.includes(p));
    expect(extra).toEqual([]);
  });

  it('includes the site root', () => {
    expect(locs).toContain(`${ORIGIN}/`);
  });
});

describe('netlify.toml', () => {
  const toml = read('netlify.toml');

  // The SPA rewrite is scoped per module so unknown URLs get a real 404. That
  // means a new module needs a rule here or its deep links 404 in production.
  it('has an SPA rewrite for every module', () => {
    const missing = Object.keys(MODULES).filter(slug => !toml.includes(`from = "/${slug}/*"`));
    expect(missing).toEqual([]);
  });

  it('falls through to a real 404', () => {
    expect(toml).toContain('to = "/404.html"');
    expect(toml).toContain('status = 404');
  });

  it('does not set HSTS (that belongs at the Cloudflare edge)', () => {
    expect(toml).not.toContain('Strict-Transport-Security');
  });
});

describe('robots.txt', () => {
  it('points at the sitemap', () => {
    expect(read('public/robots.txt')).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });
});

describe('security.txt', () => {
  const txt = read('public/.well-known/security.txt');

  it('has a contact', () => {
    expect(txt).toMatch(/^Contact: /m);
  });

  // RFC 9116 requires Expires, and an expired file is treated as invalid.
  it('has an Expires date in the future', () => {
    const match = txt.match(/^Expires: (.+)$/m);
    expect(match).toBeTruthy();
    expect(new Date(match[1]).getTime()).toBeGreaterThan(Date.now());
  });
});
