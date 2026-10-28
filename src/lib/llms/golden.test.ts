import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { GOLDEN_DIR, GOLDEN_ENDPOINTS, GOLDEN_SITE, firstDifference, servedBytes } from './golden';
import { GET as brandTxtGet } from '../../pages/brand.txt';
import { GET as aiTxtGet } from '../../pages/ai.txt';
import { GET as faqAiTxtGet } from '../../pages/faq-ai.txt';
import { GET as aiJsonGet } from '../../pages/ai.json';
import { GET as identityJsonGet } from '../../pages/identity.json';
import { GET as llmsTxtGet } from '../../pages/llms.txt';
import { GET as llmsFullGet } from '../../pages/llms-full.txt';

const ROOT = resolve(__dirname, '../../..');

/** Each served file's endpoint, called below exactly as the build calls it. */
const ENDPOINTS = {
  'llms.txt': llmsTxtGet,
  'llms-full.txt': llmsFullGet,
  'brand.txt': brandTxtGet,
  'ai.txt': aiTxtGet,
  'faq-ai.txt': faqAiTxtGet,
  'ai.json': aiJsonGet,
  'identity.json': identityJsonGet,
} as const;

const contentType = (name: string) =>
  name.endsWith('.json') ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8';

// The llms files are pinned to a committed copy. Each endpoint's GET is called for the production
// origin, as the build calls it, and the response bytes are compared to the copy. A change to either
// file, in the renderer or the endpoint, intended or not, fails here until the copy is rewritten
// with `npm run llms:golden` and the diff is committed with it.
describe('llms files match their committed golden copy byte for byte', () => {
  it('renders the goldens on the production origin', () => {
    expect(GOLDEN_SITE).toBe('https://toytoolsapp.com/');
  });

  it('serves the real endpoints', () => {
    expect(GOLDEN_ENDPOINTS['llms.txt']).toBe(llmsTxtGet);
    expect(Object.keys(GOLDEN_ENDPOINTS)).toEqual(Object.keys(ENDPOINTS));
    for (const name of Object.keys(ENDPOINTS) as Array<keyof typeof ENDPOINTS>) {
      expect(GOLDEN_ENDPOINTS[name]).toBe(ENDPOINTS[name]);
    }
  });

  for (const name of Object.keys(ENDPOINTS) as Array<keyof typeof ENDPOINTS>) {
    it(name, async () => {
      const golden = readFileSync(join(ROOT, GOLDEN_DIR, name));
      const res = await ENDPOINTS[name]({ site: new URL('https://toytoolsapp.com') } as never);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe(contentType(name));
      const rendered = Buffer.from(await res.arrayBuffer());
      expect(rendered.equals(await servedBytes(name))).toBe(true);
      const diff = firstDifference(golden.toString('utf8'), rendered.toString('utf8'));
      expect(
        diff,
        `${name} differs from ${GOLDEN_DIR}/${name}. If the change is intended, run npm run llms:golden and commit the diff.`,
      ).toBeNull();
      expect(rendered.equals(golden)).toBe(true);
    });
  }
});

// The goldens pin one site. The endpoints must also pass the build's site through, so a build on
// another origin links that origin and never the production one.
describe('llms endpoints on another site', () => {
  // The identity files carry the pinned production JSON-LD @ids and the X and LinkedIn accounts;
  // src/lib/identity/render.test.ts checks their site URLs instead.
  for (const name of ['llms.txt', 'llms-full.txt'] as const) {
    it(`${name} puts every URL on the site it is given`, async () => {
      const res = await ENDPOINTS[name]({ site: new URL('https://example.test') } as never);
      const text = Buffer.from(await res.arrayBuffer()).toString('utf8');
      const urls = [...text.matchAll(/https?:\/\/[^\s)\]>]+/g)].map(m => m[0]);
      expect(urls.filter(u => u.includes('/tool/')).length).toBeGreaterThan(20);
      expect(urls.filter(u => !u.startsWith('https://example.test/'))).toEqual([]);
      expect(text).not.toContain('toytoolsapp.com');
    });
  }
});

describe('firstDifference', () => {
  it('is null for equal texts and names the first differing line otherwise', () => {
    expect(firstDifference('a\nb\n', 'a\nb\n')).toBeNull();
    expect(firstDifference('a\nb\nc', 'a\nB\nc')).toEqual({ line: 2, expected: 'b', actual: 'B' });
    expect(firstDifference('a\nb', 'a\nb\nc')).toEqual({ line: 3, expected: undefined, actual: 'c' });
    expect(firstDifference('a\nb\n', 'a\nb')).toEqual({ line: 3, expected: '', actual: undefined });
  });
});
