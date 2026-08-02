import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const buildIntegrityValidator: Validator = {
  name: 'build-integrity',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    // Required generated artifacts
    const required = [
      { file: 'robots.txt', code: 'missing-robots' },
      { file: 'llms.txt', code: 'missing-llms-txt' },
      { file: 'sitemap-index.xml', code: 'missing-sitemap' },
      { file: '404.html', code: 'missing-404' },
      { file: 'route-manifest.json', code: 'missing-manifest' },
    ];

    for (const { file, code } of required) {
      if (!existsSync(join(ctx.distDir, file))) {
        issues.push({
          id: `build-integrity:/:${code}`,
          severity: 'BLOCKER',
          category: 'build-integrity',
          page: '/',
          message: `Required build artifact missing: ${file}`,
          fixable: file !== '404.html',
          auto_fix_strategy: file !== '404.html' ? 'AUTO_FIX' : 'MANUAL',
          detail: `Expected at ${join(ctx.distDir, file)}`,
        });
      }
    }

    // Per-page: every indexable page must have title, description, canonical
    for (const page of pages) {
      if (page.urlPath === '/404.html') continue;
      if (page.robots.includes('noindex')) continue;

      if (!page.title) {
        issues.push({
          id: `build-integrity:${page.urlPath}:missing-title`,
          severity: 'BLOCKER',
          category: 'build-integrity',
          page: page.urlPath,
          message: 'Page has no <title>',
          fixable: false,
          auto_fix_strategy: 'MANUAL',
        });
      }
      if (!page.description) {
        issues.push({
          id: `build-integrity:${page.urlPath}:missing-description`,
          severity: 'BLOCKER',
          category: 'build-integrity',
          page: page.urlPath,
          message: 'Page has no meta description',
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
      if (!page.canonical) {
        issues.push({
          id: `build-integrity:${page.urlPath}:missing-canonical`,
          severity: 'BLOCKER',
          category: 'build-integrity',
          page: page.urlPath,
          message: 'Page has no canonical link',
          fixable: true,
          auto_fix_strategy: 'AUTO_FIX',
          detail: 'Rebuild with ASTRO_SITE set to generate correct canonical URLs',
        });
      }
    }

    return { issues };
  },
};
