// JWT Engine — types.
//
// A JWT decoder is not a reversible text↔text transform (encoding) nor a JSON-in/JSON-out
// transform (structured-data): decoding one token yields a COMPOSITE result — a header object,
// a payload object, a humanized claim list, and the raw signature segment. So it gets its own
// small engine. The shared JwtWidget never names a decoder; it calls ToyTools.runJwt(id, token),
// which resolves through the registry. The decode is local-only — nothing leaves the browser.
//
// decode() may THROW on malformed input — the registry resolver catches it and returns a result
// object so the widget can render an error state.

export type JwtFamily = 'token';

/** How a claim's value should be rendered. */
export type JwtClaimKind = 'time' | 'scalar' | 'json';

/** One payload claim (registered or custom), annotated for display. */
export interface JwtClaim {
  /** Raw claim key as it appears in the payload (e.g. 'exp'). */
  key: string;
  /** Friendly label ("Expires"). Falls back to the key for custom claims. */
  label: string;
  /** The raw claim value from the payload. */
  value: unknown;
  /** True for the seven RFC 7519 registered claims. */
  registered: boolean;
  /** Render hint: time claims get the epoch+UTC+relative treatment, json gets expand/nest. */
  kind: JwtClaimKind;
  /** One or two sentence meaning/why/when, for registered claims only (drives the hover/tap hint). */
  description?: string;
  /** Time claims only: ISO + relative ("...Z (in 2 days)"), a snapshot at decode time. */
  human?: string;
  /** Time claims only: the raw epoch in seconds. */
  epoch?: number;
  /** Time claims only: absolute UTC, e.g. "25 Jun 2026 16:42 UTC". */
  isoUtc?: string;
  /** True when this is `exp` and it was in the past at decode time. */
  expired?: boolean;
}

/** A deterministic, time-independent observation about the token. */
export interface JwtInsight {
  tone: 'ok' | 'warn';
  text: string;
}

export interface JwtDecoded {
  /** Pretty-printed header JSON. */
  headerJson: string;
  /** Pretty-printed payload JSON. */
  payloadJson: string;
  /** Raw third segment (signature), shown verbatim — never verified here. */
  signature: string;
  /** Header `alg` (e.g. 'HS256'), or 'none'/'unknown'. */
  algorithm: string;
  /** Header `typ` (e.g. 'JWT'), or 'unknown'. */
  type: string;
  /** Every top-level payload claim: registered ones first (canonical order), then custom in source order. */
  claims: JwtClaim[];
  /** Count of top-level claims (for the summary card). */
  claimCount: number;
  /** Raw epoch seconds for the validity panel; absent keys are simply omitted. */
  times: { iat?: number; nbf?: number; exp?: number };
  /** Structural, time-independent observations (the live validity line is added by the widget). */
  insights: JwtInsight[];
}

export interface JwtResult {
  ok: boolean;
  decoded?: JwtDecoded;
  error?: string;
}

export interface JwtTool {
  /** Stable lookup id, referenced by a tool config's `processorId` (e.g. 'jwt-decoder'). */
  id: string;
  /** Grouping used by discovery systems (related tools, search, clustering). */
  family: JwtFamily;
  /** Pure, synchronous. May throw on invalid input (caught by the resolver). */
  decode(token: string): JwtDecoded;
  /** Optional sample token for the widget's "Sample" button. */
  sample?: string;
}
