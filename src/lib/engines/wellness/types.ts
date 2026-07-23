// Wellness engine types. Like finance, datetime, and math, the wellness engine is a CONSUMER of the
// platform layers: a calculator's result IS an InteractiveResult and a field IS a platform
// SmartFieldDef. Inputs mix numbers (weight, height, age) and strings (unit system, sex selects).

import type { SmartFieldDef } from '@lib/inputs/field';
import type { InteractiveResult, SectionId, Capabilities } from '@lib/results/types';

/** A wellness input field is just a platform smart field (number/integer/select types). */
export type WellnessFieldDef = SmartFieldDef;

/** Raw form values keyed by field id. Strings for select fields; numbers for numeric fields. */
export type WellnessInput = Record<string, number | string>;

/** A wellness result is the platform interactive-result. */
export type WellnessResult = InteractiveResult;

/** Options passed to every calculation. Reserved (locale formatting later); tools carry their own inputs. */
export interface WellnessOpts {
  /** BCP-47 locale for formatting; defaults to the runtime locale. */
  locale?: string;
}

export interface WellnessCalculator {
  /** Stable id == ToolConfig.processorId, unique across the engine. */
  id: string;
  /** Grouping family (body-composition | energy) for taxonomy + metadata. */
  family: string;
  /** The fields the widget renders (build-time schema). */
  fields: WellnessFieldDef[];
  /** Optional section order override (defaults to the platform DEFAULT_LAYOUT). */
  layout?: SectionId[];
  /** Declared capabilities (the experience renderer + widget read these). */
  capabilities?: Partial<Capabilities>;
  /** Pure, synchronous, never-throws: builds an InteractiveResult (including the error path). */
  calculate(input: WellnessInput, opts: WellnessOpts): WellnessResult;
}
