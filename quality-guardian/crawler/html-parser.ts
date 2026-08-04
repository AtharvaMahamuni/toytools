import { load } from 'cheerio';
import { readFileSync, statSync } from 'node:fs';
import type { CrawledPage, ParsedJsonLd } from '../types/index.js';

function extractTypes(parsed: unknown): string[] {
  if (!parsed || typeof parsed !== 'object') return [];
  const obj = parsed as Record<string, unknown>;
  const types: string[] = [];
  if (obj['@type']) {
    const t = obj['@type'];
    types.push(...(Array.isArray(t) ? t : [t]) as string[]);
  }
  if (Array.isArray(obj['@graph'])) {
    for (const node of obj['@graph']) {
      types.push(...extractTypes(node));
    }
  }
  return types;
}

function detectHeadingViolations(headings: Array<{ tag: string }>): string[] {
  const violations: string[] = [];
  const levels = headings.map(h => parseInt(h.tag[1], 10));
  let maxSeen = 0;
  for (const level of levels) {
    if (level > maxSeen + 1 && maxSeen > 0) {
      violations.push(`h${level} found after h${maxSeen} (skipped h${maxSeen + 1})`);
    }
    if (level > maxSeen) maxSeen = level;
  }
  return violations;
}

export function parseHtml(filePath: string, urlPath: string, siteUrl: string): CrawledPage {
  const html = readFileSync(filePath, 'utf-8');
  const $ = load(html);
  const fileSizeBytes = statSync(filePath).size;

  // Metadata
  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() ?? '';
  const canonical = $('link[rel="canonical"]').attr('href')?.trim() ?? '';
  const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() ?? '';
  const ogDescription = $('meta[property="og:description"]').attr('content')?.trim() ?? '';
  const twitterTitle = $('meta[name="twitter:title"]').attr('content')?.trim() ?? '';
  const twitterDescription = $('meta[name="twitter:description"]').attr('content')?.trim() ?? '';
  const robots = $('meta[name="robots"]').attr('content')?.trim() ?? '';
  // A retired URL kept alive as a redirect stub (src/data/tool-redirects.ts + faq-redirects.ts).
  // Detected structurally rather than by a list of path prefixes, so a future slug rename needs no
  // edit here: the stub IS the meta-refresh, and validators that assume a self-canonical or real
  // content must skip it.
  const isRedirectStub = $('meta[http-equiv="refresh"]').length > 0;

  // Headings
  const h1s: string[] = [];
  const h2s: string[] = [];
  const allHeadings: Array<{ tag: string }> = [];

  $('h1, h2, h3, h4, h5, h6').each((_i, el) => {
    const tag = (el as { tagName?: string }).tagName?.toLowerCase() ?? '';
    allHeadings.push({ tag });
    if (tag === 'h1') h1s.push($(el).text().trim());
    if (tag === 'h2') h2s.push($(el).text().trim());
  });

  const headingHierarchyViolations = detectHeadingViolations(allHeadings);

  // Internal links — collect href values that point to same-origin or relative paths
  const internalLinks: string[] = [];
  const siteOrigin = new URL(siteUrl).origin;

  $('a[href]').each((_i, el) => {
    const href = $(el).attr('href')?.trim() ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    if (href.startsWith('/')) {
      // Relative path — normalize trailing slash
      internalLinks.push(href.split('?')[0].split('#')[0]);
    } else if (href.startsWith(siteOrigin)) {
      const path = href.slice(siteOrigin.length) || '/';
      internalLinks.push(path.split('?')[0].split('#')[0]);
    }
    // External links ignored
  });

  // JSON-LD
  const jsonLdBlocks: ParsedJsonLd[] = [];
  $('script[type="application/ld+json"]').each((_i, el) => {
    const raw = $(el).html() ?? '';
    try {
      const parsed = JSON.parse(raw) as unknown;
      jsonLdBlocks.push({ raw, parsed, types: extractTypes(parsed) });
    } catch (err) {
      jsonLdBlocks.push({
        raw,
        parsed: null,
        parseError: err instanceof Error ? err.message : String(err),
        types: [],
      });
    }
  });

  // Accessibility counts
  const altMissingCount = $('img:not([alt])').length;

  let ariaLabelMissingCount = 0;
  $('input, button').each((_i, el) => {
    const hasAriaLabel = $(el).attr('aria-label') || $(el).attr('aria-labelledby');
    const id = $(el).attr('id');
    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    const hasText = $(el).text().trim().length > 0;
    if (!hasAriaLabel && !hasLabel && !hasText) ariaLabelMissingCount++;
  });

  return {
    filePath,
    urlPath,
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    h1s,
    h2s,
    internalLinks: [...new Set(internalLinks)],
    jsonLdBlocks,
    robots,
    isRedirectStub,
    fileSizeBytes,
    altMissingCount,
    ariaLabelMissingCount,
    headingHierarchyViolations,
  };
}
