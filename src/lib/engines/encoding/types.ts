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
  RecoveryOffer,
  TechnicalEntry,
  ValidationDetail,
} from '../transform/types';

// 'numeral' is the third family: a number wearing another notation (Roman, English words, base 2).
// Same reversible text↔text contract, different vocabulary, which is why the mode labels below
// stopped being hardcoded as Encode/Decode when it arrived.
export type EncodingFamily = 'binary-text' | 'web' | 'numeral';

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
  /** Direction labels in this encoder's own vocabulary. "Encode →" is right for Base64 and wrong
   *  for a Roman numeral converter, where nothing is being encoded and both directions are the
   *  point. Defaults to Encode → / Decode ←. */
  forwardLabel?: string;
  inverseLabel?: string;
  /** Header for the output pane, when "Output" is vaguer than the truth ("Roman numeral"). */
  outputLabel?: string;
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
  /**
   * Offer a one-tap fix for input this encoder knows arrives malformed in a predictable way, or
   * null when there is none. Pure, never throws.
   *
   * The bar is honesty, not coverage: only offer a fix whose result is unambiguous. Hex declines
   * to guess which end of an odd-length string lost a nibble, and shipping nothing there is the
   * correct outcome. See docs/analysis/2026-08-11-tool-craft.md section 2.
   */
  recover?(input: string, mode: EncodingMode): RecoveryOffer | null;
}

export interface EncodingResult {
  ok: boolean;
  output: string;
  error?: string;
}
