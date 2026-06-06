import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { crawlDist, readRouteManifest } from '../crawler/index.js';
import { PHASE_2A_VALIDATORS } from '../validators/index.js';
import { runAutoFix } from '../autofixers/index.js';
import { writeReports } from '../reporters/index.js';
import { computeQualityScore } from '../reporters/quality-score.js';
import { DIST_DIR, REPORTS_DIR, SITE_URL } from '../config/index.js';
import type { QualityContext, Issue } from '../types/index.js';

export async function runPrCheck(): Promise<void> {
  console.log('\n🛡️  ToyTools Quality Guardian — PR Check\n');

  // Verify dist/ exists and has route manifest
  if (!existsSync(DIST_DIR)) {
    console.error(`❌ dist/ not found at ${DIST_DIR}`);
    console.error('Run "npm run build" first.');
    process.exit(1);
  }
  if (!existsSync(join(DIST_DIR, 'route-manifest.json'))) {
    console.error('❌ dist/route-manifest.json not found.');
    console.error('Run "npm run build" first to generate the route manifest.');
    process.exit(1);
  }

  const startTime = Date.now();

  // Build context
  let manifestRoutes = readRouteManifest(DIST_DIR);
  let pages = await crawlDist(DIST_DIR, SITE_URL);
  console.log(`📄 Crawled ${pages.length} pages, found ${manifestRoutes.length} routes in manifest`);

  const ctx: QualityContext = { distDir: DIST_DIR, siteUrl: SITE_URL, manifestRoutes };

  // Run Phase 2A validators
  console.log('\n🔍 Running Phase 2A validators...\n');
  let allIssues: Issue[] = [];
  for (const validator of PHASE_2A_VALIDATORS) {
    const result = await validator.detect(pages, ctx);
    allIssues.push(...result.issues);
    const counts = result.issues.reduce((acc, i) => {
      acc[i.severity] = (acc[i.severity] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const summary = Object.entries(counts).map(([s, n]) => `${n} ${s}`).join(', ');
    console.log(`  ${validator.name}: ${summary || '✅ clean'}`);
  }

  // Auto-fix one cycle if needed
  let rebuildsTriggered = 0;
  const fixable = allIssues.filter(i => i.fixable);
  if (fixable.length > 0) {
    const fixResult = await runAutoFix(allIssues, ctx);
    rebuildsTriggered = fixResult.rebuildsTriggered;

    if (rebuildsTriggered > 0) {
      // Re-crawl and re-validate after rebuild
      manifestRoutes = readRouteManifest(DIST_DIR);
      pages = await crawlDist(DIST_DIR, SITE_URL);
      const newCtx: QualityContext = { distDir: DIST_DIR, siteUrl: SITE_URL, manifestRoutes };

      console.log('\n🔍 Re-validating after rebuild...\n');
      allIssues = [];
      for (const validator of PHASE_2A_VALIDATORS) {
        const result = await validator.detect(pages, newCtx);
        allIssues.push(...result.issues);
        const counts = result.issues.reduce((acc, i) => {
          acc[i.severity] = (acc[i.severity] ?? 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const summary = Object.entries(counts).map(([s, n]) => `${n} ${s}`).join(', ');
        console.log(`  ${validator.name}: ${summary || '✅ clean'}`);
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const qualityScore = computeQualityScore(allIssues);

  const criticalCount = allIssues.filter(i => ['BLOCKER', 'ERROR'].includes(i.severity)).length;
  const exitCode: 0 | 1 = criticalCount > 0 ? 1 : 0;

  const report = {
    timestamp: new Date().toISOString(),
    pagesScanned: pages.length,
    issuesFound: allIssues.length,
    rebuildsTriggered,
    remainingIssues: allIssues.length,
    qualityScore,
    exitCode,
    issues: allIssues,
  };

  writeReports(report, REPORTS_DIR);

  console.log(`\n⏱️  Completed in ${elapsed}s`);
  console.log(`📊 Quality Score: ${qualityScore}/100`);
  console.log(`📋 Issues: ${allIssues.length} total (${criticalCount} critical)`);
  console.log(`📁 Reports: ${REPORTS_DIR}\n`);

  if (exitCode === 1) {
    console.error(`❌ PR check failed: ${criticalCount} unresolved BLOCKER/ERROR issue(s)`);
    console.error('Review quality-report.md for details and next steps.\n');
    process.exit(1);
  } else {
    console.log('✅ PR check passed\n');
    process.exit(0);
  }
}
