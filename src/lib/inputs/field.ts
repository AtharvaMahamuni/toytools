// Smart field descriptor — the engine-agnostic schema a SmartInput renders from. An engine (finance
// first) declares its fields as data; the platform input layer turns each into a fully-featured,
// accessible control. Nothing here is finance-specific, so any future interactive engine reuses it.

export type SmartFieldType =
  | 'currency'
  | 'percent'
  | 'number'
  | 'integer'
  | 'select'
  | 'duration';

export interface SmartFieldOption {
  value: string;
  label: string;
}

/** A one-tap suggested value (or set of values, for tool-level scenario presets handled elsewhere). */
export interface SmartFieldPreset {
  label: string;
  value: number | string;
}

export interface SmartFieldDef {
  /** Form key, e.g. 'principal'. */
  id: string;
  label: string;
  type: SmartFieldType;
  /** Pre-filled value. String only for 'select'. */
  default: number | string;
  min?: number;
  max?: number;
  /** Fixed step; when omitted, numeric controls use an adaptive step from the current magnitude. */
  step?: number;
  /** Required for 'select'. */
  options?: SmartFieldOption[];
  /** Visual unit hint, e.g. '%', 'years', '/mo'. */
  suffix?: string;
  /** Helper line rendered under the field and wired via aria-describedby. */
  help?: string;
  /** Blank is allowed and coerces to 0 / skipped. */
  optional?: boolean;
  /** Per-field quick-pick chips. */
  presets?: SmartFieldPreset[];
}

/** Is this a numeric (non-select) field? */
export function isNumericField(type: SmartFieldType): boolean {
  return type !== 'select';
}
