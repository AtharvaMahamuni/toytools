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

/** One registered (or notable) claim, humanized for display. */
export interface JwtClaim {
  /** Raw claim key as it appears in the payload (e.g. 'exp'). */
  key: string;
  /** Friendly label ("Expires"). Falls back to the key for unknown claims. */
  label: string;
  /** The raw claim value from the payload. */
  value: unknown;
  /** Human rendering for time claims — ISO + relative ("in 2 days"). Absent for non-time claims. */
  human?: string;
  /** True when this is `exp` and it is in the past (token expired). */
  expired?: boolean;
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
  /** Humanized registered claims in canonical order, plus a flag if the token is expired. */
  claims: JwtClaim[];
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
