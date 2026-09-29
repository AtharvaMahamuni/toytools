import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';
import { ORPHAN_EXEMPT_PATHS } from '../config/index.js';

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

      // Every indexable page with 0 inbound links is a BLOCKER. There used to be a WARNING-only
      // carve-out for /en/, /de/, /fr/ and /ja/ locale stubs; those pages were deleted on
      // 2026-08-03 (CLAUDE.md), so the exemption was removed with them in beta-v12.1.1.
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
