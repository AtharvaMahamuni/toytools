// Encoding Engine — registry (single source of truth).
//
// Every encoder is registered here exactly once. The shared widget never imports an
// encoder directly; it calls ToyTools.runEncoding(id, mode, text), which resolves
// through runEncoding() below. Adding an encoder: create the file, add one import +
// one map entry here. No widget, runtime, or routing changes.

import type { EncodingTool, EncodingMode, EncodingResult } from './types';
import { base64 } from './base64';
import { url } from './url';
import { htmlEntity } from './htmlEntity';

// Keyed by encoder id, referenced from a tool config's `processorId`.
export const ENCODERS: Record<string, EncodingTool> = {
  base64,
  url,
  'html-entity': htmlEntity,
};

/**
 * Resolve an encoder by id and run it in the requested direction. Never throws:
 * an unknown id passes the input through unchanged; a decode failure is captured
 * as { ok:false, error } so the widget can render its error state.
 */
export function runEncoding(id: string, mode: EncodingMode, text: string): EncodingResult {
  const encoder = ENCODERS[id];
  if (!encoder) {
    // eslint-disable-next-line no-console
    console.warn(`[encoding] Unknown encoder id "${id}" — returning input unchanged.`);
    return { ok: true, output: text };
  }
  try {
    const output = mode === 'decode' ? encoder.decode(text) : encoder.encode(text);
    return { ok: true, output };
  } catch (_) {
    return {
      ok: false,
      output: '',
      error: mode === 'decode' ? 'Invalid input — could not decode.' : 'Unable to encode.',
    };
  }
}
