// Math engine types. Like finance and datetime, the math engine is a CONSUMER of the platform
// layers: a calculator's result IS an InteractiveResult and a field IS a platform SmartFieldDef.
// Inputs mix strings (fractions like "1 2/3", operation selects) and numbers (n, r).

import type { SmartFieldDef } from '@lib/inputs/field';
import type { InteractiveResult, SectionId, Capabilities } from '@lib/results/types';

/** A math input field is just a platform smart field (number/integer/text/select types). */
export type MathFieldDef = SmartFieldDef;

/** Raw form values keyed by field id. Strings for text/select fields; numbers for numeric fields. */
export type MathInput = Record<string, number | string>;

/** A math result is the platform interactive-result. */
export type MathResult = InteractiveResult;

/** Options passed to every calculation. Reserved (locale formatting later); tools carry their own inputs. */
export interface MathOpts {
  /** BCP-47 locale for formatting; defaults to the runtime locale. */
  locale?: string;
}

export interface MathCalculator {
  /** Stable id == ToolConfig.processorId, unique across the engine. */
  id: string;
  /** Grouping family (fractions | combinatorics | number-theory) for taxonomy + metadata. */
  family: string;
  /** The fields the widget renders (build-time schema). */
  fields: MathFieldDef[];
  /** Optional section order override (defaults to the platform DEFAULT_LAYOUT). */
  layout?: SectionId[];
  /** Declared capabilities (the experience renderer + widget read these). */
  capabilities?: Partial<Capabilities>;
  /** Pure, synchronous, never-throws: builds an InteractiveResult (including the error path). */
  calculate(input: MathInput, opts: MathOpts): MathResult;
}
