import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

function getPageType(urlPath: string): 'tool' | 'faq' | 'guide' | 'homepage' | 'other' {
  if (urlPath === '/') return 'homepage';
  if (urlPath.startsWith('/tools/')) return 'tool';
  if (urlPath.startsWith('/faq/')) return 'faq';
  if (urlPath.startsWith('/guide/')) return 'guide';
  return 'other';
}

export const structuredDataValidator: Validator = {
  name: 'structured-data',

  async detect(pages: CrawledPage[], _ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;
      if (page.robots.includes('noindex')) continue;

      const pageType = getPageType(page.urlPath);

      // Check for JSON-LD parse errors
      for (const block of page.jsonLdBlocks) {
        if (block.parseError) {
          issues.push({
            id: `structured-data:${page.urlPath}:json-parse-error`,
            severity: 'ERROR',
            category: 'structured-data',
            page: page.urlPath,
            message: `JSON-LD block failed to parse: ${block.parseError}`,
            fixable: false,
            auto_fix_strategy: 'MANUAL',
            detail: `Raw: ${block.raw.slice(0, 100)}...`,
          });
        }
      }

      const allTypes = page.jsonLdBlocks.flatMap(b => b.types);

      // Type requirements per page type
      if (pageType === 'tool') {
        if (!allTypes.includes('SoftwareApplication')) {
          issues.push({
            id: `structured-data:${page.urlPath}:missing-software-application`,
            severity: 'ERROR',
            category: 'structured-data',
            page: page.urlPath,
            message: 'Tool page missing SoftwareApplication JSON-LD schema',
            fixable: false,
            auto_fix_strategy: 'MANUAL',
          });
        }
        if (!allTypes.includes('BreadcrumbList')) {
          issues.push({
            id: `structured-data:${page.urlPath}:missing-breadcrumb`,
            severity: 'ERROR',
            category: 'structured-data',
            page: page.urlPath,
            message: 'Tool page missing BreadcrumbList JSON-LD schema',
            fixable: false,
            auto_fix_strategy: 'MANUAL',
          });
        }

        // Check SoftwareApplication required fields
        for (const block of page.jsonLdBlocks) {
          if (!block.types.includes('SoftwareApplication') || !block.parsed) continue;
          const schema = block.parsed as Record<string, unknown>;
          for (const field of ['name', 'description', 'url', 'offers']) {
            if (!schema[field]) {
              issues.push({
                id: `structured-data:${page.urlPath}:missing-software-field-${field}`,
                severity: 'ERROR',
                category: 'structured-data',
                page: page.urlPath,
                message: `SoftwareApplication schema missing required field: ${field}`,
                fixable: false,
                auto_fix_strategy: 'MANUAL',
              });
            }
          }
        }
      }

      if (pageType === 'faq') {
        if (!allTypes.includes('FAQPage')) {
          issues.push({
            id: `structured-data:${page.urlPath}:missing-faqpage`,
            severity: 'ERROR',
            category: 'structured-data',
            page: page.urlPath,
            message: 'FAQ page missing FAQPage JSON-LD schema',
            fixable: false,
            auto_fix_strategy: 'MANUAL',
          });
        }
        if (!allTypes.includes('BreadcrumbList')) {
          issues.push({
            id: `structured-data:${page.urlPath}:missing-breadcrumb`,
            severity: 'ERROR',
            category: 'structured-data',
            page: page.urlPath,
            message: 'FAQ page missing BreadcrumbList JSON-LD schema',
            fixable: false,
            auto_fix_strategy: 'MANUAL',
          });
        }
        // FAQPage must have mainEntity
        for (const block of page.jsonLdBlocks) {
          if (!block.types.includes('FAQPage') || !block.parsed) continue;
          const schema = block.parsed as Record<string, unknown>;
          const mainEntity = schema['mainEntity'];
          if (!Array.isArray(mainEntity) || mainEntity.length === 0) {
            issues.push({
              id: `structured-data:${page.urlPath}:empty-faq-main-entity`,
              severity: 'ERROR',
              category: 'structured-data',
              page: page.urlPath,
              message: 'FAQPage schema has empty or missing mainEntity array',
              fixable: false,
              auto_fix_strategy: 'MANUAL',
            });
          }
        }
      }

      if (pageType === 'guide') {
        if (!allTypes.includes('Article')) {
          issues.push({
            id: `structured-data:${page.urlPath}:missing-article`,
            severity: 'ERROR',
            category: 'structured-data',
            page: page.urlPath,
            message: 'Guide page missing Article JSON-LD schema',
            fixable: false,
            auto_fix_strategy: 'MANUAL',
          });
        }
        if (!allTypes.includes('BreadcrumbList')) {
          issues.push({
            id: `structured-data:${page.urlPath}:missing-breadcrumb`,
            severity: 'ERROR',
            category: 'structured-data',
            page: page.urlPath,
            message: 'Guide page missing BreadcrumbList JSON-LD schema',
            fixable: false,
            auto_fix_strategy: 'MANUAL',
          });
        }
      }

      if (pageType === 'homepage') {
        if (!allTypes.includes('WebSite') || !allTypes.includes('Organization')) {
          issues.push({
            id: 'structured-data:/:missing-homepage-schema',
            severity: 'WARNING',
            category: 'structured-data',
            page: '/',
            message: 'Homepage missing WebSite or Organization JSON-LD schema',
            fixable: false,
            auto_fix_strategy: 'MANUAL',
            detail: `Found types: [${allTypes.join(', ')}]`,
          });
        }
      }
    }

    return { issues };
  },
};
