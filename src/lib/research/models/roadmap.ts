// Roadmap + next-build models. The roadmap analyzer ranks scored opportunities into tiers and emits
// a single, fully-reasoned "next build" recommendation — the artifact the next-tool skill/agent surfaces.

import type { RoadmapTier } from '../constants';
import type { EngagementSignal } from './provider';

export interface RoadmapItem {
  id: string;
  proposedTool: string;
  title: string;
  finalScore: number;
  tier: RoadmapTier;
  engine: string;
  engineExists: boolean;
  reasons: string[];
}

/**
 * The craft evidence for a recommended tool: where its users fail mid-task, and therefore whether
 * it has a reason to exist beyond what its engine already gives every tool on it.
 *
 * Deliberately carries NO suggested `kind`. Inferring one of the five kinds from free text would be
 * guesswork dressed as a recommendation, and picking the kind is the judgement the tool-craft skill
 * exists to make. The engine's job is to supply the evidence and to be honest when it has none.
 */
export interface CraftHypothesis {
  /** Task-level failures recorded in the seed evidence. Empty when none are known. */
  userFailures: string[];
  /** False when no task-level failure is recorded, so no craft can be proposed from evidence yet. */
  hasCandidate: boolean;
  /** What the builder should do about it, in one line. */
  note: string;
}

/** Suggested supporting content for a recommended tool (data only — no prose generation). */
export interface ContentSuggestions {
  guides: string[];
  faqs: string[];
  internalLinks: string[];
  /** JSON-LD schema types the tool page should emit. */
  schema: string[];
}

/** The headline recommendation. Mirrors the spec's next-build.md shape. */
export interface NextBuild {
  id: string;
  proposedTool: string;
  title: string;
  finalScore: number;
  reason: string[];
  /** Why incumbent search results are weak. */
  incumbentWeakness: string[];
  /** Why ToyTools can compete. */
  whyWeCanWin: string[];
  /**
   * The evidence for this tool's ONE thoughtful touch, carried into the recommendation so the
   * question is answered before a tool is scaffolded rather than after.
   *
   * Without this, a recommendation could be fully justified on demand and incumbent weakness, and
   * the builder would discover at the last step that there is nothing honest to declare: then
   * either the work is wasted or a touch gets invented, which is the failure the craft doctrine
   * exists to prevent. `hasCandidate: false` is a legitimate, useful answer.
   */
  craftHypothesis: CraftHypothesis;
  /**
   * Engagement signals recorded against this need: the only evidence in the recommendation that we
   * did not author ourselves. Reported separately from `reason` on purpose - it raised confidence,
   * not the score, and a reader must be able to tell which is which.
   */
  observedEvidence: EngagementSignal[];
  engine: string;
  engineExists: boolean;
  /** Other tools the same engine unlocks next. */
  unlocksTools: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  estimatedSeoValue: 'low' | 'medium' | 'high';
  estimatedMaintenance: 'low' | 'medium' | 'high';
  content: ContentSuggestions;
  relatedTools: string[];
  relatedGuides: string[];
  relatedFaqs: string[];
}

export interface Roadmap {
  immediate: RoadmapItem[]; // top 10
  quickWins: RoadmapItem[]; // top 25 low-effort
  longTerm: RoadmapItem[];
  all: RoadmapItem[]; // up to 100, ranked
  nextBuild: NextBuild | null;
}
