// The unified Opportunity model. Every provider normalizes into exactly this schema — no
// provider-specific fields. Scores are 0–1 (blended into finalScore by the scorers); the evidence
// fields (existingSolutions, weaknesses, demand, competition) are carried verbatim from discovery.

import type { ProviderId, IntentKind, Difficulty, OpportunityStatus, GapKind } from '../constants';

export interface OpportunityScores {
  searchDemand: number; // 0–1
  competition: number; // 0–1 (1 = wide open / weak incumbents)
  evergreen: number; // 0–1
  implementationCost: number; // 0–1 (1 = cheap to build)
  engineReuse: number; // 0–1 (1 = fully reuses an existing engine)
  seoPotential: number; // 0–1
  topicClusterPotential: number; // 0–1
  commercialPotential: number; // 0–1
  localizationPotential: number; // 0–1
}

export interface Opportunity {
  /** Deterministic, derived from proposedTool — stable across runs (dedup + stable test output). */
  id: string;
  title: string;
  problem: string;
  userIntent: IntentKind;
  /** input → transform → output sketch of the workflow. */
  workflow: string;
  transformation: string;
  proposedTool: string;
  proposedEngine: string;

  searchQueries: string[];
  /** All providers that surfaced this opportunity (after dedup), strongest first. */
  source: ProviderId[];
  discoveredAt: string;

  existingSolutions: string[];
  solutionWeaknesses: string[];
  relatedProblems: string[];
  relatedTools: string[];
  relatedGuides: string[];
  relatedFaqs: string[];

  difficulty: Difficulty;

  // Individual signals (0–1) — flattened onto the opportunity for easy report/CSV consumption.
  evergreenScore: number;
  competitionScore: number;
  searchDemand: number;
  implementationCost: number;
  engineReuse: number;
  seoPotential: number;
  topicClusterPotential: number;
  commercialPotential: number;
  localizationPotential: number;

  confidence: number; // 0–1
  finalScore: number; // 0–100 composite
  status: OpportunityStatus;

  /** How this maps onto the current catalog (gap analysis). */
  gap: GapKind;
  /** Whether the proposed engine is already registered in src/data/engines.ts. */
  engineExists: boolean;
}

/** Stable id from a proposed tool slug. */
export function opportunityId(proposedTool: string): string {
  return proposedTool
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
