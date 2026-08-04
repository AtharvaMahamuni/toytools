import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const sitemapValidator: Validator = {
  name: 'sitemap',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
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

    // Collect full content of all sitemap files: the index at dist/ root plus the
    // semantic buckets under dist/sitemaps/ (registry-driven sitemap).
    const rootFiles = readdirSync(ctx.distDir)
      .filter(f => f.startsWith('sitemap') && f.endsWith('.xml'))
      .map(f => join(ctx.distDir, f));
    const bucketDir = join(ctx.distDir, 'sitemaps');
    const bucketFiles = existsSync(bucketDir)
      ? readdirSync(bucketDir).filter(f => f.endsWith('.xml')).map(f => join(bucketDir, f))
      : [];
    const allSitemapContent = [...rootFiles, ...bucketFiles]
      .map(f => readFileSync(f, 'utf-8'))
      .join('\n');

    // Check each manifest route appears in the sitemap.
    // noindex pages are excluded from the sitemap by design, so they must not be expected
    // here. We derive that set from the crawled robots meta (covers search, architecture,
    // 404, and the thin language stubs /de/ /en/ /fr/ /ja/) so this stays correct as pages
    // are added or de-indexed. Redirect stubs for retired URLs are likewise absent from every
    // sitemap by design, and are recognised by their meta refresh rather than by a list of path
    // prefixes, so a slug rename needs no edit here. See src/data/tool-redirects.ts and
    // src/data/faq-redirects.ts.
    const noindexRoutes = new Set(
      pages.filter(p => /noindex/i.test(p.robots) || p.isRedirectStub).map(p => p.urlPath),
    );
    const excluded = new Set(['/404.html', '/search/', '/architecture/']);
    for (const route of ctx.manifestRoutes) {
      if (excluded.has(route)) continue;
      if (noindexRoutes.has(route)) continue;

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
