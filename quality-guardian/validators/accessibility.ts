import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const accessibilityValidator: Validator = {
  name: 'accessibility',

  async detect(pages: CrawledPage[], _ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;

      if (page.altMissingCount > 0) {
        issues.push({
          id: `accessibility:${page.urlPath}:missing-alt`,
          severity: 'WARNING',
          category: 'accessibility',
          page: page.urlPath,
          message: `${page.altMissingCount} image(s) missing alt attribute`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
          detail: 'Add descriptive alt text to all <img> elements',
        });
      }

      if (page.ariaLabelMissingCount > 0) {
        issues.push({
          id: `accessibility:${page.urlPath}:missing-aria-label`,
          severity: 'WARNING',
          category: 'accessibility',
          page: page.urlPath,
          message: `${page.ariaLabelMissingCount} input/button element(s) missing accessible label`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
          detail: 'Add aria-label, aria-labelledby, or an associated <label> to all interactive elements',
        });
      }

      if (page.headingHierarchyViolations.length > 0) {
        for (const violation of page.headingHierarchyViolations) {
          issues.push({
            id: `accessibility:${page.urlPath}:heading-hierarchy:${violation.replace(/\s+/g, '-')}`,
            severity: 'WARNING',
            category: 'accessibility',
            page: page.urlPath,
            message: `Heading hierarchy violation: ${violation}`,
            fixable: false,
            auto_fix_strategy: 'MANUAL',
          });
        }
      }
    }

    return { issues };
  },
};
