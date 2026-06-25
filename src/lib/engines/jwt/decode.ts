import type { JwtDecoded, JwtClaim, JwtClaimKind, JwtInsight } from './types';

// Pure JWT decoder. Splits a compact JWS (header.payload.signature), base64url-decodes the
// header and payload, parses each as JSON, and humanizes the registered time claims. It NEVER
// verifies the signature — verification needs the secret/public key and is out of scope (and a
// privacy trap). Everything runs locally; nothing is transmitted.
//
// btoa/atob/escape/unescape are global in browsers and Node 18+. All calls stay INSIDE the
// function so importing this module is side-effect-free (safe under tsx/vitest).

// Registered claims (RFC 7519 §4.1) in canonical display order, with friendly labels.
const REGISTERED_CLAIMS: Array<[string, string]> = [
  ['iss', 'Issuer'],
  ['sub', 'Subject'],
  ['aud', 'Audience'],
  ['exp', 'Expires'],
  ['nbf', 'Not Before'],
  ['iat', 'Issued At'],
  ['jti', 'JWT ID'],
];

const REGISTERED_LABELS: Record<string, string> = Object.fromEntries(REGISTERED_CLAIMS);

// One or two sentence explanation per registered claim: what it means and when it is used.
const CLAIM_DEFS: Record<string, string> = {
  iss: 'Issuer. Identifies who created and signed the token, usually your auth server.',
  sub: 'Subject. Who or what the token is about, typically a stable user id.',
  aud: 'Audience. The API or service that should accept this token. Recipients reject tokens not meant for them.',
  exp: 'Expiration. The token must not be accepted after this time.',
  nbf: 'Not Before. The token must not be accepted before this time.',
  iat: 'Issued At. When the token was created, useful for measuring its age.',
  jti: 'JWT ID. A unique identifier for the token, used to prevent replay or to revoke a single token.',
};

const TIME_CLAIMS = new Set(['exp', 'nbf', 'iat']);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Absolute UTC for an epoch-seconds value, e.g. "25 Jun 2026 16:42 UTC". */
function formatUtc(seconds: number): string {
  const d = new Date(seconds * 1000);
  if (Number.isNaN(d.getTime())) return String(seconds);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

/** Strip a Bearer prefix, wrapping quotes, and all whitespace so pasted tokens "just work". */
function sanitizeToken(raw: string): string {
  return raw
    .trim()
    .replace(/^bearer\s+/i, '')
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/\s+/g, '');
}

/** base64url → UTF-8 string. Restores +,/ and missing padding, then atob + UTF-8 decode. */
function base64UrlDecode(segment: string): string {
  let b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  if (pad === 2) b64 += '==';
  else if (pad === 3) b64 += '=';
  else if (pad === 1) throw new Error('bad base64url length');
  // decodeURIComponent(escape(...)) makes atob UTF-8 safe (mirrors the base64 encoder).
  return decodeURIComponent(escape(atob(b64)));
}

/** Render an epoch-seconds claim as ISO + relative ("in 2 days" / "3 hours ago"). */
function humanizeTime(seconds: number, now: number): string {
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return String(seconds);
  const iso = date.toISOString().replace('.000Z', 'Z');
  const diffMs = seconds * 1000 - now;
  const future = diffMs >= 0;
  const abs = Math.abs(diffMs);
  const units: Array<[string, number]> = [
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
    ['second', 1000],
  ];
  let rel = 'just now';
  for (const [name, ms] of units) {
    if (abs >= ms) {
      const n = Math.floor(abs / ms);
      const label = `${n} ${name}${n === 1 ? '' : 's'}`;
      rel = future ? `in ${label}` : `${label} ago`;
      break;
    }
  }
  return `${iso} (${rel})`;
}

/** Build one annotated claim from a payload key/value pair. */
function toClaim(key: string, value: unknown, now: number): JwtClaim {
  const registered = key in REGISTERED_LABELS;
  const isTime = TIME_CLAIMS.has(key) && typeof value === 'number';
  const kind: JwtClaimKind = isTime
    ? 'time'
    : value !== null && typeof value === 'object'
      ? 'json'
      : 'scalar';
  const claim: JwtClaim = {
    key,
    label: registered ? REGISTERED_LABELS[key] : key,
    value,
    registered,
    kind,
  };
  if (registered) claim.description = CLAIM_DEFS[key];
  if (isTime) {
    const seconds = value as number;
    claim.epoch = seconds;
    claim.human = humanizeTime(seconds, now);
    claim.isoUtc = formatUtc(seconds);
    if (key === 'exp') claim.expired = seconds * 1000 < now;
  }
  return claim;
}

/** Deterministic, time-independent observations about the decoded token. */
function buildInsights(
  payload: Record<string, unknown>,
  algorithm: string,
  times: JwtDecoded['times'],
): JwtInsight[] {
  const out: JwtInsight[] = [];
  if (times.exp === undefined) out.push({ tone: 'warn', text: 'Token never expires (no exp claim).' });
  else out.push({ tone: 'ok', text: 'Token contains an expiry time.' });
  if (times.nbf !== undefined) out.push({ tone: 'ok', text: 'Token has a not-before time.' });
  if ('jti' in payload) out.push({ tone: 'ok', text: 'Token includes a unique JWT ID.' });
  if ('aud' in payload) {
    const aud = payload.aud;
    out.push(Array.isArray(aud) && aud.length > 1
      ? { tone: 'ok', text: `Token is intended for ${aud.length} audiences.` }
      : { tone: 'ok', text: 'Token is intended for one audience.' });
  }
  if (algorithm.toLowerCase() === 'none') {
    out.push({ tone: 'warn', text: 'Algorithm is "none": this token is unsigned.' });
  }
  return out;
}

export function decodeJwt(token: string): JwtDecoded {
  const sanitized = sanitizeToken(token);
  const segments = sanitized.split('.');
  if (segments.length !== 3) {
    const n = sanitized === '' ? 0 : segments.length;
    throw new Error(
      `Found ${n} segment${n === 1 ? '' : 's'}. A JWT must contain 3 segments separated by dots ` +
        `(header.payload.signature). Make sure you copied the complete token.`,
    );
  }
  const [headerSeg, payloadSeg, signature] = segments;

  let headerRaw: string;
  let payloadRaw: string;
  try {
    headerRaw = base64UrlDecode(headerSeg);
  } catch {
    throw new Error('The header is not valid Base64URL. Check whether the token was modified or truncated.');
  }
  try {
    payloadRaw = base64UrlDecode(payloadSeg);
  } catch {
    throw new Error('The payload is not valid Base64URL. Check whether the token was modified or truncated.');
  }

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(headerRaw);
  } catch {
    throw new Error('The header segment did not contain valid JSON.');
  }
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    throw new Error('The payload segment did not contain valid JSON.');
  }

  const now = Date.now();

  // Registered claims first (canonical order), then any custom claims in source order.
  const seen = new Set<string>();
  const claims: JwtClaim[] = [];
  for (const [key] of REGISTERED_CLAIMS) {
    if (key in payload) { claims.push(toClaim(key, payload[key], now)); seen.add(key); }
  }
  for (const key of Object.keys(payload)) {
    if (!seen.has(key)) claims.push(toClaim(key, payload[key], now));
  }

  const times: JwtDecoded['times'] = {};
  for (const key of TIME_CLAIMS) {
    if (typeof payload[key] === 'number') times[key as 'iat' | 'nbf' | 'exp'] = payload[key] as number;
  }

  const algorithm = typeof header.alg === 'string' ? header.alg : 'unknown';

  return {
    headerJson: JSON.stringify(header, null, 2),
    payloadJson: JSON.stringify(payload, null, 2),
    signature,
    algorithm,
    type: typeof header.typ === 'string' ? header.typ : 'unknown',
    claims,
    claimCount: claims.length,
    times,
    insights: buildInsights(payload, algorithm, times),
  };
}
