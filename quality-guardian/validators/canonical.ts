import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';
import { SITE_URL } from '../config/index.js';

const BLOCKED_STRINGS = ['localhost', '127.0.0.1', 'github.io'];

export const canonicalValidator: Validator = {
  name: 'canonical',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];
    const expectedOrigin = ctx.siteUrl;

    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;
      if (!page.canonical) continue; // missing canonical caught by build-integrity

      const c = page.canonical;

      // Must not contain blocked strings
      for (const blocked of BLOCKED_STRINGS) {
        if (c.includes(blocked)) {
          issues.push({
            id: `canonical:${page.urlPath}:wrong-domain`,
            severity: 'ERROR',
            category: 'canonical',
            page: page.urlPath,
            message: `Canonical contains "${blocked}" — rebuild with ASTRO_SITE set`,
            fixable: true,
            auto_fix_strategy: 'AUTO_FIX',
            detail: `Canonical: ${c}`,
          });
          break;
        }
      }

      // Must start with expected origin
      if (!c.startsWith(expectedOrigin)) {
        // Only push if not already pushed for blocked strings
        const alreadyFlagged = issues.some(
          i => i.page === page.urlPath && i.category === 'canonical' && i.id.includes('wrong-domain')
        );
        if (!alreadyFlagged) {
          issues.push({
            id: `canonical:${page.urlPath}:wrong-origin`,
            severity: 'ERROR',
            category: 'canonical',
            page: page.urlPath,
            message: `Canonical origin doesn't match expected ${expectedOrigin}`,
            fixable: true,
            auto_fix_strategy: 'AUTO_FIX',
            detail: `Canonical: ${c}`,
          });
        }
      }

      // Must match page's own URL path
      const expectedCanonical = `${expectedOrigin}${page.urlPath}`;
      if (c.startsWith(expectedOrigin) && c !== expectedCanonical) {
        issues.push({
          id: `canonical:${page.urlPath}:path-mismatch`,
          severity: 'ERROR',
          category: 'canonical',
          page: page.urlPath,
          message: `Canonical path doesn't match page URL`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
          detail: `Expected: ${expectedCanonical}, Got: ${c}`,
        });
      }

      // Must end with trailing slash (except 404.html)
      if (c.startsWith(expectedOrigin) && !c.endsWith('/')) {
        issues.push({
          id: `canonical:${page.urlPath}:missing-trailing-slash`,
          severity: 'ERROR',
          category: 'canonical',
          page: page.urlPath,
          message: 'Canonical missing trailing slash (site uses trailingSlash: always)',
          fixable: false,
          auto_fix_strategy: 'MANUAL',
          detail: `Canonical: ${c}`,
        });
      }
    }

    return { issues };
  },
};
