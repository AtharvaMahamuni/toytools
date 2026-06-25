import type { JwtDecoded, JwtClaim } from './types';

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

const TIME_CLAIMS = new Set(['exp', 'nbf', 'iat']);

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

export function decodeJwt(token: string): JwtDecoded {
  const trimmed = token.trim();
  const segments = trimmed.split('.');
  if (segments.length !== 3) {
    throw new Error(
      'A JWT must have 3 segments separated by dots (header.payload.signature).',
    );
  }
  const [headerSeg, payloadSeg, signature] = segments;

  let headerRaw: string;
  let payloadRaw: string;
  try {
    headerRaw = base64UrlDecode(headerSeg);
  } catch {
    throw new Error('Could not base64url-decode the header segment.');
  }
  try {
    payloadRaw = base64UrlDecode(payloadSeg);
  } catch {
    throw new Error('Could not base64url-decode the payload segment.');
  }

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(headerRaw);
  } catch {
    throw new Error('The header segment is not valid JSON.');
  }
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    throw new Error('The payload segment is not valid JSON.');
  }

  const now = Date.now();
  const claims: JwtClaim[] = [];
  for (const [key, label] of REGISTERED_CLAIMS) {
    if (!(key in payload)) continue;
    const value = payload[key];
    const claim: JwtClaim = { key, label, value };
    if (TIME_CLAIMS.has(key) && typeof value === 'number') {
      claim.human = humanizeTime(value, now);
      if (key === 'exp') claim.expired = value * 1000 < now;
    }
    claims.push(claim);
  }

  return {
    headerJson: JSON.stringify(header, null, 2),
    payloadJson: JSON.stringify(payload, null, 2),
    signature,
    algorithm: typeof header.alg === 'string' ? header.alg : 'unknown',
    type: typeof header.typ === 'string' ? header.typ : 'unknown',
    claims,
  };
}
