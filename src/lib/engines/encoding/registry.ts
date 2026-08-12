// Encoding Engine — registry (single source of truth).
//
// Every encoder is registered here exactly once. The shared widget never imports an
// encoder directly; it calls ToyTools.runEncoding(id, mode, text), which resolves
// through runEncoding() below. Adding an encoder: create the file, add one import +
// one map entry here. No widget, runtime, or routing changes.

import type { EncodingTool, EncodingMode, EncodingResult } from './types';
import type {
  DetectResult,
  MetaItem,
  RecoveryOffer,
  TransformInfo,
  TransformProvider,
  ValidationDetail,
} from '../transform/types';
import { base64 } from './base64';
import { rot13 } from './rot13';
import { jsonEscape } from './jsonEscape';
import { url } from './url';
import { htmlEntity } from './htmlEntity';
import { hex } from './hex';
import { binary } from './binary';
import { punycode } from './punycode';

// Keyed by encoder id, referenced from a tool config's `processorId`.
export const ENCODERS: Record<string, EncodingTool> = {
  'rot13': rot13,
  'json-escape': jsonEscape,
  base64,
  url,
  'html-entity': htmlEntity,
  hex,
  binary,
  punycode,
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

// ── Generic transform surface ────────────────────────────────────────────────
// Detection / validation / metadata / static info — each resolves through the same
// never-throw registry contract. Unknown ids or missing implementations return safe,
// neutral defaults so the ConverterWidget always has something sensible to render.

/** Suggest a direction from the input shape. Defaults to encode at low confidence. */
export function detectEncoding(id: string, text: string): DetectResult {
  const enc = ENCODERS[id];
  if (!enc || !enc.detect || !text) return { mode: 'encode', confidence: 'low' };
  try {
    return enc.detect(text);
  } catch (_) {
    return { mode: 'encode', confidence: 'low' };
  }
}

/** Actionable validation for a direction. Defaults to ok. */
export function validateEncoding(id: string, mode: EncodingMode, text: string): ValidationDetail {
  const enc = ENCODERS[id];
  if (!enc || !enc.validate || !text) return { ok: true };
  try {
    return enc.validate(text, mode);
  } catch (_) {
    return { ok: true };
  }
}

/** Live output metadata rows. Defaults to []. */
export function encodingMeta(
  id: string,
  input: string,
  output: string,
  mode: EncodingMode,
): MetaItem[] {
  const enc = ENCODERS[id];
  if (!enc || !enc.meta) return [];
  try {
    return enc.meta(input, output, mode);
  } catch (_) {
    return [];
  }
}

/**
 * Offer a one-tap fix for predictably malformed input, or null when the encoder has none.
 *
 * The craft seam: the widget renders the offer for every tool on this engine, and each encoder
 * supplies the knowledge about how ITS input arrives wrong. Never throws, and a null return is a
 * legitimate answer rather than a gap to fill.
 */
export function recoverEncoding(id: string, mode: EncodingMode, text: string): RecoveryOffer | null {
  const enc = ENCODERS[id];
  if (!enc || !enc.recover || !text) return null;
  try {
    return enc.recover(text, mode);
  } catch (_) {
    return null;
  }
}

/** Static, build-time-renderable description of an encoder. */
export function encodingInfo(id: string): TransformInfo {
  const enc = ENCODERS[id];
  return {
    displayName: enc?.displayName ?? enc?.id ?? id,
    reversible: true,
    modes: { forward: 'encode', inverse: 'decode', forwardLabel: 'Encode →', inverseLabel: 'Decode ←' },
    placeholder: enc?.placeholder,
    insight: enc?.insight,
    technical: enc?.technical,
    sample: enc?.sample,
    recoverable: typeof enc?.recover === 'function',
  };
}

/** The encoding provider, consumed by the runtime's ToyTools.transform facade. */
export const encodingProvider: TransformProvider = {
  run: (id, mode, input) => runEncoding(id, mode as EncodingMode, input),
  detect: detectEncoding,
  validate: (id, mode, input) => validateEncoding(id, mode as EncodingMode, input),
  meta: (id, input, output, mode) => encodingMeta(id, input, output, mode as EncodingMode),
  info: encodingInfo,
  recover: (id, mode, input) => recoverEncoding(id, mode as EncodingMode, input),
};
