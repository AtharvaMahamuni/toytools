// Browser-only loader. A datetime page runs exactly one tool, so each one is its own chunk: a bare
// literal import() per id, and scripts/check-budget.ts charges a page only for the key on its
// widget's data-datetime attribute. registry.ts keeps the static map for build-time use. Without
// this, every new tool made every existing datetime page heavier.

import type { DateTimeInput, DateTimeOpts, DateTimeResult, DateTimeTool } from './types';
import { calculationError } from '@lib/results/index';

const LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  'age': () => import('./calculators/age'),
  'date-difference': () => import('./calculators/date-difference'),
  'timezone': () => import('./calculators/timezone'),
  'unix-timestamp': () => import('./calculators/unix-timestamp'),
  'cron': () => import('./calculators/cron'),
  'systemd-timer': () => import('./calculators/systemd-timer'),
  'sleep': () => import('./calculators/sleep'),
  'date-format': () => import('./calculators/date-format'),
  'pregnancy': () => import('./calculators/pregnancy'),
  'ovulation': () => import('./calculators/ovulation'),
};

export const LAZY_DATETIME_IDS = Object.keys(LOADERS);

const loaded = new Map<string, DateTimeTool>();

function isTool(value: unknown, id: string): value is DateTimeTool {
  return typeof value === 'object' && value !== null && (value as DateTimeTool).id === id
    && typeof (value as DateTimeTool).calculate === 'function';
}

/** Fetch one lazy tool. Never throws: a failed chunk leaves it unloaded, which runs as unknown. */
export async function loadDateTimeTool(id: string): Promise<void> {
  const load = LOADERS[id];
  if (!load || loaded.has(id)) return;
  try {
    const mod = await load();
    const tool = Object.values(mod).find((v) => isTool(v, id));
    if (tool) loaded.set(id, tool as DateTimeTool);
  } catch (_) {
    // Left unloaded on purpose.
  }
}

/** Same never-throw contract as runDateTime in registry.ts, over the loaded tools. */
export function runLazyDateTime(id: string, input: DateTimeInput, opts: DateTimeOpts): DateTimeResult {
  const tool = loaded.get(id);
  if (!tool) return calculationError('Unknown tool');
  try {
    return tool.calculate(input, opts);
  } catch (_) {
    return calculationError('Could not complete this calculation');
  }
}
