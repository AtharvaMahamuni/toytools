// Smart field descriptor — the engine-agnostic schema a SmartInput renders from. An engine (finance
// first) declares its fields as data; the platform input layer turns each into a fully-featured,
// accessible control. Nothing here is finance-specific, so any future interactive engine reuses it.

export type SmartFieldType =
  | 'currency'
  | 'percent'
  | 'number'
  | 'integer'
  | 'select'
  | 'duration'
  // Non-numeric controls. `date`/`datetime` render native pickers; `text` is a free-form string
  // (e.g. a cron expression). Their canonical value is the raw string, not a parsed number.
  | 'date'
  | 'datetime'
  | 'text';

export interface SmartFieldOption {
  value: string;
  label: string;
}

/** A one-tap suggested value (or set of values, for tool-level scenario presets handled elsewhere). */
export interface SmartFieldPreset {
  /**
   * Chip text. Optional for `currency`-type fields, where the label is derived from the value and the
   * active display currency (symbol + compact magnitude) so it follows the currency selector.
   */
  label?: string;
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

/** The field types whose canonical value is a parsed number (steppers, human-number parsing, grouping). */
const NUMERIC_TYPES: readonly SmartFieldType[] = ['currency', 'percent', 'number', 'integer', 'duration'];

/** Is this a numeric field (as opposed to select / date / datetime / text)? */
export function isNumericField(type: SmartFieldType): boolean {
  return NUMERIC_TYPES.includes(type);
}
