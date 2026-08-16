// The catalog's input/output graph - the substrate the latent-demand analyzer reads.
//
// Every engine turns one kind of thing into another. Writing those types down once makes two
// questions answerable from the registry alone, with nobody having thought of a tool first:
//
//   "which formats can we produce and never consume?"  (dead ends)
//   "which pairs of engines meet at a format, with nothing spanning the join?"  (handoffs)
//
// Pure and deterministic. workflow.ts renders the same map as prose for the opportunity model.

import type { CatalogRef } from '../types';

/**
 * A format is `terminal` when it is meant for human eyes and nothing is supposed to consume it
 * (a word count, a computed number). Terminal formats are excluded from dead-end detection, or the
 * analyzer would report every metric tool as a hole - which is the shape of false positive that
 * makes a suggestion engine unusable.
 */
export interface FormatDef {
  id: string;
  label: string;
  terminal: boolean;
}

export const FORMATS: Record<string, FormatDef> = {
  text: { id: 'text', label: 'text', terminal: false },
  'encoded-text': { id: 'encoded-text', label: 'encoded text', terminal: false },
  json: { id: 'json', label: 'structured data', terminal: false },
  csv: { id: 'csv', label: 'tabular data', terminal: false },
  hash: { id: 'hash', label: 'a hash digest', terminal: false },
  token: { id: 'token', label: 'a signed token', terminal: false },
  credential: { id: 'credential', label: 'a credential', terminal: false },
  schedule: { id: 'schedule', label: 'a schedule expression', terminal: false },
  datetime: { id: 'datetime', label: 'a date/time', terminal: false },
  color: { id: 'color', label: 'a color', terminal: false },
  quantity: { id: 'quantity', label: 'a measured quantity', terminal: false },
  image: { id: 'image', label: 'an image', terminal: false },
  numbers: { id: 'numbers', label: 'numbers', terminal: false },
  metrics: { id: 'metrics', label: 'metrics', terminal: true },
  result: { id: 'result', label: 'a computed result', terminal: true },
  model: { id: 'model', label: 'a simulated model', terminal: true },
  state: { id: 'state', label: 'saved state', terminal: true },
};

export interface EngineIo {
  in: string;
  out: string;
}

/**
 * Engine -> the formats it consumes and emits. Keyed by the engine ids in src/data/engines.ts.
 * An engine absent from this map is treated as opaque (no seams derived from it) rather than
 * guessed at, so adding an engine can never invent a false hole - it just contributes nothing until
 * somebody writes its row.
 */
export const ENGINE_IO: Record<string, EngineIo> = {
  'text-analysis': { in: 'text', out: 'metrics' },
  'text-processor': { in: 'text', out: 'text' },
  'text-interactive': { in: 'text', out: 'text' },
  encoding: { in: 'text', out: 'encoded-text' },
  hashing: { in: 'text', out: 'hash' },
  'structured-data': { in: 'json', out: 'json' },
  csv: { in: 'csv', out: 'csv' },
  jwt: { in: 'token', out: 'json' },
  generation: { in: 'numbers', out: 'credential' },
  datetime: { in: 'datetime', out: 'datetime' },
  calculator: { in: 'numbers', out: 'result' },
  finance: { in: 'numbers', out: 'result' },
  color: { in: 'color', out: 'color' },
  units: { in: 'quantity', out: 'quantity' },
  wellness: { in: 'numbers', out: 'result' },
  physics: { in: 'model', out: 'model' },
  math: { in: 'model', out: 'model' },
  'math-lab': { in: 'model', out: 'model' },
  tracker: { in: 'state', out: 'state' },
  productivity: { in: 'state', out: 'state' },
};

export function formatLabel(id: string): string {
  return FORMATS[id]?.label ?? id;
}

/** Engines that actually have tools today, in stable order. */
export function activeEngines(catalog: CatalogRef[]): string[] {
  return [...new Set(catalog.map(c => c.engine).filter(Boolean))].sort();
}

export function toolsByEngine(catalog: CatalogRef[]): Map<string, CatalogRef[]> {
  const map = new Map<string, CatalogRef[]>();
  for (const c of catalog) {
    if (!c.engine) continue;
    const list = map.get(c.engine) ?? [];
    list.push(c);
    map.set(c.engine, list);
  }
  for (const [, list] of map) list.sort((a, b) => a.slug.localeCompare(b.slug));
  return map;
}

/** An engine CONVERTS when it changes format, rather than working within one.
 *
 *  Only a converter can create a handoff worth reporting. Two engines that both take text and return
 *  text (text-processor -> text-interactive) do not represent a missing tool when chained; they are
 *  just two tools used one after the other. Requiring a format transition on the producing side is
 *  what keeps this signal rare enough to be worth reading. */
export function isConverter(engine: string): boolean {
  const io = ENGINE_IO[engine];
  return !!io && io.in !== io.out;
}

/**
 * Whether some catalog tool already spans a join, so the seam is not a hole.
 *
 * Matches a slug naming both sides of the join. When the two formats differ, those are the two
 * tokens (`csv-to-json-converter` spans csv -> json). When they are the SAME format (`json -> json`)
 * the format alone cannot discriminate - every JSON tool contains "json", so a format-only check
 * would mark every such seam covered and silently delete the signal. There the pair is the producing
 * engine plus the format, which is what a spanning tool would actually be called
 * (`jwt-json-explorer` spans jwt -> json).
 *
 * Deliberately biased toward reporting COVERED: a slug that spans a seam without naming either side
 * is missed, which suppresses a signal rather than inventing one. A missed hole costs an idea; a
 * fabricated hole costs a build.
 */
export function seamIsCovered(catalog: CatalogRef[], from: string, to: string, fromEngine: string): boolean {
  const tokens = from === to ? [engineToken(fromEngine), formatToken(from)] : [formatToken(from), formatToken(to)];
  if (tokens.some(t => !t)) return false;
  return catalog.some(c => tokens.every(t => c.slug.includes(t)));
}

function formatToken(format: string): string {
  return format.replace('encoded-', '');
}

/** The word an engine shows up as in tool slugs ('jwt' does; 'structured-data' is spelled 'json'). */
function engineToken(engine: string): string {
  return engine.split('-')[0] ?? engine;
}
