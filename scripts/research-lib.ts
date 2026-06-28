// Shared helpers for the RIE CLI scripts (scripts/research.ts + scripts/validate-research.ts).
// Loads + JSON-parses the seed datasets from research/datasets/. Parse failures are returned as
// errors rather than thrown, so the validator can report them and exit 1 cleanly.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPORT_PATHS } from '../src/lib/research/config';
import type { SeedDataset } from '../src/lib/research/models/provider';

export interface LoadResult {
  datasets: SeedDataset[];
  errors: string[];
}

export function loadDatasets(dir = REPORT_PATHS.datasets): LoadResult {
  const datasets: SeedDataset[] = [];
  const errors: string[] = [];
  if (!existsSync(dir)) {
    errors.push(`Datasets directory not found: ${dir}`);
    return { datasets, errors };
  }
  for (const file of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const path = join(dir, file);
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf8')) as SeedDataset;
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.records)) {
        errors.push(`${file}: not a valid SeedDataset (missing records[])`);
        continue;
      }
      datasets.push(parsed);
    } catch (e) {
      errors.push(`${file}: invalid JSON (${(e as Error).message})`);
    }
  }
  return { datasets, errors };
}
