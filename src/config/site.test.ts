// The site identity (C3). Pins every value, that the copies which cannot import it still agree
// with it, and that the social card it points at is a real 1200x630 PNG in public/.
import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SITE,
  SITE_ORIGIN,
  PRODUCTION_HOSTNAMES,
  BRAND_NAME,
  TITLE_SUFFIX,
  BRAND_X_HANDLE,
  BRAND_X_URL,
  GA_MEASUREMENT_ID,
  SOCIAL_IMAGE_PATH,
  siteUrl,
} from './site';
import { ORG_ID, PERSON_ID, BRAND_X, SITE_ORIGIN as IDENTITY_ORIGIN } from '@lib/schema/identity';
import { GA_MEASUREMENT_ID as GUARD_GA_ID } from '@lib/analytics/guard';
import { INDEXNOW_HOST, INDEXNOW_SITE } from './indexnow';

const ROOT = resolve(__dirname, '../..');

describe('site identity values', () => {
  it('pins the identity exactly', () => {
    expect(SITE_ORIGIN).toBe('https://toytoolsapp.com');
    expect([...PRODUCTION_HOSTNAMES]).toEqual(['toytoolsapp.com', 'www.toytoolsapp.com']);
    expect(BRAND_NAME).toBe('ToyTools');
    expect(TITLE_SUFFIX).toBe(' ● ToyTools');
    expect(BRAND_X_HANDLE).toBe('@ToytoolsApp');
    expect(BRAND_X_URL).toBe('https://x.com/ToytoolsApp');
    expect(GA_MEASUREMENT_ID).toBe('G-WHD7CL44MX');
    expect(SOCIAL_IMAGE_PATH).toBe('/og.png');
  });

  it('groups the same values in SITE', () => {
    expect(SITE).toEqual({
      origin: SITE_ORIGIN,
      productionHostnames: PRODUCTION_HOSTNAMES,
      brandName: BRAND_NAME,
      titleSuffix: TITLE_SUFFIX,
      x: { handle: BRAND_X_HANDLE, url: BRAND_X_URL },
      gaMeasurementId: GA_MEASUREMENT_ID,
      socialImagePath: SOCIAL_IMAGE_PATH,
    });
  });

  it('resolves the site URL from Astro.site, or the production origin', () => {
    expect(siteUrl(undefined).href).toBe('https://toytoolsapp.com/');
    expect(siteUrl(null).href).toBe('https://toytoolsapp.com/');
    expect(siteUrl(new URL('https://preview.example/')).href).toBe('https://preview.example/');
    // The same href the replaced `site ?? new URL(SITE_FALLBACK)` copies produced.
    expect(siteUrl(undefined).href).toBe(new URL('https://toytoolsapp.com').href);
  });
});

describe('everything that used to carry its own copy now agrees', () => {
  it('JSON-LD keeps its pinned production @ids, from the same origin', () => {
    expect(IDENTITY_ORIGIN).toBe(SITE_ORIGIN);
    expect(ORG_ID).toBe('https://toytoolsapp.com/#org');
    expect(PERSON_ID).toBe('https://toytoolsapp.com/#atharva');
    expect(BRAND_X).toEqual({ handle: BRAND_X_HANDLE, url: BRAND_X_URL });
  });

  it('the analytics guard and IndexNow read the same values', () => {
    expect(GUARD_GA_ID).toBe(GA_MEASUREMENT_ID);
    if (!process.env.INDEXNOW_HOST) expect(INDEXNOW_HOST).toBe('toytoolsapp.com');
    if (!process.env.ASTRO_SITE) expect(INDEXNOW_SITE).toBe(SITE_ORIGIN);
  });

  it('astro.config.mjs, which cannot import it, falls back to the same origin', () => {
    const config = readFileSync(resolve(ROOT, 'astro.config.mjs'), 'utf8');
    expect(config).toContain(`site: process.env.ASTRO_SITE ?? '${SITE_ORIGIN}',`);
  });

  it('no endpoint or layout keeps a private origin fallback', () => {
    const files = [
      'src/pages/sitemap-index.xml.ts',
      'src/pages/sitemap.xml.ts',
      'src/pages/sitemaps/tools.xml.ts',
      'src/pages/sitemaps/guides.xml.ts',
      'src/pages/sitemaps/categories.xml.ts',
      'src/pages/sitemaps/pages.xml.ts',
      'src/pages/llms.txt.ts',
      'src/pages/llms-full.txt.ts',
      'src/data/sitemap-redirects.ts',
      'src/layouts/BaseLayout.astro',
      'src/pages/index.astro',
    ];
    for (const file of files) {
      const src = readFileSync(resolve(ROOT, file), 'utf8');
      expect(src, file).not.toContain("'https://toytoolsapp.com");
      expect(src, file).not.toContain('SITE_FALLBACK');
    }
  });
});

describe('the social card', () => {
  const file = resolve(ROOT, 'public', SOCIAL_IMAGE_PATH.slice(1));

  it('is a 1200x630 PNG', () => {
    const head = readFileSync(file).subarray(0, 24);
    expect(head.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    expect(head.readUInt32BE(16)).toBe(1200);
    expect(head.readUInt32BE(20)).toBe(630);
  });

  it('stays a reasonable size for a scraper to fetch (under 100 KB)', () => {
    expect(statSync(file).size).toBeLessThan(100 * 1024);
  });
});
