// Latent-demand models. The RIE's opportunity model describes a need somebody has already put into
// words; these describe a need that exists as behaviour and not yet as a query.
//
// The report has two halves on purpose, and they are produced by different amounts of foresight:
//
//   signals    - derived from the catalog alone. Nobody had to think of the tool first. A signal is
//                a HOLE, not a proposal: "the catalog can produce 31 artifacts and check 1 of them".
//   candidates - proposed tools that FILL a hole, each gated on matching at least one signal. This
//                is the disciplined path from a hole to a build, and the gate is what stops the
//                report becoming a wishlist.
//
// Anything proposed that matches no signal is not silently dropped: it is reported as `unanchored`,
// because "we have no structural evidence for this" is a finding the builder needs to see.

import type { LatentSignalKind, LatentStatus } from '../constants';

/** One derived structural silence in the catalog. Pure output of the registry, no evidence needed. */
export interface LatentSignal {
  kind: LatentSignalKind;
  /** Stable id, derived from kind + subject, so signals are diffable across runs. */
  id: string;
  /** What the catalog does today, stated as fact. */
  observation: string;
  /** Why this is a need rather than a curiosity - the sentence a builder is meant to argue with. */
  implication: string;
  /** Concrete repo evidence: tool slugs, engine ids, or the recorded failure text. */
  evidence: string[];
  /** Engine(s) the hole sits in, for engine-first routing. */
  engines: string[];
  /** 0-1 how much of the catalog this silence covers (drives anchorStrength). */
  weight: number;
}

/** The link between a proposed tool and the derived silence that justifies it. */
export interface LatentAnchor {
  signalId: string;
  kind: LatentSignalKind;
  /** Why this candidate fills this particular hole. */
  because: string;
}

export interface LatentCandidate {
  id: string;
  title: string;
  proposedTool: string;
  proposedEngine: string;
  engineExists: boolean;

  /** The need stated as BEHAVIOUR ("people hand-translate cron lines into OnCalendar and guess"). */
  need: string;
  /** Why no query exists for it. The absence of a search term is the thing being explained here. */
  whyUnnamed: string;
  /** What it costs when the need goes unmet and unnoticed. */
  consequenceOf: string[];

  /** Derived silences this candidate fills. Empty => status `unanchored`. */
  anchors: LatentAnchor[];
  /** Existing catalog tools it would sit between - its distribution, since search will not be. */
  bridges: string[];

  // Signals, 0-1. Deliberately disjoint from OpportunityScores.
  anchorStrength: number;
  consequence: number;
  reachability: number;
  namelessness: number;
  algorithmicFit: number;

  /** 0-100 composite over LATENT_WEIGHTS. Not comparable with Opportunity.finalScore. */
  latentScore: number;
  status: LatentStatus;
  /** Set when status is not `candidate`, so a rejection always explains itself. */
  note?: string;
}

export interface LatentReport {
  signals: LatentSignal[];
  candidates: LatentCandidate[];
  /** Proposals that matched no derived silence, kept visible rather than dropped. */
  unanchored: LatentCandidate[];
  summary: {
    signals: number;
    considered: number;
    anchored: number;
    unanchored: number;
    topScore: number;
  };
}
