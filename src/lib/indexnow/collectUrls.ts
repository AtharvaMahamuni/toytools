// URL collection engine for IndexNow. The list of public URLs is derived entirely from the
// Content Manifest (src/lib/content/manifest.ts) — the same single source of truth the sitemaps
// use. There is NO parallel registry and NO manual tool enumeration here.
//
// The manifest already emits exactly the indexable surfaces — home, categories, tools, guides,
// and language stubs — and already EXCLUDES everything we must not submit: redirect stubs,
// the legacy /faq/ redirects, /search, /architecture, /404, robots.txt, and all *.xml meta
// routes. So collection is a straight map of manifest entries to absolute, normalized URLs.

import { buildContentManifest } from '@lib/content/manifest';
import { absoluteUrl } from '@lib/sitemap/render';
import { normalizeUrl } from '@lib/indexnow/normalizeUrl';
import { INDEXNOW_SITE } from '@config/indexnow';

/**
 * Collect every public URL to submit to IndexNow, absolute + normalized + de-duplicated.
 * Deterministic: preserves manifest order (home → categories → tools/guides → languages).
 */
export function collectUrls(site: string = INDEXNOW_SITE): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const entry of buildContentManifest()) {
    const normalized = normalizeUrl(absoluteUrl(entry.url, site));
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    urls.push(normalized);
  }

  return urls;
}

// future: collectChangedUrls(prev: string[], curr: string[]) can diff two URL sets to submit
// only what changed. Intentionally not implemented — no prev-build persistence today. The
// purity of collectUrls() is the extension point. See docs/indexnow.md → Incremental.
