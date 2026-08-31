// Research Intelligence Engine CLI (`npm run research [subcommand]`). Runs the pipeline over the seed
// datasets, validates before writing, and emits the report bundle to research/reports/ (+ a dated
// snapshot). Subcommands: report | roadmap | clusters | gaps | next | latent | craft | status |
// validate (default: report).
// On-demand only; never part of `npm run build`. Mirrors scripts/content-intelligence.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { loadDatasets } from './research-lib';
import { catalogInputs, defaultInputs, runResearchIntelligence } from '../src/lib/research/index';
import { fingerprintInputs } from '../src/lib/research/fingerprint';
import { validateAll } from '../src/lib/research/validate';
import { REPORT_PATHS } from '../src/lib/research/config';
import {
  opportunitiesJson,
  topOpportunitiesJson,
  missingEnginesJson,
  clustersJson,
  trendsJson,
  graphJson,
  latentJson,
  craftDebtJson,
  indexJson,
} from '../src/lib/research/reports/json';
import { opportunitiesCsv } from '../src/lib/research/reports/csv';
import { renderRoadmap, renderNextBuild, renderLatent } from '../src/lib/research/reports/markdown';

const cmd = process.argv[2] ?? 'report';

const { datasets, errors: loadErrors } = loadDatasets();
if (loadErrors.length) fail(loadErrors);
if (datasets.length === 0) fail(['No seed datasets found in ' + REPORT_PATHS.datasets]);

const base = catalogInputs();

// `status` answers "can I trust the reports already on disk?", so it runs before the pipeline and
// without needing a valid bundle: a stale report is often an invalid one too, and failing the
// freshness check on a validation error would hide the very thing the reader asked about.
if (cmd === 'status') reportStatus();

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

const nextBuildMd = renderNextBuild(reports.roadmap.nextBuild, reports.generatedAt, reports.fingerprint);

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
  case 'latent': {
    const md = renderLatent(reports);
    writeText('latent.md', md);
    writeJson('latent.json', latentJson(reports));
    console.log(md);
    break;
  }
  case 'craft': {
    writeJson('craft-debt.json', craftDebtJson(reports));
    const cd = reports.craftDebt;
    console.log(`\n[research] craft debt (${cd.summary.shippedCovered} shipped tools covered by the datasets)\n`);
    console.log(`  ready to polish   ${cd.summary.readyToPolish}  the touch is already named by recorded userFailures`);
    for (const i of cd.readyToPolish) console.log(`      ${i.slug.padEnd(34)} ${i.userFailures[0]}`);
    console.log(`  needs evidence    ${cd.summary.needsEvidence}  shipped, no craft, no recorded failure`);
    console.log(`  at risk           ${cd.summary.atRisk}  buildable opportunities that would ship craftless`);
    console.log(`\n[research] craft debt -> ${root}/craft-debt.json\n`);
    break;
  }
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
    console.error(
      `[research] unknown subcommand "${cmd}". ` +
        'Use: report | roadmap | clusters | gaps | next | latent | craft | status | validate',
    );
    process.exit(1);
}

function writeAll(): void {
  writeText('roadmap.md', renderRoadmap(reports));
  writeText('next-build.md', nextBuildMd);
  writeText('latent.md', renderLatent(reports));
  writeJson('latent.json', latentJson(reports));
  writeJson('craft-debt.json', craftDebtJson(reports));
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

/**
 * Compare the fingerprint stamped on the committed reports against the one the CURRENT datasets and
 * catalog produce, and say plainly which it is. Exits 0 either way: staleness is not an error, it is
 * a fact a reader needs before trusting next-build.md. The place it must block is the next-tool
 * skill, where a stale answer becomes a build decision.
 */
function reportStatus(): never {
  const current = fingerprintInputs({
    datasets,
    existingSlugs: base.existingSlugs,
    engineIds: base.engineIds,
    craftSlugs: base.craftSlugs,
  });
  const indexPath = `${REPORT_PATHS.root}/index.json`;
  if (!existsSync(indexPath)) {
    console.log('[research] STALE - no reports on disk yet. Run `npm run research:report`.');
    process.exit(0);
  }
  const onDisk = JSON.parse(readFileSync(indexPath, 'utf8')) as { fingerprint?: string; generatedAt?: string; nextBuild?: string };
  if (onDisk.fingerprint === current) {
    console.log(
      `[research] FRESH - reports match the current datasets and catalog (fingerprint ${current}, ` +
        `generated ${onDisk.generatedAt}). Next build on file: ${onDisk.nextBuild ?? 'none'}.`,
    );
    process.exit(0);
  }
  console.log(
    `[research] STALE - the reports were generated from different inputs.\n` +
      `    on disk: ${onDisk.fingerprint ?? '(no fingerprint - generated before this check existed)'} (${onDisk.generatedAt ?? 'unknown date'})\n` +
      `    current: ${current}\n` +
      '    The datasets or the catalog changed since. A recommendation computed against an older\n' +
      '    catalog can propose a tool that already ships. Re-run `npm run research:report` before\n' +
      '    acting on next-build.md.',
  );
  process.exit(0);
}

function fail(errors: string[]): never {
  console.error('[research] cannot run:');
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
