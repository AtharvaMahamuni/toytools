// Finance engine types. The finance engine is a CONSUMER of the platform layers: a calculator's
// result IS an InteractiveResult (no parallel model), and a field IS a platform SmartFieldDef. This is
// what keeps the experience/input infrastructure engine-agnostic.

import type { SmartFieldDef } from '@lib/inputs/field';
import type { InteractiveResult, SectionId, Capabilities } from '@lib/results/types';

/** A finance input field is just a platform smart field. */
export type FinanceFieldDef = SmartFieldDef;

/** Raw form values keyed by field id. */
export type FinanceInput = Record<string, number | string>;

/** A finance result is the platform interactive-result. */
export type FinanceResult = InteractiveResult;

/** Options passed to every calculation (currently just the display currency). */
export interface FinanceOpts {
  currency: string;
}

/** A one-tap scenario that fills several fields at once (e.g. "Retirement"). Editable after applying. */
export interface FinanceScenario {
  label: string;
  values: FinanceInput;
}

export interface FinanceCalculator {
  /** Stable id == ToolConfig.processorId, unique across the engine. */
  id: string;
  /** Grouping family (interest | inflation | savings) for taxonomy + metadata. */
  family: string;
  /** The fields the widget renders (build-time schema). */
  fields: FinanceFieldDef[];
  /** Optional multi-field presets rendered as chips above the form. */
  scenarios?: FinanceScenario[];
  /** Optional section order override (defaults to the platform DEFAULT_LAYOUT). */
  layout?: SectionId[];
  /** Declared capabilities (the experience renderer + widget read these). */
  capabilities?: Partial<Capabilities>;
  /** Pure, synchronous, never-throws: builds an InteractiveResult (including the error path). */
  calculate(input: FinanceInput, opts: FinanceOpts): FinanceResult;
}
