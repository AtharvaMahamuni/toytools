import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { PerformanceSnapshot, LighthouseResult } from '../types/index.js';

interface LighthouseHistoryEntry {
  date: string;
  results: LighthouseResult[];
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) return fallback;
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath: string, data: unknown): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export interface TrendAlert {
  metric: string;
  previous: number;
  current: number;
  growthPercent: number;
}

export function appendPerformanceSnapshot(snapshot: PerformanceSnapshot, reportsDir: string): TrendAlert[] {
  mkdirSync(reportsDir, { recursive: true });
  const filePath = join(reportsDir, 'performance-history.json');
  const history = readJsonFile<PerformanceSnapshot[]>(filePath, []);

  const alerts: TrendAlert[] = [];
  const previous = history[history.length - 1];

  if (previous) {
    const metrics: Array<keyof Omit<PerformanceSnapshot, 'date'>> = [
      'homepageHtmlKB', 'totalCssKB', 'totalJsKB',
      'largestToolPageKB', 'largestGuidePageKB', 'largestFaqPageKB',
    ];
    for (const metric of metrics) {
      const prev = previous[metric] as number;
      const curr = snapshot[metric] as number;
      if (prev > 0 && curr > 0) {
        const growthPercent = ((curr - prev) / prev) * 100;
        if (growthPercent > 25) {
          alerts.push({ metric, previous: prev, current: curr, growthPercent: Math.round(growthPercent) });
        }
      }
    }
  }

  history.push(snapshot);
  writeJsonFile(filePath, history);
  return alerts;
}

export function appendLighthouseHistory(results: LighthouseResult[], reportsDir: string): void {
  mkdirSync(reportsDir, { recursive: true });
  const filePath = join(reportsDir, 'lighthouse-history.json');
  const history = readJsonFile<LighthouseHistoryEntry[]>(filePath, []);
  history.push({ date: new Date().toISOString().split('T')[0], results });
  writeJsonFile(filePath, history);
}

export function generateTrendSummary(reportsDir: string): string {
  const perfPath = join(reportsDir, 'performance-history.json');
  const lhPath = join(reportsDir, 'lighthouse-history.json');

  const lines: string[] = [];

  // Performance trends
  const perfHistory = readJsonFile<PerformanceSnapshot[]>(perfPath, []);
  if (perfHistory.length >= 2) {
    const prev = perfHistory[perfHistory.length - 2];
    const curr = perfHistory[perfHistory.length - 1];
    lines.push('### Performance Trends (week-over-week)');
    lines.push('');
    lines.push('| Metric | Previous | Current | Change |');
    lines.push('|--------|----------|---------|--------|');
    const metrics: Array<[keyof Omit<PerformanceSnapshot, 'date'>, string]> = [
      ['homepageHtmlKB', 'Homepage HTML'],
      ['totalCssKB', 'Total CSS'],
      ['totalJsKB', 'Total JS'],
      ['largestToolPageKB', 'Largest Tool Page'],
      ['largestGuidePageKB', 'Largest Guide Page'],
      ['largestFaqPageKB', 'Largest FAQ Page'],
    ];
    for (const [key, label] of metrics) {
      const p = prev[key] as number;
      const c = curr[key] as number;
      const delta = p > 0 ? Math.round(((c - p) / p) * 100) : 0;
      const indicator = delta > 25 ? ' ⚠️' : delta > 0 ? ' ↑' : delta < 0 ? ' ↓' : '';
      lines.push(`| ${label} | ${p}KB | ${c}KB | ${delta > 0 ? '+' : ''}${delta}%${indicator} |`);
    }
    lines.push('');
  }

  // Lighthouse trends
  const lhHistory = readJsonFile<LighthouseHistoryEntry[]>(lhPath, []);
  if (lhHistory.length >= 2) {
    const prev = lhHistory[lhHistory.length - 2];
    const curr = lhHistory[lhHistory.length - 1];

    lines.push('### Lighthouse Trends (week-over-week)');
    lines.push('');
    // Use homepage for trend comparison
    const prevHome = prev.results.find(r => r.url.endsWith('/') && !r.url.includes('/tools/'));
    const currHome = curr.results.find(r => r.url.endsWith('/') && !r.url.includes('/tools/'));
    if (prevHome && currHome) {
      const cats: Array<[keyof LighthouseResult, string]> = [
        ['performance', 'Performance'],
        ['accessibility', 'Accessibility'],
        ['bestPractices', 'Best Practices'],
        ['seo', 'SEO'],
      ];
      lines.push(`Homepage trends (${prev.date} → ${curr.date}):`);
      lines.push('');
      lines.push('| Category | Previous | Current | Change |');
      lines.push('|----------|----------|---------|--------|');
      for (const [key, label] of cats) {
        const p = prevHome[key] as number;
        const c = currHome[key] as number;
        const delta = c - p;
        const indicator = delta < -5 ? ' ⚠️' : delta < 0 ? ' ↓' : delta > 0 ? ' ↑' : '';
        lines.push(`| ${label} | ${p} | ${c} | ${delta > 0 ? '+' : ''}${delta}${indicator} |`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}
