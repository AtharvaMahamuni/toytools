import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue, PerformanceSnapshot } from '../types/index.js';
import { PERFORMANCE_BUDGETS } from '../config/index.js';

// Exported so weekly workflow can collect it
export let lastPerformanceSnapshot: PerformanceSnapshot | null = null;

function getFileSizeKB(filePath: string): number {
  try {
    return Math.round(statSync(filePath).size / 1024);
  } catch {
    return 0;
  }
}

function getAssetSizes(distDir: string, ext: string): Array<{ file: string; sizeKB: number }> {
  const assetsDir = join(distDir, '_assets');
  try {
    return readdirSync(assetsDir)
      .filter(f => f.endsWith(ext))
      .map(f => ({ file: f, sizeKB: getFileSizeKB(join(assetsDir, f)) }));
  } catch {
    return [];
  }
}

function getLargestPageKB(pages: CrawledPage[], prefix: string): number {
  const matching = pages.filter(p => p.urlPath.startsWith(prefix));
  if (matching.length === 0) return 0;
  return Math.max(...matching.map(p => Math.round(p.fileSizeBytes / 1024)));
}

export const performanceValidator: Validator = {
  name: 'performance',

  async detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult> {
    const issues: Issue[] = [];

    // Homepage HTML size
    const homepage = pages.find(p => p.urlPath === '/');
    const homepageHtmlKB = homepage ? Math.round(homepage.fileSizeBytes / 1024) : 0;
    if (homepageHtmlKB > PERFORMANCE_BUDGETS.homeHtmlKB) {
      issues.push({
        id: 'performance:/:homepage-html-too-large',
        severity: 'WARNING',
        category: 'performance',
        page: '/',
        message: `Homepage HTML is ${homepageHtmlKB}KB (budget: ${PERFORMANCE_BUDGETS.homeHtmlKB}KB)`,
        fixable: false,
        auto_fix_strategy: 'SUGGESTION',
      });
    }

    // CSS files
    const cssFiles = getAssetSizes(ctx.distDir, '.css');
    let totalCssKB = 0;
    for (const { file, sizeKB } of cssFiles) {
      totalCssKB += sizeKB;
      if (sizeKB > PERFORMANCE_BUDGETS.cssKB) {
        issues.push({
          id: `performance:/:css-too-large:${file}`,
          severity: 'WARNING',
          category: 'performance',
          page: '/',
          message: `CSS file ${file} is ${sizeKB}KB (budget: ${PERFORMANCE_BUDGETS.cssKB}KB)`,
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
    }

    // JS files
    const jsFiles = getAssetSizes(ctx.distDir, '.js');
    let totalJsKB = 0;
    for (const { file, sizeKB } of jsFiles) {
      totalJsKB += sizeKB;
      if (sizeKB > PERFORMANCE_BUDGETS.jsKB) {
        issues.push({
          id: `performance:/:js-too-large:${file}`,
          severity: 'WARNING',
          category: 'performance',
          page: '/',
          message: `JS file ${file} is ${sizeKB}KB (budget: ${PERFORMANCE_BUDGETS.jsKB}KB)`,
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
    }

    // Tool page budgets
    for (const page of pages.filter(p => p.urlPath.startsWith('/tools/'))) {
      const sizeKB = Math.round(page.fileSizeBytes / 1024);
      if (sizeKB > PERFORMANCE_BUDGETS.toolPageKB) {
        issues.push({
          id: `performance:${page.urlPath}:tool-page-too-large`,
          severity: 'WARNING',
          category: 'performance',
          page: page.urlPath,
          message: `Tool page is ${sizeKB}KB (budget: ${PERFORMANCE_BUDGETS.toolPageKB}KB)`,
          fixable: false,
          auto_fix_strategy: 'SUGGESTION',
        });
      }
    }

    // Capture snapshot for history reporter
    lastPerformanceSnapshot = {
      date: new Date().toISOString().split('T')[0],
      homepageHtmlKB,
      totalCssKB,
      totalJsKB,
      largestToolPageKB: getLargestPageKB(pages, '/tools/'),
      largestGuidePageKB: getLargestPageKB(pages, '/guide/'),
      largestFaqPageKB: getLargestPageKB(pages, '/faq/'),
    };

    return { issues };
  },
};
