// Encoding Engine — types.
//
// Every encode/decode tool is the same shape: a reversible text↔text transform.
// An encoder is a single object implementing this interface. The shared EncodingWidget
// never names an encoder; it calls ToyTools.runEncoding(id, mode, text), which resolves
// through the registry. Adding a family never changes this contract.
//
// Unlike text processors, decode() may THROW on malformed input — the registry resolver
// catches it and returns a result object so the widget can render an error state.

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
  /** Optional sample text for the widget's "Sample" button. */
  sample?: string;
}

export interface EncodingResult {
  ok: boolean;
  output: string;
  error?: string;
}
