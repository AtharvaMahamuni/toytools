// URL normalization for IndexNow. IndexNow requires submitted URLs to be canonical: HTTPS,
// on the verified host, with no query string or fragment, and a single consistent form so the
// same page is never submitted twice. ToyTools uses `trailingSlash: 'always'` (astro.config.mjs),
// so the canonical form here keeps the trailing slash — never producing both `/x` and `/x/`.

import { INDEXNOW_HOST } from '@config/indexnow';

/**
 * Normalize a single URL to its canonical IndexNow form, or return `null` if it cannot be
 * submitted (non-HTTPS-able, or a different host than the verified one).
 *
 * - Forces the `https:` protocol.
 * - Rejects any host other than the canonical host (returns null).
 * - Strips the fragment (`#…`) and the entire query string (including `utm_*`).
 * - Normalizes the path to always end in a trailing slash (except the root, which is `/`).
 */
export function normalizeUrl(raw: string, host = INDEXNOW_HOST): string | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  // Canonical host only — anything else is not ours to submit.
  if (parsed.hostname.toLowerCase() !== host.toLowerCase()) return null;

  // HTTPS only.
  parsed.protocol = 'https:';

  // Drop query (utm_* and everything else) and fragment.
  parsed.search = '';
  parsed.hash = '';

  // Consistent trailing-slash form so `/x` and `/x/` never both appear.
  if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) {
    parsed.pathname = `${parsed.pathname}/`;
  }

  return parsed.href;
}
