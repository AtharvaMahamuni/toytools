// Research Intelligence Engine CLI (`npm run research [subcommand]`). Runs the pipeline over the seed
// datasets, validates before writing, and emits the report bundle to research/reports/ (+ a dated
// snapshot). Subcommands: report | roadmap | clusters | gaps | next | validate (default: report).
// On-demand only; never part of `npm run build`. Mirrors scripts/content-intelligence.ts.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { loadDatasets } from './research-lib';
import { defaultInputs, runResearchIntelligence } from '../src/lib/research/index';
import { validateAll } from '../src/lib/research/validate';
import { REPORT_PATHS } from '../src/lib/research/config';
import {
  opportunitiesJson,
  topOpportunitiesJson,
  missingEnginesJson,
  clustersJson,
  trendsJson,
  graphJson,
  indexJson,
} from '../src/lib/research/reports/json';
import { opportunitiesCsv } from '../src/lib/research/reports/csv';
import { renderRoadmap, renderNextBuild } from '../src/lib/research/reports/markdown';

const cmd = process.argv[2] ?? 'report';

const { datasets, errors: loadErrors } = loadDatasets();
if (loadErrors.length) fail(loadErrors);
if (datasets.length === 0) fail(['No seed datasets found in ' + REPORT_PATHS.datasets]);

const now = process.env.RESEARCH_NOW ?? new Date().toISOString();
const reports = runResearchIntelligence(defaultInputs(datasets, now));

// Always validate before writing anything.
const errors = validateAll(datasets, reports);
if (errors.length) fail(errors);

if (cmd === 'validate') {
  console.log('[research] valid — no reports written (use `report` to write).');
  process.exit(0);
}

const root = REPORT_PATHS.root;
mkdirSync(root, { recursive: true });
mkdirSync(REPORT_PATHS.snapshots, { recursive: true });

const writeJson = (name: string, data: unknown) => writeFileSync(`${root}/${name}`, JSON.stringify(data, null, 2) + '\n');
const writeText = (name: string, text: string) => writeFileSync(`${root}/${name}`, text.endsWith('\n') ? text : text + '\n');

const nextBuildMd = renderNextBuild(reports.roadmap.nextBuild, reports.generatedAt);

switch (cmd) {
  case 'next':
    writeText('next-build.md', nextBuildMd);
    console.log(nextBuildMd);
    break;
  case 'roadmap':
    writeText('roadmap.md', renderRoadmap(reports));
    writeText('next-build.md', nextBuildMd);
    console.log(`[research] roadmap -> ${root}/roadmap.md (next build: ${reports.roadmap.nextBuild?.proposedTool ?? 'none'})`);
    break;
  case 'clusters':
    writeJson('clusters.json', clustersJson(reports));
    console.log(`[research] ${reports.clusters.length} clusters -> ${root}/clusters.json`);
    break;
  case 'gaps':
    writeJson('missing-engines.json', missingEnginesJson(reports));
    for (const g of reports.gaps) console.log(`  ${g.kind}: ${g.count}`);
    console.log(`[research] gaps summarized; missing-engines -> ${root}/missing-engines.json`);
    break;
  case 'report':
  case 'all':
    writeAll();
    break;
  default:
    console.error(`[research] unknown subcommand "${cmd}". Use: report | roadmap | clusters | gaps | next | validate`);
    process.exit(1);
}

function writeAll(): void {
  writeText('roadmap.md', renderRoadmap(reports));
  writeText('next-build.md', nextBuildMd);
  writeJson('opportunities.json', opportunitiesJson(reports));
  writeJson('top-opportunities.json', topOpportunitiesJson(reports));
  writeJson('missing-engines.json', missingEnginesJson(reports));
  writeJson('clusters.json', clustersJson(reports));
  writeJson('trends.json', trendsJson(reports));
  writeJson('graph.json', graphJson(reports));
  writeJson('index.json', indexJson(reports));
  writeText('opportunities.csv', opportunitiesCsv(reports));

  const date = reports.generatedAt.slice(0, 10);
  writeFileSync(`${REPORT_PATHS.snapshots}/${date}.json`, JSON.stringify(indexJson(reports), null, 2) + '\n');

  const nb = reports.roadmap.nextBuild;
  console.log(
    `[research] ${reports.summary.deduped} opportunities, top ${reports.summary.topScore}, ` +
      `${reports.summary.missingEngines} missing-engine candidate(s) -> ${root}/`,
  );
  if (nb) console.log(`[research] next build: ${nb.proposedTool} (${nb.finalScore}) — ${nb.reason.join('; ')}`);

  if (!existsSync(`${root}/index.json`)) {
    console.error('[research] failed to write reports');
    process.exit(1);
  }
}

function fail(errors: string[]): never {
  console.error('[research] cannot run:');
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
