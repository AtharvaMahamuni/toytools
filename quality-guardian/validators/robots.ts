import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue } from '../types/index.js';

export const robotsValidator: Validator = {
  name: 'robots',

  async detect(_pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];
    const robotsPath = join(ctx.distDir, 'robots.txt');

    if (!existsSync(robotsPath)) {
      // Already caught by build-integrity; skip duplicate
      return { issues };
    }

    const content = readFileSync(robotsPath, 'utf-8');
    const expectedSitemap = `${ctx.siteUrl}/sitemap-index.xml`;

    if (!content.includes('User-agent:')) {
      issues.push({
        id: 'robots:/:missing-user-agent',
        severity: 'ERROR',
        category: 'robots',
        page: '/',
        message: 'robots.txt missing "User-agent:" directive',
        fixable: true,
        auto_fix_strategy: 'AUTO_FIX',
      });
    }

    if (!content.includes('Allow: /')) {
      issues.push({
        id: 'robots:/:missing-allow',
        severity: 'ERROR',
        category: 'robots',
        page: '/',
        message: 'robots.txt missing "Allow: /" directive',
        fixable: true,
        auto_fix_strategy: 'AUTO_FIX',
      });
    }

    if (!content.includes('Sitemap:')) {
      issues.push({
        id: 'robots:/:missing-sitemap-line',
        severity: 'ERROR',
        category: 'robots',
        page: '/',
        message: 'robots.txt missing Sitemap directive',
        fixable: true,
        auto_fix_strategy: 'AUTO_FIX',
        detail: `Expected: Sitemap: ${expectedSitemap}`,
      });
    } else if (!content.includes(expectedSitemap)) {
      // Sitemap line exists but points to wrong URL
      const sitemapLine = content.split('\n').find(l => l.startsWith('Sitemap:')) ?? '';
      const hasBlockedString = ['localhost', '127.0.0.1', 'github.io'].some(b => sitemapLine.includes(b));
      issues.push({
        id: 'robots:/:wrong-sitemap-url',
        severity: 'ERROR',
        category: 'robots',
        page: '/',
        message: `robots.txt Sitemap URL is incorrect`,
        fixable: hasBlockedString,
        auto_fix_strategy: hasBlockedString ? 'AUTO_FIX' : 'MANUAL',
        detail: `Expected: Sitemap: ${expectedSitemap}\nFound: ${sitemapLine}`,
      });
    }

    return { issues };
  },
};
