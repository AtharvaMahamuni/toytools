// RIE validation gate (`npm run research:validate`). Loads the seed datasets, runs the full pipeline,
// validates datasets + registry + generated reports, and exits 1 on any error (CI-runnable). Mirrors
// scripts/validate-registry.ts: collect errors, print, never throw.

import { loadDatasets } from './research-lib';
import { defaultInputs, runResearchIntelligence } from '../src/lib/research/index';
import { validateAll } from '../src/lib/research/validate';

const { datasets, errors: loadErrors } = loadDatasets();

let errors = [...loadErrors];
if (datasets.length > 0) {
  const reports = runResearchIntelligence(defaultInputs(datasets, '2026-01-01T00:00:00.000Z'));
  errors = errors.concat(validateAll(datasets, reports));
} else if (loadErrors.length === 0) {
  errors.push('No seed datasets found to validate.');
}

if (errors.length === 0) {
  console.log('[validate-research] OK — datasets, registry, and reports all valid.');
  process.exit(0);
}

console.error('[validate-research] Errors found:');
for (const e of errors) console.error(`  ✗ ${e}`);
console.error(`${errors.length} error(s). Fix before generating reports.`);
process.exit(1);
