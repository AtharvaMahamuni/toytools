// Structured-Data Engine — registry (single source of truth).
//
// Every tool is registered here exactly once. The shared widget never imports a tool
// directly; it calls ToyTools.runStructuredData(id, input), which resolves through
// runStructuredData() below. Adding a tool: create the file, add one import + one entry.

import { repairJson } from './repair';
import type { JsonRepair } from './repair';
import type { StructuredDataTool, StructuredDataResult } from './types';
import { jsonValidator } from './jsonValidator';
import { jsonTreeViewer } from './jsonTreeViewer';

// Keyed by tool id, referenced from a tool config's `processorId`.
export const STRUCTURED_TOOLS: Record<string, StructuredDataTool> = {
  // Own chunk, like json-to-schema below: the lossless tokenizer would otherwise land in the shared
  // structured-data runtime, and json-tree-viewer (which loads it) is near its byte ceiling.
  'json-formatter': {
    id: 'json-formatter',
    family: 'json',
    jsonInput: true,
    execute: (input) => import('./jsonLossless').then((mod) => mod.jsonFormatter.execute(input)),
  },
  // Same lazy chunk as the formatter (./jsonLossless): both use the lossless tokenizer.
  'json-minifier': {
    id: 'json-minifier',
    family: 'json',
    jsonInput: true,
    execute: (input) => import('./jsonLossless').then((mod) => mod.jsonMinifier.execute(input)),
  },
  'json-validator': jsonValidator,
  // The four converters are lazy too: with the big-integer handling, js-yaml and the CSV parser
  // they would push the shared runtime (and json-tree-viewer, which loads it) past its ceiling.
  'json-to-csv': {
    id: 'json-to-csv',
    family: 'json',
    jsonInput: true,
    execute: (input) => import('./jsonToCsv').then((mod) => mod.jsonToCsv.execute(input)),
  },
  'json-tree-viewer': jsonTreeViewer,
  'json-to-yaml': {
    id: 'json-to-yaml',
    family: 'json',
    jsonInput: true,
    execute: (input) => import('./jsonToYaml').then((mod) => mod.jsonToYaml.execute(input)),
  },
  'yaml-to-json': {
    id: 'yaml-to-json',
    family: 'json',
    execute: (input) => import('./yamlToJson').then((mod) => mod.yamlToJson.execute(input)),
  },
  'csv-to-json': {
    id: 'csv-to-json',
    family: 'json',
    execute: (input) => import('./csvToJson').then((mod) => mod.csvToJson.execute(input)),
  },
  // Own chunk. The shared structured-data runtime is at the tool-page byte ceiling,
  // and only the JSON to Schema page calls this id.
  'json-to-schema': {
    id: 'json-to-schema',
    family: 'json',
    jsonInput: true,
    execute: (input) => import('./jsonToSchema').then((mod) => mod.jsonToSchema.execute(input)),
  },
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
  // json-formatter, json-minifier, json-to-schema and the four converters (json-to-csv,
  // json-to-yaml, yaml-to-json, csv-to-json) execute through a dynamic import and return a
  // promise. Every other id is synchronous. The shared widget accepts both.
  return tool.execute(input) as StructuredDataResult;
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
