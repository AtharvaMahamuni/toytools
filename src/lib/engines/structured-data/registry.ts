// Structured-Data Engine — registry (single source of truth).
//
// Every tool is registered here exactly once. The shared widget never imports a tool
// directly; it calls ToyTools.runStructuredData(id, input), which resolves through
// runStructuredData() below. Adding a tool: create the file, add one import + one entry.

import { repairJson } from './repair';
import type { JsonRepair } from './repair';
import type { StructuredDataTool, StructuredDataResult } from './types';
import { jsonFormatter } from './jsonFormatter';
import { jsonMinifier } from './jsonMinifier';
import { jsonValidator } from './jsonValidator';
import { jsonToCsv } from './jsonToCsv';
import { jsonTreeViewer } from './jsonTreeViewer';
import { jsonToYaml } from './jsonToYaml';
import { yamlToJson } from './yamlToJson';
import { csvToJson } from './csvToJson';

// Keyed by tool id, referenced from a tool config's `processorId`.
export const STRUCTURED_TOOLS: Record<string, StructuredDataTool> = {
  'json-formatter': jsonFormatter,
  'json-minifier': jsonMinifier,
  'json-validator': jsonValidator,
  'json-to-csv': jsonToCsv,
  'json-tree-viewer': jsonTreeViewer,
  'json-to-yaml': jsonToYaml,
  'yaml-to-json': yamlToJson,
  'csv-to-json': csvToJson,
};

/**
 * Resolve a structured-data tool by id and run it. Never throws: an unknown id returns
 * a result error so the widget can render its status line uniformly.
 */
export function runStructuredData(id: string, input: string): StructuredDataResult {
  const tool = STRUCTURED_TOOLS[id];
  if (!tool) {
    // eslint-disable-next-line no-console
    console.warn(`[structured-data] Unknown tool id "${id}".`);
    return { ok: false, output: '', error: 'Unknown tool' };
  }
  return tool.execute(input);
}

/**
 * Offer a one-tap repair for JSON that failed to parse, or null when there is no honest one.
 *
 * Every tool on this engine is JSON-family, so the knowledge is shared rather than per-tool: a
 * trailing comma and a smart quote break the formatter, the validator and the converters
 * identically. Pure; see repair.ts for why it refuses to offer a fix that still would not parse.
 */
export function repairStructuredData(id: string, input: string): JsonRepair | null {
  return STRUCTURED_TOOLS[id]?.jsonInput ? repairJson(input) : null;
}
