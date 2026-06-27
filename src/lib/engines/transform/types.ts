// Generic transform layer — the engine-agnostic contract the ConverterWidget speaks.
//
// A "transform" is any text → text operation with an optional inverse: encoding,
// hashing (one-way), rot13, base32/58/85, quoted-printable, … The widget never names
// an engine; it calls ToyTools.transform.<verb>(kind, id, …), which dispatches by `kind`
// to the registered provider. Encoding is the first provider; new kinds register a
// TransformProvider without touching the widget. Keep every shape additive and optional
// so future engines inherit the UX (detection, validation, metadata, insight) for free.

/** How sure detection is about the chosen direction. Drives whether the UI says
 *  "Detected: X" confidently or stays quiet. */
export type TransformConfidence = 'high' | 'medium' | 'low';

/** Validation severity — lets the status line distinguish a hard error from a soft
 *  warning (still usable) or an informational note. */
export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface DetectResult {
  /** Suggested mode id (for encoding: 'encode' | 'decode'). */
  mode: string;
  confidence: TransformConfidence;
  /** Human label of what was detected, e.g. "Base64". */
  label?: string;
}

export interface ValidationDetail {
  ok: boolean;
  severity?: ValidationSeverity;
  /** Actionable, specific message ("Unexpected '=' near character 12"). */
  message?: string;
  /** 0-based index in the input where the problem is, when known. */
  position?: number;
}

export interface MetaItem {
  label: string;
  value: string;
}

/** One row of the collapsible Technical Details section. Ordered, fully extensible —
 *  any provider can add as many term/detail pairs as it likes. */
export interface TechnicalEntry {
  term: string;
  detail: string;
}

export interface TransformResult {
  ok: boolean;
  output: string;
  error?: string;
}

/** Static, build-time-renderable description of a transform (no JS needed to show it). */
export interface TransformInfo {
  displayName: string;
  /** Reversible transforms get two editable panels with two-way sync; one-way (e.g.
   *  hashing) gets a single-direction flow. */
  reversible: boolean;
  modes: {
    forward: string;
    inverse?: string;
    forwardLabel?: string;
    inverseLabel?: string;
  };
  /** Empty-state guidance, e.g. "Paste a Base64 string." */
  placeholder?: string;
  /** Compact educational copy — one string or a few short paragraphs. */
  insight?: string | string[];
  /** Collapsible technical reference (algorithm, RFC, output format, limitations). */
  technical?: TechnicalEntry[];
  /** One-click example text. */
  sample?: string;
  /** Opt-in per-byte visualization (the binary converter activates this; dormant
   *  for everything else). */
  byteView?: boolean;
}

/** A provider implements the verbs for one `kind`. The runtime facade dispatches to it. */
export interface TransformProvider {
  run(id: string, mode: string, input: string): TransformResult;
  detect(id: string, input: string): DetectResult;
  validate(id: string, mode: string, input: string): ValidationDetail;
  meta(id: string, input: string, output: string, mode: string): MetaItem[];
  info(id: string): TransformInfo;
}
