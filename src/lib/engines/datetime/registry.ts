// Date & Time engine registry — single source of truth. The shared DateTimeWidget never imports a tool
// directly: it calls ToyTools.runDateTime(id, input, opts), which resolves through runDateTime() below.
// The widget reads the build-time field schema via dateTimeFields().
//
// Adding a tool: create the calculator file, add one import + one entry. Keys are the processorIds.

import type { DateTimeInput, DateTimeOpts, DateTimeResult, DateTimeFieldDef, DateTimeTool } from './types';
import { calculationError } from '@lib/results/index';
import { ageCalculator } from './calculators/age';
import { dateDifferenceCalculator } from './calculators/date-difference';
import { timezoneConverter } from './calculators/timezone';

export const DATETIME_TOOLS: Record<string, DateTimeTool> = {
  'age': ageCalculator,
  'date-difference': dateDifferenceCalculator,
  'timezone': timezoneConverter,
};

/**
 * Resolve a tool by id and run it. Never throws: an unknown id (or an unexpected exception inside a
 * tool) returns a calculation-error result so the experience layer renders uniformly.
 */
export function runDateTime(id: string, input: DateTimeInput, opts: DateTimeOpts): DateTimeResult {
  const tool = DATETIME_TOOLS[id];
  if (!tool) {
    // eslint-disable-next-line no-console
    console.warn(`[datetime] Unknown tool id "${id}".`);
    return calculationError('Unknown tool');
  }
  try {
    return tool.calculate(input, opts);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[datetime] Tool "${id}" threw:`, err);
    return calculationError('Could not complete this calculation');
  }
}

/** Build-time field schema for the widget frontmatter. Never throws; unknown id -> []. */
export function dateTimeFields(id: string): DateTimeFieldDef[] {
  return DATETIME_TOOLS[id]?.fields ?? [];
}

/** The full tool definition (fields, layout, capabilities) for the widget. */
export function getDateTimeTool(id: string): DateTimeTool | undefined {
  return DATETIME_TOOLS[id];
}
