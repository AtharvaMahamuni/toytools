// Date & Time engine types. Like finance, the datetime engine is a CONSUMER of the platform layers:
// a tool's result IS an InteractiveResult and a field IS a platform SmartFieldDef. What differs from
// finance is that inputs are commonly strings (ISO dates, cron expressions), not just numbers.

import type { SmartFieldDef } from '@lib/inputs/field';
import type { InteractiveResult, SectionId, Capabilities } from '@lib/results/types';

/** A datetime input field is just a platform smart field (date/datetime/text/select/number types). */
export type DateTimeFieldDef = SmartFieldDef;

/** Raw form values keyed by field id. Strings for date/datetime/text/select; numbers for numeric fields. */
export type DateTimeInput = Record<string, number | string>;

/** A datetime result is the platform interactive-result. */
export type DateTimeResult = InteractiveResult;

/** Options passed to every calculation. All optional — most tools carry their own inputs as fields. */
export interface DateTimeOpts {
  /** IANA timezone hint (e.g. 'America/New_York'); tools that need it usually read a select field. */
  timezone?: string;
  /** BCP-47 locale for formatting; defaults to the runtime locale. */
  locale?: string;
}

export interface DateTimeTool {
  /** Stable id == ToolConfig.processorId, unique across the engine. */
  id: string;
  /** Grouping family (age | duration | timezone | timestamp | schedule) for taxonomy + metadata. */
  family: string;
  /** The fields the widget renders (build-time schema). */
  fields: DateTimeFieldDef[];
  /** Optional section order override (defaults to the platform DEFAULT_LAYOUT). */
  layout?: SectionId[];
  /** Declared capabilities (the experience renderer + widget read these). */
  capabilities?: Partial<Capabilities>;
  /** Pure, synchronous, never-throws: builds an InteractiveResult (including the error path). */
  calculate(input: DateTimeInput, opts: DateTimeOpts): DateTimeResult;
}
