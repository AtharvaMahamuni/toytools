// Encoding detection — "what is this string, and does it decode to anything real?"
//
// Every other file in this engine answers "apply codec X". This one answers the question asked
// BEFORE that: which codec, if any. The two are not the same job. Each encoder's own `detect()`
// picks a DIRECTION for the converter widget (encode or decode) once the codec is already chosen;
// this ranks the codecs against each other and is willing to conclude that none of them fits.
//
// The method is deliberately not "does it match the alphabet". Every lowercase English word matches
// the Base64 alphabet, and "decade" is valid hex. Alphabet membership alone would make the tool
// confidently wrong on ordinary text, which is worse than saying nothing. So a codec is only
// reported when its decode was ATTEMPTED and produced something text-like: structure gates the
// attempt, and the decoded bytes decide the confidence.
//
// ROT13 is deliberately absent. It maps letters to letters, so its output is indistinguishable from
// its input by any structural test, and listing it would mean listing it for every English sentence.
// A detector that cannot tell is more useful when it says so.
//
// Pure and deterministic: same input -> same output, no throwing, no globals beyond atob/TextEncoder.

import { ENCODERS } from './registry';

export type DetectionConfidence = 'high' | 'medium' | 'low';

export interface EncodingCandidate {
  /** Encoder id where one exists, or a variant id like 'base64url'. */
  id: string;
  label: string;
  confidence: DetectionConfidence;
  /** What it decodes to. Truncated by the caller for display; full value here. */
  decoded: string;
  /** The caveat that matters, when there is one. Absent when the read is unremarkable. */
  note?: string;
}

/** One more layer to peel, when the best decode is itself encoded. */
export interface NextLayer {
  label: string;
  text: string;
}

export interface EncodingDetection {
  /** Ranked best-first. Empty means "this does not appear to be encoded". */
  candidates: EncodingCandidate[];
  /**
   * The craft seam. Non-null when the winning decode is ITSELF encoded, which is the failure the
   * whole tool exists for: you decode once, get something that still looks like noise, and cannot
   * tell whether the data is corrupt or merely still wrapped.
   */
  next: NextLayer | null;
  /** Set when the payload was wrapped in a non-encoding envelope we stripped before decoding. */
  unwrapped?: { label: string; text: string };
}

const CONFIDENCE_RANK: Record<DetectionConfidence, number> = { high: 3, medium: 2, low: 1 };

/** Printable-enough to be what someone was looking for. Mirrors base64.ts's `decodesToText` gate. */
function textScore(s: string): number {
  if (!s) return 0;
  // Control characters (minus tab/LF/CR) and U+FFFD, the marker a bad byte decode leaves behind.
  // eslint-disable-next-line no-control-regex
  const noise = (s.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD]/g) || []).length;
  return 1 - noise / s.length;
}

function isTexty(s: string): boolean {
  return s.length > 0 && textScore(s) >= 0.9;
}

/** Decode through a registered encoder, or null when it throws or yields nothing usable. */
function tryDecode(id: string, input: string): string | null {
  const enc = ENCODERS[id];
  if (!enc) return null;
  try {
    const out = enc.decode(input);
    return out === '' ? null : out;
  } catch (_) {
    return null;
  }
}

/* --------------------------------------------------------------------------- envelope stripping */

const DATA_URI = /^data:[^,]*;base64,/i;

/**
 * Peel a wrapper that is not itself an encoding, so the payload gets a fair reading.
 *
 * A `data:` URI is the common one: the string genuinely IS base64, but the first characters are a
 * media type, so every alphabet test fails at the colon and the user is told their valid base64 is
 * invalid.
 */
function unwrap(input: string): { label: string; text: string } | null {
  const trimmed = input.trim();
  const m = DATA_URI.exec(trimmed);
  if (m) return { label: 'data: URI wrapper', text: trimmed.slice(m[0].length) };
  return null;
}

/* ------------------------------------------------------------------------------ codec detectors */

const B64_STD = /^[A-Za-z0-9+/]+={0,2}$/;
const B64_URL = /^[A-Za-z0-9_-]+={0,2}$/;
const HEX = /^(?:[0-9a-fA-F]{2})+$/;
const BINARY = /^[01\s]+$/;
const PERCENT = /%[0-9a-fA-F]{2}/;
const ENTITY = /&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]{1,31});/;
const JSON_ESCAPE = /\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/;
const PUNYCODE = /(^|\.)xn--/i;

function detectBase64(raw: string): EncodingCandidate | null {
  const s = raw.replace(/\s+/g, '');
  if (s.length < 4 || !B64_STD.test(s)) return null;
  // A length that is not a multiple of 4 means padding was stripped somewhere in transit. Remainder
  // 1 is unrecoverable; 2 and 3 are, and saying so is the difference between "invalid" and "fixable".
  const rem = s.length % 4;
  if (rem === 1) return null;
  const padded = rem === 0 ? s : s + '='.repeat(4 - rem);
  const decoded = tryDecode('base64', padded);
  if (decoded === null || !isTexty(decoded)) return null;
  return {
    id: 'base64',
    label: 'Base64',
    confidence: s.includes('=') || rem === 0 ? 'high' : 'medium',
    decoded,
    ...(rem !== 0 ? { note: `Padding was missing; added ${4 - rem} "=" to decode.` } : {}),
  };
}

function detectBase64Url(raw: string): EncodingCandidate | null {
  const s = raw.replace(/\s+/g, '');
  // Only interesting when it uses the URL-safe alphabet. Otherwise it is plain Base64 and reporting
  // both would be two rows saying the same thing.
  if (!/[-_]/.test(s) || s.length < 4 || !B64_URL.test(s)) return null;
  const std = s.replace(/-/g, '+').replace(/_/g, '/');
  const rem = std.length % 4;
  if (rem === 1) return null;
  const padded = rem === 0 ? std : std + '='.repeat(4 - rem);
  const decoded = tryDecode('base64', padded);
  if (decoded === null || !isTexty(decoded)) return null;
  return {
    id: 'base64url',
    label: 'Base64URL',
    confidence: 'high',
    decoded,
    note: 'Uses -_ instead of +/, so a standard Base64 decoder rejects or mangles it.',
  };
}

function detectHex(raw: string): EncodingCandidate | null {
  const s = raw.replace(/\s+/g, '');
  if (s.length < 4 || !HEX.test(s)) return null;
  const decoded = tryDecode('hex', s);
  if (decoded === null || !isTexty(decoded)) return null;
  // A hex string of digest length is far more likely to BE a digest than to be encoded text.
  const digest = [32, 40, 56, 64, 96, 128].includes(s.length);
  return {
    id: 'hex',
    label: 'Hex',
    confidence: digest ? 'low' : 'high',
    decoded,
    ...(digest
      ? { note: `${s.length} hex characters is also the length of a hash digest, which does not decode to anything.` }
      : {}),
  };
}

function detectBinary(raw: string): EncodingCandidate | null {
  const s = raw.trim();
  if (!BINARY.test(s)) return null;
  const bits = s.replace(/\s+/g, '');
  if (bits.length < 8 || bits.length % 8 !== 0) return null;
  const decoded = tryDecode('binary', s);
  if (decoded === null || !isTexty(decoded)) return null;
  return { id: 'binary', label: 'Binary', confidence: 'high', decoded };
}

function detectUrl(raw: string): EncodingCandidate | null {
  if (!PERCENT.test(raw)) return null;
  const decoded = tryDecode('url', raw);
  if (decoded === null || decoded === raw || !isTexty(decoded)) return null;
  return { id: 'url', label: 'URL-encoded', confidence: 'high', decoded };
}

function detectHtmlEntity(raw: string): EncodingCandidate | null {
  if (!ENTITY.test(raw)) return null;
  const decoded = tryDecode('html-entity', raw);
  if (decoded === null || decoded === raw) return null;
  return { id: 'html-entity', label: 'HTML entities', confidence: 'high', decoded };
}

function detectJsonEscape(raw: string): EncodingCandidate | null {
  if (!JSON_ESCAPE.test(raw)) return null;
  const decoded = tryDecode('json-escape', raw);
  if (decoded === null || decoded === raw) return null;
  return { id: 'json-escape', label: 'JSON-escaped', confidence: 'medium', decoded };
}

function detectPunycode(raw: string): EncodingCandidate | null {
  const s = raw.trim();
  if (!PUNYCODE.test(s)) return null;
  const decoded = tryDecode('punycode', s);
  if (decoded === null || decoded === s) return null;
  return {
    id: 'punycode',
    label: 'Punycode',
    confidence: 'high',
    decoded,
    note: 'Decoded label may use characters that look like ASCII ones.',
  };
}

const DETECTORS = [
  detectBase64Url,
  detectBase64,
  detectUrl,
  detectHtmlEntity,
  detectPunycode,
  detectBinary,
  detectJsonEscape,
  detectHex,
];

/* ---------------------------------------------------------------------------------- entry point */

/** Rank the codecs that plausibly produced `input`. Empty candidates means "not encoded". */
export function detectEncoding(input: string): EncodingDetection {
  const empty: EncodingDetection = { candidates: [], next: null };
  if (!input || !input.trim()) return empty;

  const wrapper = unwrap(input);
  const subject = wrapper ? wrapper.text : input;

  const candidates: EncodingCandidate[] = [];
  for (const d of DETECTORS) {
    const c = d(subject);
    if (c) candidates.push(c);
  }

  // Rank by confidence, then by how clean the decode is. A tie on both keeps detector order, which
  // is arranged most-specific first so Base64URL is never buried under plain Base64.
  candidates.sort(
    (a, b) => CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence] || textScore(b.decoded) - textScore(a.decoded),
  );

  const best = candidates[0];
  const next = best ? nextLayer(best.decoded) : null;

  return {
    candidates,
    next,
    ...(wrapper ? { unwrapped: wrapper } : {}),
  };
}

/**
 * Is the decoded output itself encoded? Only a confident, non-hex read counts.
 *
 * Hex is excluded on purpose: almost any byte string can be read as hex at low confidence, so
 * allowing it here would offer an endless chain of meaningless peels on perfectly finished output.
 */
function nextLayer(decoded: string): NextLayer | null {
  for (const d of DETECTORS) {
    const c = d(decoded);
    if (c && c.confidence === 'high' && c.id !== 'hex') return { label: c.label, text: decoded };
  }
  return null;
}
