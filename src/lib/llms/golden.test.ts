import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { GOLDEN_DIR, GOLDEN_ENDPOINTS, GOLDEN_SITE, firstDifference, servedBytes } from './golden';
import { GET as llmsTxtGet } from '../../pages/llms.txt';
import { GET as llmsFullGet } from '../../pages/llms-full.txt';

const ROOT = resolve(__dirname, '../../..');

/** Each served file's endpoint, called below exactly as the build calls it. */
const ENDPOINTS = { 'llms.txt': llmsTxtGet, 'llms-full.txt': llmsFullGet } as const;

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
    expect(GOLDEN_ENDPOINTS['llms-full.txt']).toBe(llmsFullGet);
  });

  for (const name of Object.keys(ENDPOINTS) as Array<keyof typeof ENDPOINTS>) {
    it(name, async () => {
      const golden = readFileSync(join(ROOT, GOLDEN_DIR, name));
      const res = await ENDPOINTS[name]({ site: new URL('https://toytoolsapp.com') } as never);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
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

describe('firstDifference', () => {
  it('is null for equal texts and names the first differing line otherwise', () => {
    expect(firstDifference('a\nb\n', 'a\nb\n')).toBeNull();
    expect(firstDifference('a\nb\nc', 'a\nB\nc')).toEqual({ line: 2, expected: 'b', actual: 'B' });
    expect(firstDifference('a\nb', 'a\nb\nc')).toEqual({ line: 3, expected: undefined, actual: 'c' });
    expect(firstDifference('a\nb\n', 'a\nb')).toEqual({ line: 3, expected: '', actual: undefined });
  });
});
