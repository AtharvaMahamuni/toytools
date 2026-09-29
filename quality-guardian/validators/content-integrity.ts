import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';
import { livePagesOfKind, toolPathParts } from '../config/page-kinds.js';

/**
 * Real tool pages the tool-specific rule (the FAQ cross-link) applies to: `/tool/<segment>/<slug>/`,
 * indexable, redirect stubs excluded. Exported for the unit test.
 */
export function contentIntegrityToolPages(pages: readonly CrawledPage[]): CrawledPage[] {
  return livePagesOfKind(pages, 'tool').filter(p => !p.robots.includes('noindex'));
}

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
    }

    // Tool pages: link to a standalone FAQ page when one exists.
    //
    // Only a REAL FAQ page counts. Every /faq/<segment>/<slug>/ URL today is a redirect stub (the
    // FAQ moved into the tool page's #faq section), and a tool page must not link to its own stub,
    // so the route manifest alone is the wrong test: it lists stubs too. The FAQ page has to be in
    // the manifest AND crawled as a non-stub page.
    const liveFaqRoutes = new Set(
      livePagesOfKind(pages, 'faq').map(p => p.urlPath).filter(route => manifestSet.has(route)),
    );
    for (const page of contentIntegrityToolPages(pages)) {
      // /tool/<segment>/<slug>/ → { segment, slug }
      const parts = toolPathParts(page.urlPath);
      if (!parts) continue;
      const faqRoute = `/faq/${parts.segment}/${parts.slug}/`;

      if (liveFaqRoutes.has(faqRoute) && !page.internalLinks.includes(faqRoute)) {
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

    return { issues };
  },
};
