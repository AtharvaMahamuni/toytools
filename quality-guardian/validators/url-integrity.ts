import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const urlIntegrityValidator: Validator = {
  name: 'url-integrity',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    // Duplicate URL paths
    const seen = new Map<string, number>();
    for (const page of pages) {
      seen.set(page.urlPath, (seen.get(page.urlPath) ?? 0) + 1);
    }
    for (const [urlPath, count] of seen) {
      if (count > 1) {
        issues.push({
          id: `url-integrity:${urlPath}:duplicate-route`,
          severity: 'ERROR',
          category: 'url-integrity',
          page: urlPath,
          message: `Duplicate route: ${urlPath} appears ${count} times in dist/`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
        });
      }
    }

    // Trailing slash violations (trailingSlash: 'always')
    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;
      if (!page.urlPath.endsWith('/')) {
        issues.push({
          id: `url-integrity:${page.urlPath}:missing-trailing-slash`,
          severity: 'ERROR',
          category: 'url-integrity',
          page: page.urlPath,
          message: `URL path missing trailing slash (site uses trailingSlash: always)`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
        });
      }
    }

    // Unexpected pages (in dist/ but not in route manifest)
    const manifestSet = new Set(ctx.manifestRoutes);
    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;
      if (!manifestSet.has(page.urlPath)) {
        issues.push({
          id: `url-integrity:${page.urlPath}:unexpected-route`,
          severity: 'WARNING',
          category: 'url-integrity',
          page: page.urlPath,
          message: `Page exists in dist/ but not in route-manifest.json`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
          detail: 'Investigate whether this page should exist or was accidentally generated',
        });
      }
    }

    return { issues };
  },
};
