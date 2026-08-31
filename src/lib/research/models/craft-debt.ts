// Craft-debt model. The craft doctrine says every tool carries ONE thoughtful touch; check-craft
// holds that as a coverage RATIO so the catalog cannot grow craftless. What neither the ratchet nor
// its --report can say is WHICH craftless tool is worth working on next: the report groups the
// backlog by engine, which tells you where the tools are and nothing about where the evidence is.
//
// The datasets already answer that. A tool whose seed record records `userFailures` and whose
// config declares no `craft` is a polish job whose touch is ALREADY SPECIFIED — the analysis was
// done when the record was written and then never picked up. Those are worth doing first, and they
// are invisible today because craft lives in the registry and the evidence lives in research/.
//
// This model is the join between the two.

/** Why a shipped tool appears in the debt list. */
export type CraftDebtKind =
  /** Recorded `userFailures`, no declared craft. The touch is already specified; go build it. */
  | 'ready-to-polish'
  /** In the datasets, no declared craft, and no recorded failure. Needs evidence before craft. */
  | 'needs-evidence';

export interface CraftDebtItem {
  /** The shipped tool slug (also the opportunity id — they match for already-exists records). */
  slug: string;
  kind: CraftDebtKind;
  /** The recorded task-level failures. Non-empty exactly when kind is 'ready-to-polish'. */
  userFailures: string[];
  /** The engine it ships on, so a batch can be planned per seam rather than per tool. */
  engine: string;
  /** Demand for the underlying need (0-100), used only to order within a kind. */
  demand: number;
}

/**
 * The craft-debt report.
 *
 * `atRisk` is the forward-looking half: buildable opportunities that would ship with no craft
 * because no task-level failure is recorded for them. It is a list of flags, not a penalty — see
 * `Opportunity.craftRisk`.
 */
export interface CraftDebtReport {
  /** Shipped tools with evidence and no craft, strongest demand first. Build these. */
  readyToPolish: CraftDebtItem[];
  /** Shipped tools with neither. Add `userFailures` before a craft can be honest. */
  needsEvidence: CraftDebtItem[];
  /** Buildable opportunities carrying `craftRisk`, ranked as the roadmap ranks them. */
  atRisk: Array<{ id: string; proposedTool: string; finalScore: number; engine: string }>;
  summary: {
    /** Tools the datasets cover that have shipped. The universe this report can speak about. */
    shippedCovered: number;
    readyToPolish: number;
    needsEvidence: number;
    atRisk: number;
  };
}
