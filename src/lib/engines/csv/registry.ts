// CSV Engine — registry (single source of truth).
//
// Every CSV tool is registered here exactly once. The shared CsvWidget never imports a
// tool directly: it calls ToyTools.runCsv(id, input, second), which resolves through
// runCsv() below. Adding a tool: create the file, add one import + one entry.

import type { CsvTool, CsvResult } from './types';
import { csvToTsv } from './csvToTsv';
import { csvClean } from './csvClean';
import { csvDiff } from './csvDiff';

// Keyed by tool id, referenced from a tool config's `processorId`.
export const CSV_TOOLS: Record<string, CsvTool> = {
  'csv-to-tsv': csvToTsv,
  'csv-clean': csvClean,
  'csv-diff': csvDiff,
};

/**
 * Resolve a CSV tool by id and run it. Never throws: an unknown id (or an unexpected
 * exception inside a tool) returns a result error so the widget renders uniformly.
 */
export function runCsv(id: string, input: string, second?: string): CsvResult {
  const tool = CSV_TOOLS[id];
  if (!tool) {
    // eslint-disable-next-line no-console
    console.warn(`[csv] Unknown tool id "${id}".`);
    return { ok: false, output: '', error: 'Unknown tool' };
  }
  try {
    return tool.execute(input, second);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[csv] Tool "${id}" threw:`, err);
    return { ok: false, output: '', error: 'Could not process this CSV' };
  }
}

/** Build-time tool definition for the widget frontmatter. Never throws. */
export function getCsvTool(id: string): CsvTool | undefined {
  return CSV_TOOLS[id];
}
