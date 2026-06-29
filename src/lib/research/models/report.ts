// The top-level report bundle returned by runResearchIntelligence(). Versioned and deterministic
// (given identical inputs) so reports are diffable and tests can assert byte-stable output.

import type { Opportunity } from './opportunity';
import type { EngineRecommendations } from './engine';
import type { TopicClusters } from './cluster';
import type { Roadmap } from './roadmap';
import type { ProblemGraph } from './problem';
import type { GapKind } from '../constants';

export interface TrendEntry {
  transformation: string;
  count: number;
  meanDemand: number; // 0–1
  meanScore: number; // 0–100
}

export interface GapSummary {
  kind: GapKind;
  count: number;
  opportunityIds: string[];
}

export interface ResearchReports {
  version: number;
  generatedAt: string;
  /** All scored opportunities, ranked desc by finalScore (stable tiebreak by id). */
  opportunities: Opportunity[];
  clusters: TopicClusters;
  engines: EngineRecommendations;
  gaps: GapSummary[];
  trends: TrendEntry[];
  roadmap: Roadmap;
  graph: ProblemGraph;
  summary: {
    discovered: number;
    deduped: number;
    alreadyExists: number;
    recommended: number;
    missingEngines: number;
    topScore: number;
  };
}
