// Encoding Engine — types.
//
// Every encode/decode tool is the same shape: a reversible text↔text transform.
// An encoder is a single object implementing this interface. The shared ConverterWidget
// never names an encoder; it calls the ToyTools.transform facade (kind 'encoding'), which
// resolves through the registry. Adding a family never changes this contract.
//
// Unlike text processors, decode() may THROW on malformed input — the registry resolver
// catches it and returns a result object so the widget can render an error state.
//
// Encoders also implement the optional UX surface from the generic transform layer
// (detect/validate/meta + static insight/technical/displayName/placeholder). All of it
// is OPTIONAL so the ConverterWidget degrades gracefully and future encoders opt in.

import type {
  DetectResult,
  MetaItem,
  TechnicalEntry,
  ValidationDetail,
} from '../transform/types';

export type EncodingFamily = 'binary-text' | 'web';

export type EncodingMode = 'encode' | 'decode';

export interface EncodingTool {
  /** Stable lookup id, referenced by a tool config's `processorId` (e.g. 'base64'). */
  id: string;
  /** Grouping used by discovery systems (related tools, search, clustering). */
  family: EncodingFamily;
  /** Pure, synchronous. No deps, no I/O. */
  encode(input: string): string;
  /** Pure, synchronous. May throw on invalid input (caught by the resolver). */
  decode(input: string): string;
  /** Optional sample text for the widget's "Load example" button. */
  sample?: string;

  // ── Optional UX surface (generic transform contract) ──────────────────────
  /** Friendly name for status lines ("Base64"). Falls back to `id`. */
  displayName?: string;
  /** Empty-state guidance ("Paste a Base64 string."). */
  placeholder?: string;
  /** Compact educational copy (1 string or a few short lines). */
  insight?: string | string[];
  /** Collapsible technical reference rows. */
  technical?: TechnicalEntry[];
  /** Pick a likely direction from the input shape, with a confidence. Pure. */
  detect?(input: string): DetectResult;
  /** Actionable validation for the given direction. Pure, never throws. */
  validate?(input: string, mode: EncodingMode): ValidationDetail;
  /** Live output metadata rows. Pure, never throws. */
  meta?(input: string, output: string, mode: EncodingMode): MetaItem[];
}

export interface EncodingResult {
  ok: boolean;
  output: string;
  error?: string;
}
