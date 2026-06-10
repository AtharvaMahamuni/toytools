// Content Intelligence writer (`npm run intel`). Runs the analyzers over the real registries and
// writes the report bundle to dist/content-intelligence/latest/, plus a dated snapshot of the
// index for future trend analysis. Build-time only, on demand — NOT wired into `npm run build`.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { runContentIntelligence, defaultInputs } from '../src/lib/content-intelligence/index';

const reports = runContentIntelligence(defaultInputs());

const root = 'dist/content-intelligence';
const latest = `${root}/latest`;
const snapshots = `${root}/snapshots`;
mkdirSync(latest, { recursive: true });
mkdirSync(snapshots, { recursive: true });

const write = (name: string, data: unknown) =>
  writeFileSync(`${latest}/${name}`, JSON.stringify(data, null, 2));

write('coverage-report.json', reports.coverage);
write('content-gaps.json', reports.gaps);
write('category-health.json', reports.categoryHealth);
write('engine-opportunities.json', reports.engineOpportunities);
write('topic-clusters.json', reports.topicClusters);
write('roadmap-priorities.json', reports.roadmap);
write('ecosystem-health.json', reports.ecosystem);

// Versioned index — summary counts + the platform score.
const index = {
  version: reports.version,
  generatedAt: reports.generatedAt,
  topics: Object.keys(reports.coverage).length,
  gaps: reports.gaps.topics.length,
  missingTools: reports.gaps.missingTools.length,
  roadmapItems: reports.roadmap.length,
  ecosystemScore: reports.ecosystem.ecosystemScore,
};
write('index.json', index);

// Dated snapshot of the index for trend analysis (coverage June → July → …).
const date = reports.generatedAt.slice(0, 10); // YYYY-MM-DD
writeFileSync(`${snapshots}/${date}.json`, JSON.stringify(index, null, 2));

const top = reports.roadmap[0];
console.log(
  `[content-intelligence] ecosystemScore ${reports.ecosystem.ecosystemScore}/100, ` +
  `${reports.gaps.topics.length} topics with gaps, ${reports.gaps.missingTools.length} missing tools ` +
  `→ ${latest}/`,
);
if (top) {
  console.log(`[content-intelligence] top roadmap item: ${top.slug} (${top.score}) — ${top.explanation.join('; ')}`);
}

if (!existsSync(`${latest}/index.json`)) {
  console.error('[content-intelligence] failed to write reports');
  process.exit(1);
}
