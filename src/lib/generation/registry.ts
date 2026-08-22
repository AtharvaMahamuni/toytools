// Generation Engine — registry (single source of truth).
//
// Every generator is registered here exactly once. The shared GeneratorWidget never imports a
// generator directly; it calls ToyTools.runGeneration(id, options), which resolves through
// runGeneration() below. Adding a generator: create the strategy file, add one import + one map
// entry here. No widget, runtime, or routing changes.

import type { Generator, GenerationResult, GeneratorOptions } from './types';
import { password } from './generators/password';
import { uuid } from './generators/uuid';
import { randomString } from './generators/randomString';
import { lorem } from './generators/lorem';
import { qrCode } from './generators/qrCode';
import { dice } from './generators/dice';
import { coinFlip } from './generators/coinFlip';
import { namePicker } from './generators/namePicker';
import { choicePicker } from './generators/choicePicker';

// Keyed by generator id, referenced from a tool config's `processorId`.
export const GENERATORS: Record<string, Generator> = {
  password,
  uuid,
  'random-string': randomString,
  'lorem-ipsum': lorem,
  'qr-code': qrCode,
  dice,
  'coin-flip': coinFlip,
  'name-picker': namePicker,
  'choice-picker': choicePicker,
};

/** Resolve a generator by id. Returns undefined for unknown ids. */
export function getGenerator(id: string): Generator | undefined {
  return GENERATORS[id];
}

/**
 * Resolve a generator and run it. Never throws: an unknown id or a strategy exception is captured
 * as { ok:false, error } so the widget can render its error state.
 */
export function runGeneration(id: string, options: GeneratorOptions): GenerationResult {
  const generator = GENERATORS[id];
  if (!generator) {
    // eslint-disable-next-line no-console
    console.warn(`[generation] Unknown generator id "${id}".`);
    return { ok: false, kind: 'text', error: `Unknown generator "${id}".` };
  }
  try {
    return generator.generate(options ?? {});
  } catch (e) {
    return { ok: false, kind: 'text', error: e instanceof Error ? e.message : 'Generation failed.' };
  }
}

/** Build-time-renderable static description of a generator (fields + behaviour flags + defaults). */
export interface GeneratorInfo {
  id: string;
  family: string;
  fields: Generator['fields'];
  defaults: GeneratorOptions;
  autoGenerate: boolean;
  live: boolean;
  notes: boolean;
}

/** Static info the shared widget reads in frontmatter to render controls with no JS. */
export function generatorInfo(id: string): GeneratorInfo | undefined {
  const g = GENERATORS[id];
  if (!g) return undefined;
  const defaults: GeneratorOptions = {};
  for (const f of g.fields) defaults[f.id] = f.default;
  return {
    id: g.id,
    family: g.family,
    fields: g.fields,
    defaults,
    autoGenerate: g.autoGenerate ?? true,
    live: g.live ?? false,
    notes: g.notes ?? false,
  };
}
