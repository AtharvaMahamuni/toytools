import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const internalLinksValidator: Validator = {
  name: 'internal-links',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    // Build a set of known URL paths
    const knownPaths = new Set(pages.map(p => p.urlPath));

    // Build inbound-link graph and store on context
    const inboundLinks = new Map<string, Set<string>>();
    for (const page of pages) {
      for (const link of page.internalLinks) {
        // Normalize: ensure trailing slash for non-file paths
        const normalized = link.endsWith('.html') || link.includes('.') ? link
          : (link.endsWith('/') ? link : link + '/');

        if (!inboundLinks.has(normalized)) inboundLinks.set(normalized, new Set());
        inboundLinks.get(normalized)!.add(page.urlPath);
      }
    }
    // Expose on context for orphan-pages validator
    ctx.inboundLinks = inboundLinks;

    // Check for broken links
    for (const page of pages) {
      for (const link of page.internalLinks) {
        const normalized = link.endsWith('.html') || link.includes('.') ? link
          : (link.endsWith('/') ? link : link + '/');

        if (!knownPaths.has(normalized) && !knownPaths.has(link)) {
          issues.push({
            id: `internal-links:${page.urlPath}:broken:${normalized}`,
            severity: 'ERROR',
            category: 'internal-links',
            page: page.urlPath,
            message: `Broken internal link: ${link}`,
            fixable: false,
            auto_fix_strategy: 'MANUAL',
            detail: `Link target "${link}" does not exist in dist/`,
          });
        }
      }
    }

    return { issues };
  },
};
