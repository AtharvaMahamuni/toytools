import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';
import { ORPHAN_EXEMPT_PATHS, LOCALE_PREFIXES } from '../config/index.js';

export const orphanPagesValidator: Validator = {
  name: 'orphan-pages',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    // internal-links validator must have run first to populate ctx.inboundLinks
    if (!ctx.inboundLinks) {
      issues.push({
        id: 'orphan-pages:/:missing-link-graph',
        severity: 'ERROR',
        category: 'orphan-pages',
        page: '/',
        message: 'Orphan detection skipped: internal-links validator must run first',
        fixable: false,
        auto_fix_strategy: 'MANUAL',
      });
      return { issues };
    }

    for (const page of pages) {
      const { urlPath, robots } = page;

      // Always exempt
      if (ORPHAN_EXEMPT_PATHS.has(urlPath)) continue;

      // noindex pages (404, search, etc.) — not orphan candidates
      if (robots.includes('noindex')) continue;

      const inbound = ctx.inboundLinks.get(urlPath);
      const inboundCount = inbound?.size ?? 0;

      if (inboundCount > 0) continue;

      // Locale-stub pages — WARNING instead of BLOCKER
      const isLocale = LOCALE_PREFIXES.some(prefix => urlPath === prefix || urlPath.startsWith(prefix));
      if (isLocale) {
        issues.push({
          id: `orphan-pages:${urlPath}:locale-orphan`,
          severity: 'WARNING',
          category: 'orphan-pages',
          page: urlPath,
          message: `Locale page has no inbound links — consider adding a link from homepage navigation`,
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
        continue;
      }

      // All other indexable pages with 0 inbound links — BLOCKER
      issues.push({
        id: `orphan-pages:${urlPath}:orphan`,
        severity: 'BLOCKER',
        category: 'orphan-pages',
        page: urlPath,
        message: `Orphan page: no other page links to this URL`,
        fixable: false,
        auto_fix_strategy: 'MANUAL',
        detail: 'Add links to this page from related tools, categories, or navigation',
      });
    }

    return { issues };
  },
};
