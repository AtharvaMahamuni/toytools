import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Validator, CrawledPage, QualityContext, ValidatorResult, Issue, PerformanceSnapshot } from '../types/index.js';
import { PERFORMANCE_BUDGETS } from '../config/index.js';
import { livePagesOfKind } from '../config/page-kinds.js';

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

function getLargestPageKB(matching: readonly CrawledPage[]): number {
  if (matching.length === 0) return 0;
  return Math.max(...matching.map(p => Math.round(p.fileSizeBytes / 1024)));
}

/**
 * Real tool pages (`/tool/<segment>/<slug>/`, redirect stubs excluded): the pages the tool page
 * budget and the largestToolPageKB snapshot measure. Exported for the unit test.
 */
export function performanceToolPages(pages: readonly CrawledPage[]): CrawledPage[] {
  return livePagesOfKind(pages, 'tool');
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
    for (const page of performanceToolPages(pages)) {
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
      largestToolPageKB: getLargestPageKB(performanceToolPages(pages)),
      largestGuidePageKB: getLargestPageKB(livePagesOfKind(pages, 'guide')),
      // Every /faq/ URL is a redirect stub since the FAQ moved onto the tool page, so this is 0
      // unless a real FAQ page returns. Kept so the history file keeps one shape.
      largestFaqPageKB: getLargestPageKB(livePagesOfKind(pages, 'faq')),
    };

    return { issues };
  },
};
