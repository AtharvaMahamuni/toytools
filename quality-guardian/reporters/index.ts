import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { writeJsonReport } from './json-reporter.js';
import { writeMdReport } from './md-reporter.js';
import type { QualityReport } from '../types/index.js';

export function writeReports(report: QualityReport, reportsDir: string): void {
  mkdirSync(reportsDir, { recursive: true });

  // Ensure .gitkeep exists so the dir is tracked if reports are gitignored
  const gitkeep = join(reportsDir, '.gitkeep');
  if (!existsSync(gitkeep)) {
    writeFileSync(gitkeep, '', 'utf-8');
  }

  writeJsonReport(report, reportsDir);
  writeMdReport(report, reportsDir);
}
