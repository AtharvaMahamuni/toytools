// The unified Opportunity model. Every provider normalizes into exactly this schema — no
// provider-specific fields. Scores are 0–1 (blended into finalScore by the scorers); the evidence
// fields (existingSolutions, weaknesses, demand, competition) are carried verbatim from discovery.

import type { ProviderId, IntentKind, Difficulty, OpportunityStatus, GapKind } from '../constants';
import type { LatentEvidence, EngagementSignal } from './provider';

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
  algorithmicFit: number; // 0–1 (1 = a deterministic algorithm solves the need exactly; low = AI-shaped)
  authorityWinnability: number; // 0–1 (1 = tool quality decides the ranking; 0 = the publisher's identity does)
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
  /** Task-level failures, carried through so the roadmap can state a craft hypothesis. */
  userFailures: string[];
  /**
   * Observed engagement signals backing this need. Empty for a record resting on desk research
   * alone, which is the normal case. They raise `confidence`, never `finalScore` — see
   * scorers/corroboration.ts for why that separation is load-bearing.
   */
  signals: EngagementSignal[];
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
  algorithmicFit: number;
  /** 0–1. 1 = a correct tool can rank here; low = a YMYL SERP gated by site-level trust. */
  authorityWinnability: number;

  confidence: number; // 0–1
  finalScore: number; // 0–100 composite
  status: OpportunityStatus;

  /** How this maps onto the current catalog (gap analysis). */
  gap: GapKind;
  /** Whether the proposed engine is already registered in src/data/engines.ts. */
  engineExists: boolean;

  /**
   * True when this is a buildable opportunity with NO recorded `userFailures`, i.e. it would reach
   * the end of `add-tool` with nothing honest to declare as its craft touch.
   *
   * It is a FLAG and not a penalty, deliberately. Scoring it down would rank a tool lower for
   * evidence we have not written up yet, which measures the thinness of our datasets rather than
   * the merit of the tool, and would quietly couple the demand ranking to our own note-taking.
   * The flag reaches the builder at the only moment it can act on it: before anything is
   * scaffolded. See analyzers/craft-debt.ts.
   */
  craftRisk: boolean;

  /**
   * Present only when the seed record makes a latent-demand claim. `finalScore` will usually be low
   * for these by construction (no query = no searchDemand), which is why they are scored separately
   * by analyzers/latent-demand.ts rather than compared against demand-driven opportunities.
   */
  latent?: LatentEvidence;
}

/** Stable id from a proposed tool slug. */
export function opportunityId(proposedTool: string): string {
  return proposedTool
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
