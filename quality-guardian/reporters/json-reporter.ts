import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { QualityReport } from '../types/index.js';

export function writeJsonReport(report: QualityReport, reportsDir: string): void {
  mkdirSync(reportsDir, { recursive: true });
  const filePath = join(reportsDir, 'quality-report.json');
  writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`[reporter] JSON report written to ${filePath}`);
}
