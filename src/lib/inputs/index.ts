// Platform input utilities — natural-number parsing, display formatting, and adaptive stepping.
// Engine-agnostic: the smart-input components and any future interactive engine reuse these.

export { parseHumanNumber } from './parse';
export { formatGrouped } from './format';
export type { FormatOptions, GroupingStyle, NumberStyle } from './format';
export { adaptiveStep } from './step';
export { isNumericField } from './field';
export type {
  SmartFieldType,
  SmartFieldOption,
  SmartFieldPreset,
  SmartFieldDef,
} from './field';
