// The committed expected output of /llms.txt and /llms-full.txt (src/lib/llms/golden/), rendered
// on the production origin with no base path, exactly as a production build serves them.
// golden.test.ts compares the renderer to these copies byte for byte, so any change to either file
// shows up as a reviewed diff in the PR. After an intended change, rewrite them on purpose with
// `npm run llms:golden` and commit the result.

import { join } from 'node:path';
import { siteUrl } from '@config/site';
import { llmsTxtForSite, renderLlmsFull } from './render';

/** The site the goldens are rendered on: the production origin, as a build without ASTRO_SITE. */
export const GOLDEN_SITE = siteUrl().href;

/** Where the committed copies live, relative to the repo root. */
export const GOLDEN_DIR = join('src', 'lib', 'llms', 'golden');

/** Each served file and how it is rendered. */
export const GOLDEN_FILES: Readonly<Record<'llms.txt' | 'llms-full.txt', () => string>> = {
  'llms.txt': () => llmsTxtForSite(GOLDEN_SITE),
  'llms-full.txt': () => renderLlmsFull(GOLDEN_SITE),
};

/** The first line where two texts differ (1-based), with both versions of it; null when equal. */
export function firstDifference(
  expected: string,
  actual: string,
): { line: number; expected: string | undefined; actual: string | undefined } | null {
  if (expected === actual) return null;
  const a = expected.split('\n');
  const b = actual.split('\n');
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) return { line: i + 1, expected: a[i], actual: b[i] };
  }
  return { line: a.length, expected: a[a.length - 1], actual: b[b.length - 1] };
}
