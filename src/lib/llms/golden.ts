// The committed expected output of /llms.txt and /llms-full.txt (src/lib/llms/golden/), rendered
// on the production origin with no base path. They are the bytes the two endpoints' GET handlers
// return for that site, which is what a production build writes to dist/llms.txt and
// dist/llms-full.txt. golden.test.ts compares those responses to these copies byte for byte, so any
// change to either file, in the renderer or in the endpoint, shows up as a reviewed diff in the PR. After an intended change, rewrite them on purpose with
// `npm run llms:golden` and commit the result.

import { join } from 'node:path';
import { siteUrl } from '@config/site';
import { GET as llmsTxt } from '../../pages/llms.txt';
import { GET as llmsFull } from '../../pages/llms-full.txt';

/** The site the goldens are rendered on: the production origin, as a build without ASTRO_SITE. */
export const GOLDEN_SITE = siteUrl().href;

/** Where the committed copies live, relative to the repo root. */
export const GOLDEN_DIR = join('src', 'lib', 'llms', 'golden');

type Endpoint = (context: { site: URL }) => Response | Promise<Response>;

/** Calls an endpoint's GET for `site`, as the build does, and returns the response. */
async function serve(endpoint: unknown, site: string): Promise<Response> {
  return (endpoint as Endpoint)({ site: new URL(site) });
}

/** Each served file: the endpoint that serves it. */
export const GOLDEN_ENDPOINTS: Readonly<Record<'llms.txt' | 'llms-full.txt', unknown>> = {
  'llms.txt': llmsTxt,
  'llms-full.txt': llmsFull,
};

/** The bytes an endpoint serves for the production origin. */
export async function servedBytes(name: keyof typeof GOLDEN_ENDPOINTS): Promise<Buffer> {
  const res = await serve(GOLDEN_ENDPOINTS[name], GOLDEN_SITE);
  return Buffer.from(await res.arrayBuffer());
}

/** The first line where two texts differ (1-based), with both versions of it; null when equal. */
export function firstDifference(
  expected: string,
  actual: string,
): { line: number; expected: string | undefined; actual: string | undefined } | null {
  if (expected === actual) return null;
  const a = expected.split('\n');
  const b = actual.split('\n');
  // The texts differ, so some line index up to the longer length differs too.
  let i = 0;
  while (a[i] === b[i]) i++;
  return { line: i + 1, expected: a[i], actual: b[i] };
}
