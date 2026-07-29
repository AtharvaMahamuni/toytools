// Interactive-result contract — the engine-agnostic surface every interactive ToyTools engine
// returns. Finance is the first consumer, but nothing here imports finance: a calculator, a loan
// engine, a statistics engine, all return the SAME shape so ONE experience layer can render them.
//
// Design rules (mirror the other engine contracts):
// - Never-throw: engines build a result object, including the error/uiState path, instead of throwing.
// - Presentation-independent: the engine emits DATA (cards, timeline points, a VizSpec), never markup
//   or chart code. src/components/experience/* decides how to draw it.
// - Additive + stable: most fields are optional. New sections are added as optional members so a
//   future engine never breaks the API.

import type { VizSpec } from '../visualization/types';

/**
 * The lifecycle state of an interactive computation. The experience layer renders the matching
 * presentation, so every engine feels identical. `loading`/`partial` are seams for async engines;
 * synchronous engines (finance v1) only use `empty`/`success`/`validation-error`/`calculation-error`.
 */
export type UiState =
  | 'empty'
  | 'loading'
  | 'partial'
  | 'success'
  | 'validation-error'
  | 'calculation-error';

/** Visual weight for a metric/result card. */
export type ResultEmphasis = 'hero' | 'primary' | 'secondary';

/** A single labelled value. `value` is already formatted for display; `raw` is the number for
 *  copy/charts/tests so assertions never depend on locale formatting. */
export interface ResultCard {
  id: string;
  label: string;
  value: string;
  raw?: number;
  emphasis?: ResultEmphasis;
  /** Optional one-line context under the value (e.g. "after 10 years"). */
  note?: string;
}

/** A concise, independently-readable observation that explains the result. */
export interface Insight {
  id: string;
  text: string;
  /** Optional tone hint for styling (informational by default). */
  tone?: 'info' | 'positive' | 'caution';
}

/** A notable event in the computation (money doubles, goal reached, purchasing power halved). */
export interface Milestone {
  id: string;
  label: string;
  /** When in the timeline it occurs, if time-based. */
  atYear?: number;
  /** Whether it has been reached given the current inputs. */
  reached?: boolean;
}

/** One point on a time axis. `value` is the primary series; `parts` optionally breaks it down. */
export interface TimelinePoint {
  year: number;
  value: number;
  /** Formatted label for the value, so the renderer needs no formatter. */
  display?: string;
  parts?: Record<string, number>;
}

/** A single bar/segment of a part-to-whole breakdown (e.g. principal vs interest). */
export interface BreakdownPart {
  id: string;
  label: string;
  value: number;
  display?: string;
}

/** A named alternative scenario (Current/Optimistic/Conservative). Engine emits data; rendering is
 *  a reserved seam this phase. */
export interface Comparison {
  id: string;
  label: string;
  cards: ResultCard[];
}

/** An input assumption that produced the answer, surfaced so users understand the result. */
export interface Assumption {
  id: string;
  label: string;
  value: string;
}

/** A concrete next step ("Check your emergency fund"). `href` optionally links to another tool. */
export interface Decision {
  id: string;
  label: string;
  href?: string;
}

/**
 * The full storytelling response model: answer -> metrics -> insights -> milestones -> timeline ->
 * visualization data -> assumptions -> next questions -> decisions. Every interactive engine returns
 * this; the experience layer renders whichever sections carry data (and whose capability is enabled).
 */
export interface InteractiveResult {
  ok: boolean;
  uiState: UiState;
  error?: string;
  hero?: ResultCard;
  metrics: ResultCard[];
  insights?: Insight[];
  milestones?: Milestone[];
  timeline?: TimelinePoint[];
  series?: number[];
  comparisons?: Comparison[];
  breakdown?: BreakdownPart[];
  assumptions?: Assumption[];
  explanation?: string;
  nextQuestions?: string[];
  decisions?: Decision[];
  visualization?: VizSpec;
  meta?: Record<string, number | string>;
}

/** Ordered list of experience sections. The experience renderer walks an engine-supplied `layout`,
 *  so engines reorder sections as DATA without touching the renderer. */
export type SectionId =
  | 'hero'
  | 'metrics'
  | 'visualization'
  | 'timeline'
  | 'milestones'
  | 'insights'
  | 'comparison'
  | 'assumptions'
  | 'explanation'
  | 'nextQuestions'
  | 'decisions';

/**
 * Default section order shared by every engine unless it overrides `layout`.
 *
 * Visualization sits directly under the hero, ahead of the metric ledger: for a banded or
 * part-to-whole result the chart IS the answer, and the numbers behind it are the detail. Ordering
 * it after the metrics pushed the chart below the fold on any tool with more than three rows.
 */
export const DEFAULT_LAYOUT: SectionId[] = [
  'hero',
  'visualization',
  'metrics',
  'timeline',
  'milestones',
  'insights',
  'comparison',
  'assumptions',
  'explanation',
  'nextQuestions',
  'decisions',
];

/**
 * Declared widget capabilities. The experience renderer shows only enabled capabilities, so an engine
 * never asks "can the renderer do X" — it declares X. Advanced capabilities (share/print/export/
 * snapshot) are reserved seams: declared here, false until implemented platform-wide.
 */
export interface Capabilities {
  timeline: boolean;
  comparison: boolean;
  visualization: boolean;
  copy: boolean;
  loadExample: boolean;
  reset: boolean;
  undo: boolean;
  // Reserved seams (not implemented this phase) — kept in the type so adding them later is non-breaking.
  share: boolean;
  download: boolean;
  print: boolean;
  export: boolean;
  snapshot: boolean;
}

/** Sensible defaults: the basics on, the advanced seams off. Engines override per their data. */
export const DEFAULT_CAPABILITIES: Capabilities = {
  timeline: false,
  comparison: false,
  visualization: false,
  copy: true,
  loadExample: false,
  reset: true,
  undo: false,
  share: false,
  download: false,
  print: false,
  export: false,
  snapshot: false,
};
