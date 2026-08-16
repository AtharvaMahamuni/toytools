// The RIE pipeline — composes the analyzers in order over ResearchInputs into a versioned, fully
// deterministic ResearchReports bundle. Pure: same inputs (incl. fixed `now`) → identical output.
//
//   raw → deduplicate → score/normalize → cluster → engine-match → gaps → trends → graph → roadmap
//
// Mirrors content-intelligence/index.ts runContentIntelligence(). index.ts wires real registries.

import type { ResearchInputs } from './types';
import type { ResearchReports } from './models/report';
import { RESEARCH_SCHEMA_VERSION } from './constants';
import { deduplicate } from './analyzers/deduplicate';
import { scoreOpportunities } from './analyzers/opportunity-score';
import { buildClusters } from './analyzers/cluster';
import { recommendEngines, missingEngines } from './analyzers/engine-match';
import { summarizeGaps } from './analyzers/gaps';
import { analyzeTrends } from './analyzers/trend';
import { buildProblemGraph } from './analyzers/topic-cluster';
import { buildRoadmap } from './analyzers/roadmap';
import { analyzeLatentDemand } from './analyzers/latent-demand';

export function runPipeline(inputs: ResearchInputs): ResearchReports {
  const dedup = deduplicate(inputs.raw);
  const opportunities = scoreOpportunities(dedup.merged, inputs);

  const clusters = buildClusters(opportunities, inputs);
  const engines = recommendEngines(opportunities, inputs);
  const gaps = summarizeGaps(opportunities);
  const trends = analyzeTrends(opportunities);
  const graph = buildProblemGraph(opportunities, inputs);
  const roadmap = buildRoadmap(opportunities, engines);
  // Runs alongside the roadmap rather than feeding it: it answers a different question and its
  // scores are not comparable with finalScore, so merging the two rankings would be meaningless.
  const latent = analyzeLatentDemand(opportunities, inputs);

  const alreadyExists = opportunities.filter(o => o.status === 'already-exists').length;
  const recommended = opportunities.filter(o => o.status === 'recommended').length;

  return {
    version: RESEARCH_SCHEMA_VERSION,
    generatedAt: inputs.now,
    opportunities,
    clusters,
    engines,
    gaps,
    trends,
    roadmap,
    graph,
    latent,
    summary: {
      discovered: inputs.raw.length,
      deduped: opportunities.length,
      alreadyExists,
      recommended,
      missingEngines: missingEngines(engines).length,
      topScore: opportunities[0]?.finalScore ?? 0,
      latentSignals: latent.summary.signals,
      latentCandidates: latent.summary.anchored,
    },
  };
}
