import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { crawlDist, readRouteManifest } from '../crawler/index.js';
import { ALL_VALIDATORS } from '../validators/index.js';
import { runAutoFix } from '../autofixers/index.js';
import { writeReports } from '../reporters/index.js';
import { computeQualityScore } from '../reporters/quality-score.js';
import { appendPerformanceSnapshot, appendLighthouseHistory } from '../reporters/history-reporter.js';
import { lastPerformanceSnapshot } from '../validators/performance.js';
import { DIST_DIR, REPORTS_DIR, SITE_URL, ROOT_DIR, LIGHTHOUSE_THRESHOLDS } from '../config/index.js';
import type { QualityContext, Issue, LighthouseResult, PerformanceSnapshot } from '../types/index.js';

const PREVIEW_PORT = 4321;
const PREVIEW_TIMEOUT_MS = 30_000;

async function waitForServer(url: string): Promise<boolean> {
  const deadline = Date.now() + PREVIEW_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok || res.status === 404) return true; // server is up
    } catch {
      // not ready yet
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

// Indirect dynamic import bypasses TS static analysis for optional runtime-only deps
const dynamicImport = new Function('s', 'return import(s)') as (s: string) => Promise<Record<string, unknown>>;

type LighthouseFn = (url: string, opts: Record<string, unknown>) => Promise<{
  lhr: { categories: Record<string, { score: number | null }> };
} | undefined>;

type ChromeLaunchResult = { port: number; kill: () => Promise<void> };
type ChromeLauncher = { launch: (opts: Record<string, unknown>) => Promise<ChromeLaunchResult> };

async function runLighthouse(routes: string[]): Promise<LighthouseResult[]> {
  let lighthouse: LighthouseFn;
  let chromeLauncher: ChromeLauncher;

  try {
    const lhModule = await dynamicImport('lighthouse');
    const clModule = await dynamicImport('chrome-launcher');
    lighthouse = lhModule['default'] as LighthouseFn;
    chromeLauncher = clModule as unknown as ChromeLauncher;
  } catch {
    console.warn('[lighthouse] lighthouse package not installed — skipping. Install with: npm install --prefix quality-guardian lighthouse');
    return [];
  }

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
  const results: LighthouseResult[] = [];

  try {
    for (const route of routes) {
      const url = `http://localhost:${PREVIEW_PORT}${route}`;
      console.log(`  [lighthouse] auditing ${url}`);
      try {
        const runnerResult = await lighthouse(url, {
          logLevel: 'error',
          output: 'json',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          port: chrome.port,
        });
        if (!runnerResult?.lhr) continue;
        const { categories } = runnerResult.lhr;
        results.push({
          url,
          performance: Math.round((categories['performance']?.score ?? 0) * 100),
          accessibility: Math.round((categories['accessibility']?.score ?? 0) * 100),
          bestPractices: Math.round((categories['best-practices']?.score ?? 0) * 100),
          seo: Math.round((categories['seo']?.score ?? 0) * 100),
        });
      } catch (err) {
        console.warn(`  [lighthouse] failed for ${url}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  } finally {
    await chrome.kill();
  }

  return results;
}

function selectLighthouseRoutes(manifestRoutes: string[]): string[] {
  const routes: string[] = ['/'];

  const categories = manifestRoutes.filter(r => r.startsWith('/categories/')).slice(0, 2);
  const tools = manifestRoutes.filter(r => r.startsWith('/tools/')).slice(0, 2);
  const guides = manifestRoutes.filter(r => r.startsWith('/guide/')).slice(0, 1);
  const faqs = manifestRoutes.filter(r => r.startsWith('/faq/')).slice(0, 1);

  return [...routes, ...categories, ...tools, ...guides, ...faqs];
}

export async function runWeeklyAudit(): Promise<void> {
  console.log('\n🛡️  ToyTools Quality Guardian — Weekly Full Audit\n');

  if (!existsSync(DIST_DIR)) {
    console.error(`❌ dist/ not found at ${DIST_DIR}`);
    console.error('Run "npm run build" first.');
    process.exit(0); // weekly never blocks deployment
  }

  const startTime = Date.now();

  // Build context
  let manifestRoutes = readRouteManifest(DIST_DIR);
  let pages = await crawlDist(DIST_DIR, SITE_URL);
  console.log(`📄 Crawled ${pages.length} pages, found ${manifestRoutes.length} routes in manifest`);

  const ctx: QualityContext = { distDir: DIST_DIR, siteUrl: SITE_URL, manifestRoutes };

  // Run all validators (Phase 2A + 2B)
  console.log('\n🔍 Running all validators...\n');
  let allIssues: Issue[] = [];
  for (const validator of ALL_VALIDATORS) {
    const result = await validator.detect(pages, ctx);
    allIssues.push(...result.issues);
    const counts = result.issues.reduce((acc, i) => {
      acc[i.severity] = (acc[i.severity] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const summary = Object.entries(counts).map(([s, n]) => `${n} ${s}`).join(', ');
    console.log(`  ${validator.name}: ${summary || '✅ clean'}`);
  }

  // Auto-fix one cycle
  let rebuildsTriggered = 0;
  const fixable = allIssues.filter(i => i.fixable);
  if (fixable.length > 0) {
    const fixResult = await runAutoFix(allIssues, ctx);
    rebuildsTriggered = fixResult.rebuildsTriggered;

    if (rebuildsTriggered > 0) {
      manifestRoutes = readRouteManifest(DIST_DIR);
      pages = await crawlDist(DIST_DIR, SITE_URL);
      const newCtx: QualityContext = { distDir: DIST_DIR, siteUrl: SITE_URL, manifestRoutes };

      console.log('\n🔍 Re-validating after rebuild...\n');
      allIssues = [];
      for (const validator of ALL_VALIDATORS) {
        const result = await validator.detect(pages, newCtx);
        allIssues.push(...result.issues);
      }
    }
  }

  // Performance snapshot + history
  let performanceSnapshot: PerformanceSnapshot | undefined;
  if (lastPerformanceSnapshot) {
    performanceSnapshot = lastPerformanceSnapshot;
    const trendAlerts = appendPerformanceSnapshot(performanceSnapshot, REPORTS_DIR);
    for (const alert of trendAlerts) {
      console.warn(`⚠️  Performance trend: ${alert.metric} grew ${alert.growthPercent}% (${alert.previous}KB → ${alert.current}KB)`);
      allIssues.push({
        id: `performance:/:trend-alert-${alert.metric}`,
        severity: 'WARNING',
        category: 'performance',
        page: '/',
        message: `${alert.metric} grew ${alert.growthPercent}% week-over-week (${alert.previous}KB → ${alert.current}KB)`,
        fixable: false,
        auto_fix_strategy: 'SUGGESTION',
      });
    }
  }

  // Lighthouse
  let lighthouseResults: LighthouseResult[] = [];
  console.log('\n🔦 Running Lighthouse...\n');

  const previewRoutes = selectLighthouseRoutes(manifestRoutes);
  const previewServer = spawn('npm', ['run', 'preview', '--', '--port', String(PREVIEW_PORT)], {
    cwd: ROOT_DIR,
    stdio: 'pipe',
  });

  const serverReady = await waitForServer(`http://localhost:${PREVIEW_PORT}/`);
  if (serverReady) {
    lighthouseResults = await runLighthouse(previewRoutes);
    previewServer.kill();

    if (lighthouseResults.length > 0) {
      appendLighthouseHistory(lighthouseResults, REPORTS_DIR);

      // Log Lighthouse threshold violations as warnings (never fail weekly)
      for (const r of lighthouseResults) {
        if (r.performance < LIGHTHOUSE_THRESHOLDS.performance)
          console.warn(`  ⚠️  ${r.url} — Performance ${r.performance} < ${LIGHTHOUSE_THRESHOLDS.performance}`);
        if (r.accessibility < LIGHTHOUSE_THRESHOLDS.accessibility)
          console.warn(`  ⚠️  ${r.url} — Accessibility ${r.accessibility} < ${LIGHTHOUSE_THRESHOLDS.accessibility}`);
      }
    }
  } else {
    previewServer.kill();
    console.warn('[lighthouse] Preview server did not start in time — Lighthouse skipped');
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const qualityScore = computeQualityScore(allIssues);
  const criticalCount = allIssues.filter(i => ['BLOCKER', 'ERROR'].includes(i.severity)).length;

  const report = {
    timestamp: new Date().toISOString(),
    pagesScanned: pages.length,
    issuesFound: allIssues.length,
    rebuildsTriggered,
    remainingIssues: allIssues.length,
    qualityScore,
    exitCode: 0 as const, // weekly never blocks deployment
    issues: allIssues,
    lighthouseResults: lighthouseResults.length > 0 ? lighthouseResults : undefined,
    performanceSnapshot,
  };

  writeReports(report, REPORTS_DIR);

  console.log(`\n⏱️  Completed in ${elapsed}s`);
  console.log(`📊 Quality Score: ${qualityScore}/100`);
  console.log(`📋 Issues: ${allIssues.length} total (${criticalCount} critical)`);
  console.log(`🔦 Lighthouse: ${lighthouseResults.length} pages audited`);
  console.log(`📁 Reports: ${REPORTS_DIR}\n`);

  // Weekly always exits 0
  process.exit(0);
}
