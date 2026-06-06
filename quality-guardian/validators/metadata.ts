import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';
import { THRESHOLDS } from '../config/index.js';

export const metadataValidator: Validator = {
  name: 'metadata',

  async detect(pages: CrawledPage[], _ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    // Check for duplicates
    const titleMap = new Map<string, string[]>();
    const descMap = new Map<string, string[]>();

    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;
      if (page.robots.includes('noindex')) continue;

      if (page.title) {
        const existing = titleMap.get(page.title) ?? [];
        existing.push(page.urlPath);
        titleMap.set(page.title, existing);
      }
      if (page.description) {
        const existing = descMap.get(page.description) ?? [];
        existing.push(page.urlPath);
        descMap.set(page.description, existing);
      }

      // Title length
      if (page.title) {
        if (page.title.length < THRESHOLDS.titleMin) {
          issues.push({
            id: `metadata:${page.urlPath}:title-too-short`,
            severity: 'ERROR',
            category: 'metadata',
            page: page.urlPath,
            message: `Title too short (${page.title.length} chars, min ${THRESHOLDS.titleMin})`,
            fixable: false,
            auto_fix_strategy: 'SUGGESTION',
            detail: `Current: "${page.title}"`,
          });
        } else if (page.title.length > THRESHOLDS.titleMax) {
          issues.push({
            id: `metadata:${page.urlPath}:title-too-long`,
            severity: 'ERROR',
            category: 'metadata',
            page: page.urlPath,
            message: `Title too long (${page.title.length} chars, max ${THRESHOLDS.titleMax})`,
            fixable: false,
            auto_fix_strategy: 'SUGGESTION',
            detail: `Current: "${page.title}"`,
          });
        }
      }

      // Description length
      if (page.description) {
        if (page.description.length < THRESHOLDS.descMin) {
          issues.push({
            id: `metadata:${page.urlPath}:desc-too-short`,
            severity: 'ERROR',
            category: 'metadata',
            page: page.urlPath,
            message: `Description too short (${page.description.length} chars, min ${THRESHOLDS.descMin})`,
            fixable: false,
            auto_fix_strategy: 'SUGGESTION',
            detail: `Current: "${page.description}"`,
          });
        } else if (page.description.length > THRESHOLDS.descMax) {
          issues.push({
            id: `metadata:${page.urlPath}:desc-too-long`,
            severity: 'ERROR',
            category: 'metadata',
            page: page.urlPath,
            message: `Description too long (${page.description.length} chars, max ${THRESHOLDS.descMax})`,
            fixable: false,
            auto_fix_strategy: 'SUGGESTION',
            detail: `Current: "${page.description}"`,
          });
        }
      }

      // Missing OG tags
      if (!page.ogTitle) {
        issues.push({
          id: `metadata:${page.urlPath}:missing-og-title`,
          severity: 'WARNING',
          category: 'metadata',
          page: page.urlPath,
          message: 'Missing og:title',
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
      if (!page.ogDescription) {
        issues.push({
          id: `metadata:${page.urlPath}:missing-og-description`,
          severity: 'WARNING',
          category: 'metadata',
          page: page.urlPath,
          message: 'Missing og:description',
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
      if (!page.twitterTitle) {
        issues.push({
          id: `metadata:${page.urlPath}:missing-twitter-title`,
          severity: 'WARNING',
          category: 'metadata',
          page: page.urlPath,
          message: 'Missing twitter:title',
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
      if (!page.twitterDescription) {
        issues.push({
          id: `metadata:${page.urlPath}:missing-twitter-description`,
          severity: 'WARNING',
          category: 'metadata',
          page: page.urlPath,
          message: 'Missing twitter:description',
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
    }

    // Duplicate titles
    for (const [title, paths] of titleMap) {
      if (paths.length > 1) {
        for (const urlPath of paths) {
          issues.push({
            id: `metadata:${urlPath}:duplicate-title`,
            severity: 'WARNING',
            category: 'metadata',
            page: urlPath,
            message: `Duplicate title shared with ${paths.filter(p => p !== urlPath).join(', ')}`,
            fixable: false,
            auto_fix_strategy: 'SUGGESTION',
            detail: `Title: "${title}"`,
          });
        }
      }
    }

    // Duplicate descriptions
    for (const [desc, paths] of descMap) {
      if (paths.length > 1) {
        for (const urlPath of paths) {
          issues.push({
            id: `metadata:${urlPath}:duplicate-description`,
            severity: 'WARNING',
            category: 'metadata',
            page: urlPath,
            message: `Duplicate description shared with ${paths.filter(p => p !== urlPath).join(', ')}`,
            fixable: false,
            auto_fix_strategy: 'SUGGESTION',
            detail: `Description: "${desc.slice(0, 60)}..."`,
          });
        }
      }
    }

    return { issues };
  },
};
