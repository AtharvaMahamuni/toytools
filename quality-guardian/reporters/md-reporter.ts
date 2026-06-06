import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { QualityReport, Issue, ValidatorCategory, LighthouseResult } from '../types/index.js';
import { LIGHTHOUSE_THRESHOLDS } from '../config/index.js';
import { generateTrendSummary } from './history-reporter.js';

function severityIcon(s: string): string {
  return { BLOCKER: '🚨', ERROR: '❌', WARNING: '⚠️', INFO: 'ℹ️' }[s] ?? '';
}

function groupByCategory(issues: Issue[]): Map<ValidatorCategory, Issue[]> {
  const map = new Map<ValidatorCategory, Issue[]>();
  for (const issue of issues) {
    const list = map.get(issue.category) ?? [];
    list.push(issue);
    map.set(issue.category, list);
  }
  return map;
}

function formatIssuesSection(issues: Issue[]): string {
  const grouped = groupByCategory(issues);
  const lines: string[] = [];

  for (const [category, categoryIssues] of grouped) {
    const blockers = categoryIssues.filter(i => i.severity === 'BLOCKER').length;
    const errors = categoryIssues.filter(i => i.severity === 'ERROR').length;
    const warnings = categoryIssues.filter(i => i.severity === 'WARNING').length;

    lines.push(`#### ${category}`);
    lines.push(`${blockers > 0 ? `🚨 ${blockers} BLOCKER  ` : ''}${errors > 0 ? `❌ ${errors} ERROR  ` : ''}${warnings > 0 ? `⚠️ ${warnings} WARNING` : ''}`);
    lines.push('');

    // List BLOCKER and ERROR with paths
    for (const issue of categoryIssues.filter(i => ['BLOCKER', 'ERROR'].includes(i.severity))) {
      lines.push(`- ${severityIcon(issue.severity)} \`${issue.page}\` — ${issue.message}`);
      if (issue.detail) lines.push(`  > ${issue.detail}`);
    }

    // Group warnings
    const warningIssues = categoryIssues.filter(i => i.severity === 'WARNING');
    if (warningIssues.length > 0 && warningIssues.length <= 5) {
      for (const issue of warningIssues) {
        lines.push(`- ⚠️ \`${issue.page}\` — ${issue.message}`);
      }
    } else if (warningIssues.length > 5) {
      lines.push(`- ⚠️ ${warningIssues.length} warnings (see quality-report.json for full list)`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function formatLighthouseTable(results: LighthouseResult[]): string {
  const lines = [
    '| URL | Perf | A11y | Best Practices | SEO |',
    '|-----|------|------|----------------|-----|',
  ];
  for (const r of results) {
    const perfOk = r.performance >= LIGHTHOUSE_THRESHOLDS.performance ? '✅' : '⚠️';
    const a11yOk = r.accessibility >= LIGHTHOUSE_THRESHOLDS.accessibility ? '✅' : '⚠️';
    const bpOk = r.bestPractices >= LIGHTHOUSE_THRESHOLDS.bestPractices ? '✅' : '⚠️';
    const seoOk = r.seo >= LIGHTHOUSE_THRESHOLDS.seo ? '✅' : '⚠️';
    lines.push(`| ${r.url} | ${r.performance} ${perfOk} | ${r.accessibility} ${a11yOk} | ${r.bestPractices} ${bpOk} | ${r.seo} ${seoOk} |`);
  }
  return lines.join('\n');
}

function generateNextSteps(issues: Issue[]): string {
  const critical = issues.filter(i => ['BLOCKER', 'ERROR'].includes(i.severity));
  if (critical.length === 0) return '_No critical issues. ✅_';

  const lines: string[] = [];
  const byCategory = groupByCategory(critical);
  for (const [category, items] of byCategory) {
    lines.push(`- **${category}**: Fix ${items.length} issue(s) — ${items[0].message}`);
  }
  return lines.join('\n');
}

export function writeMdReport(report: QualityReport, reportsDir: string): void {
  mkdirSync(reportsDir, { recursive: true });

  const trendSummary = generateTrendSummary(reportsDir);

  const sections: string[] = [];

  sections.push(`# ToyTools Quality Report`);
  sections.push(`Generated: ${new Date(report.timestamp).toLocaleString()}`);
  sections.push('');

  // Summary
  sections.push('## Summary');
  sections.push('');
  sections.push('| Metric | Value |');
  sections.push('|--------|-------|');
  sections.push(`| Pages Scanned | ${report.pagesScanned} |`);
  sections.push(`| Issues Found | ${report.issuesFound} |`);
  sections.push(`| Rebuilds Triggered | ${report.rebuildsTriggered} |`);
  sections.push(`| Remaining Issues | ${report.remainingIssues} |`);
  sections.push(`| Quality Score | ${report.qualityScore}/100 |`);
  sections.push(`| Status | ${report.exitCode === 0 ? '✅ PASS' : '❌ FAIL'} |`);
  sections.push('');

  // Issues by category
  if (report.issues.length > 0) {
    sections.push('## Issues by Category');
    sections.push('');
    sections.push(formatIssuesSection(report.issues));
  } else {
    sections.push('## Issues');
    sections.push('');
    sections.push('_No issues found. ✅_');
    sections.push('');
  }

  // Performance budget
  if (report.performanceSnapshot) {
    const snap = report.performanceSnapshot;
    sections.push('## Performance Budget');
    sections.push('');
    sections.push('| Metric | Size |');
    sections.push('|--------|------|');
    sections.push(`| Homepage HTML | ${snap.homepageHtmlKB}KB |`);
    sections.push(`| Total CSS | ${snap.totalCssKB}KB |`);
    sections.push(`| Total JS | ${snap.totalJsKB}KB |`);
    sections.push(`| Largest Tool Page | ${snap.largestToolPageKB}KB |`);
    sections.push(`| Largest Guide Page | ${snap.largestGuidePageKB}KB |`);
    sections.push(`| Largest FAQ Page | ${snap.largestFaqPageKB}KB |`);
    sections.push('');
  }

  // Trends
  if (trendSummary) {
    sections.push('## Trends');
    sections.push('');
    sections.push(trendSummary);
  }

  // Lighthouse
  if (report.lighthouseResults && report.lighthouseResults.length > 0) {
    sections.push('## Lighthouse Results');
    sections.push('');
    sections.push(formatLighthouseTable(report.lighthouseResults));
    sections.push('');
  }

  // Search Console placeholder
  sections.push('## Search Console');
  sections.push('');
  sections.push('_Integration not configured. Implement `GoogleSearchConsoleProvider` in `providers/search-console.ts` to add indexed-page and impression data._');
  sections.push('');

  // Next steps
  sections.push('## Next Steps');
  sections.push('');
  sections.push(generateNextSteps(report.issues));
  sections.push('');

  const content = sections.join('\n');
  const filePath = join(reportsDir, 'quality-report.md');
  writeFileSync(filePath, content, 'utf-8');
  console.log(`[reporter] Markdown report written to ${filePath}`);
}
