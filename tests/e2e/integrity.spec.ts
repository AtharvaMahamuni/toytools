// Registry & sitemap structural integrity — protects the engine-driven architecture as the
// tool count scales. Asserts the in-source metadata contract is complete and uniquely keyed,
// and that every published sitemap URL actually resolves. Structured over the generated
// sitemap buckets so it extends to guides/faqs/categories/languages as they grow.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { getAllMetadata } from '../../src/data/metadata';
import { engineIds, knownPatterns } from '../../src/data/engines';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function sitemapLocs(bucket: string): string[] {
  const xml = readFileSync(resolve(repoRoot, `dist/sitemaps/${bucket}.xml`), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
}

test.describe('integrity', () => {
  test('every tool has a complete, well-formed metadata record', () => {
    const all = getAllMetadata();
    expect(all.length, 'tools registered').toBeGreaterThan(0);
    for (const m of all) {
      expect(m.slug, `slug for ${m.name}`).toMatch(SLUG_RE);
      expect(m.name.trim(), `name for ${m.slug}`).not.toBe('');
      expect(m.description.trim(), `description for ${m.slug}`).not.toBe('');
      expect(m.category.trim(), `category for ${m.slug}`).not.toBe('');
      // engine/pattern resolve against the single source of truth (src/data/engines.ts).
      expect(engineIds.has(m.engine), `engine "${m.engine}" for ${m.slug}`).toBe(true);
      expect(knownPatterns.has(m.pattern), `pattern "${m.pattern}" for ${m.slug}`).toBe(true);
    }
  });

  test('no duplicate slugs', () => {
    const slugs = getAllMetadata().map((m) => m.slug);
    expect(new Set(slugs).size, 'unique slugs').toBe(slugs.length);
  });

  test('relatedTools reference real slugs', () => {
    const all = getAllMetadata();
    const known = new Set(all.map((m) => m.slug));
    for (const m of all) {
      for (const ref of m.relatedTools) {
        expect(known.has(ref), `${m.slug} → relatedTool "${ref}" exists`).toBe(true);
      }
    }
  });

  test('no duplicate URLs across all sitemap buckets', () => {
    const buckets = ['tools', 'guides', 'categories', 'languages'];
    const all = buckets.flatMap(sitemapLocs);
    expect(all.length, 'sitemap has URLs').toBeGreaterThan(0);
    expect(new Set(all).size, 'every sitemap <loc> is unique').toBe(all.length);
  });

  test('every sitemap tool URL resolves (HTTP 200)', async ({ request }) => {
    for (const loc of sitemapLocs('tools')) {
      const path = new URL(loc).pathname;
      const resp = await request.get(path);
      expect(resp.status(), `GET ${path}`).toBe(200);
    }
  });
});
