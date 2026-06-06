import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const contentIntegrityValidator: Validator = {
  name: 'content-integrity',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];
    const manifestSet = new Set(ctx.manifestRoutes);

    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;
      if (page.robots.includes('noindex')) continue;

      // Missing H1
      if (page.h1s.length === 0) {
        issues.push({
          id: `content-integrity:${page.urlPath}:missing-h1`,
          severity: 'ERROR',
          category: 'content-integrity',
          page: page.urlPath,
          message: 'Page has no H1 heading',
          fixable: false,
          auto_fix_strategy: 'MANUAL',
        });
      }

      // Multiple H1s
      if (page.h1s.length > 1) {
        issues.push({
          id: `content-integrity:${page.urlPath}:multiple-h1`,
          severity: 'WARNING',
          category: 'content-integrity',
          page: page.urlPath,
          message: `Page has ${page.h1s.length} H1 headings (should have exactly 1)`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
          detail: `H1s: ${page.h1s.map(h => `"${h}"`).join(', ')}`,
        });
      }

      // Tool pages: check cross-link to FAQ if FAQ exists in manifest
      if (page.urlPath.startsWith('/tools/')) {
        const parts = page.urlPath.split('/').filter(Boolean);
        // /tools/<segment>/<slug>/ → parts = ['tools', segment, slug]
        if (parts.length === 3) {
          const [, segment, slug] = parts;
          const faqRoute = `/faq/${segment}/${slug}/`;

          if (manifestSet.has(faqRoute) && !page.internalLinks.includes(faqRoute)) {
            issues.push({
              id: `content-integrity:${page.urlPath}:missing-faq-link`,
              severity: 'WARNING',
              category: 'content-integrity',
              page: page.urlPath,
              message: `Tool page doesn't link to its FAQ at ${faqRoute}`,
              fixable: false,
              auto_fix_strategy: 'SUGGESTION',
              detail: `FAQ exists at ${faqRoute} but is not linked from this tool page`,
            });
          }
        }
      }
    }

    return { issues };
  },
};
