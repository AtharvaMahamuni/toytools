// The top-level report bundle returned by runResearchIntelligence(). Versioned and deterministic
// (given identical inputs) so reports are diffable and tests can assert byte-stable output.

import type { Opportunity } from './opportunity';
import type { EngineRecommendations } from './engine';
import type { TopicClusters } from './cluster';
import type { Roadmap } from './roadmap';
import type { ProblemGraph } from './problem';
import type { LatentReport } from './latent';
import type { CraftDebtReport } from './craft-debt';
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
  /**
   * Hash of the datasets + catalog this bundle was generated from. Compare it against a freshly
   * computed one to tell a current report from a stale one; `npm run research:status` does exactly
   * that. See fingerprint.ts for why a report with no such stamp is worse than no report.
   */
  fingerprint: string;
  /** All scored opportunities, ranked desc by finalScore (stable tiebreak by id). */
  opportunities: Opportunity[];
  clusters: TopicClusters;
  engines: EngineRecommendations;
  gaps: GapSummary[];
  trends: TrendEntry[];
  roadmap: Roadmap;
  graph: ProblemGraph;
  /** Second-order demand: needs with no query behind them. Scored on its own axes, not finalScore. */
  latent: LatentReport;
  /** Where the craft declarations in the registry and the failure evidence in the datasets disagree. */
  craftDebt: CraftDebtReport;
  summary: {
    discovered: number;
    deduped: number;
    alreadyExists: number;
    recommended: number;
    missingEngines: number;
    topScore: number;
    latentSignals: number;
    latentCandidates: number;
    craftReadyToPolish: number;
    craftAtRisk: number;
  };
}
