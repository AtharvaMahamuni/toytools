import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const sitemapValidator: Validator = {
  name: 'sitemap',

  async detect(_pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];
    const indexPath = join(ctx.distDir, 'sitemap-index.xml');

    if (!existsSync(indexPath)) {
      // Already caught by build-integrity
      return { issues };
    }

    const indexContent = readFileSync(indexPath, 'utf-8');

    if (!indexContent.includes('<sitemapindex')) {
      issues.push({
        id: 'sitemap:/:invalid-xml',
        severity: 'ERROR',
        category: 'sitemap',
        page: '/',
        message: 'sitemap-index.xml is not a valid XML sitemap index',
        fixable: true,
        auto_fix_strategy: 'AUTO_FIX',
      });
      return { issues };
    }

    // Collect full content of all sitemap files in dist/
    const sitemapFiles = readdirSync(ctx.distDir)
      .filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
    const allSitemapContent = sitemapFiles
      .map(f => readFileSync(join(ctx.distDir, f), 'utf-8'))
      .join('\n');

    // Check each manifest route (excluding /404.html) appears in the sitemap
    const excluded = new Set(['/404.html', '/search/']);
    for (const route of ctx.manifestRoutes) {
      if (excluded.has(route)) continue;
      // noindex pages are excluded from sitemap by design (search, 404)
      // Language stubs ARE expected in sitemap

      const encodedRoute = route.replace(/&/g, '&amp;');
      if (!allSitemapContent.includes(route) && !allSitemapContent.includes(encodedRoute)) {
        issues.push({
          id: `sitemap:${route}:missing-route`,
          severity: 'ERROR',
          category: 'sitemap',
          page: route,
          message: `Route not found in sitemap`,
          fixable: true,
          auto_fix_strategy: 'AUTO_FIX',
          detail: `Route ${route} expected in sitemap but not found`,
        });
      }
    }

    return { issues };
  },
};
