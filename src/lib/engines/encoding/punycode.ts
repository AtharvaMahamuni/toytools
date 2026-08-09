import type { EncodingTool } from './types';

// Punycode (RFC 3492) — the encoding behind internationalized domain names (IDNs). A Unicode
// label like "münchen" becomes the ASCII form "xn--mnchen-3ya" so legacy DNS can carry it.
//
// This is a self-contained implementation of the Bootstring algorithm (no Node `punycode`
// module, which is browser-unavailable and deprecated). encode()/decode() operate on a full
// dot-separated domain: each label that needs it is converted and prefixed with "xn--".

const BASE = 36;
const TMIN = 1;
const TMAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIMITER = '-';
const MAX_INT = 2147483647;

/** Convert a string into an array of Unicode code points (handles surrogate pairs). */
function ucs2decode(str: string): number[] {
  const out: number[] = [];
  for (const ch of str) out.push(ch.codePointAt(0)!);
  return out;
}

function digitToBasic(digit: number): number {
  // 0..25 → 'a'..'z', 26..35 → '0'..'9'
  return digit + 22 + 75 * (digit < 26 ? 1 : 0);
}

function basicToDigit(codePoint: number): number {
  if (codePoint - 48 < 10) return codePoint - 22; // 0..9 → 26..35
  if (codePoint - 65 < 26) return codePoint - 65; // A..Z → 0..25
  if (codePoint - 97 < 26) return codePoint - 97; // a..z → 0..25
  return BASE;
}

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  let d = firstTime ? Math.floor(delta / DAMP) : delta >> 1;
  d += Math.floor(d / numPoints);
  let k = 0;
  for (; d > ((BASE - TMIN) * TMAX) >> 1; k += BASE) {
    d = Math.floor(d / (BASE - TMIN));
  }
  return Math.floor(k + ((BASE - TMIN + 1) * d) / (d + SKEW));
}

/** Encode a single label's Unicode code points into a basic-ASCII Punycode string. */
function encodeLabel(input: string): string {
  const output: string[] = [];
  const codePoints = ucs2decode(input);
  const inputLength = codePoints.length;
  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;

  for (const cp of codePoints) {
    if (cp < 0x80) output.push(String.fromCharCode(cp));
  }
  const basicLength = output.length;
  let handled = basicLength;
  if (basicLength) output.push(DELIMITER);

  while (handled < inputLength) {
    let m = MAX_INT;
    for (const cp of codePoints) if (cp >= n && cp < m) m = cp;

    if (m - n > Math.floor((MAX_INT - delta) / (handled + 1))) throw new RangeError('overflow');
    delta += (m - n) * (handled + 1);
    n = m;

    for (const cp of codePoints) {
      if (cp < n && ++delta > MAX_INT) throw new RangeError('overflow');
      if (cp === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
          if (q < t) break;
          const qMinusT = q - t;
          const baseMinusT = BASE - t;
          output.push(String.fromCharCode(digitToBasic(t + (qMinusT % baseMinusT))));
          q = Math.floor(qMinusT / baseMinusT);
        }
        output.push(String.fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handled + 1, handled === basicLength);
        delta = 0;
        handled++;
      }
    }
    delta++;
    n++;
  }
  return output.join('');
}

/** Decode a single basic-ASCII Punycode string back into Unicode. */
function decodeLabel(input: string): string {
  const output: number[] = [];
  let n = INITIAL_N;
  let i = 0;
  let bias = INITIAL_BIAS;

  let basic = input.lastIndexOf(DELIMITER);
  if (basic < 0) basic = 0;
  for (let j = 0; j < basic; j++) {
    if (input.charCodeAt(j) >= 0x80) throw new RangeError('not basic');
    output.push(input.charCodeAt(j));
  }

  for (let index = basic > 0 ? basic + 1 : 0; index < input.length; ) {
    const oldi = i;
    for (let w = 1, k = BASE; ; k += BASE) {
      if (index >= input.length) throw new RangeError('invalid input');
      const digit = basicToDigit(input.charCodeAt(index++));
      if (digit >= BASE || digit > Math.floor((MAX_INT - i) / w)) throw new RangeError('overflow');
      i += digit * w;
      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
      if (digit < t) break;
      const baseMinusT = BASE - t;
      if (w > Math.floor(MAX_INT / baseMinusT)) throw new RangeError('overflow');
      w *= baseMinusT;
    }
    const outLength = output.length + 1;
    bias = adapt(i - oldi, outLength, oldi === 0);
    if (Math.floor(i / outLength) > MAX_INT - n) throw new RangeError('overflow');
    n += Math.floor(i / outLength);
    i %= outLength;
    output.splice(i++, 0, n);
  }
  return String.fromCodePoint(...output);
}

const hasNonAscii = (s: string): boolean => /[^\x00-\x7F]/.test(s);

export const punycode: EncodingTool = {
  id: 'punycode',
  family: 'web',
  displayName: 'Punycode',
  sample: 'münchen.de',
  placeholder: 'Type a Unicode domain to encode, or an xn-- domain to decode.',
  insight:
    'Punycode lets internationalized domain names (IDNs) travel through DNS, which only allows ASCII. "münchen.de" is stored as "xn--mnchen-3ya.de". Each label is converted on its own; the "xn--" prefix marks an encoded label.',
  technical: [
    { term: 'Standard', detail: 'RFC 3492 (Bootstring), used by IDNA for domain names' },
    { term: 'Prefix', detail: 'Encoded labels are prefixed with "xn--"' },
    { term: 'Scope', detail: 'Converts per dot-separated label; ASCII labels pass through unchanged' },
    { term: 'Note', detail: 'Raw Punycode only, with no full IDNA nameprep or normalization' },
  ],
  encode(input: string): string {
    return input
      .split('.')
      .map(label => (hasNonAscii(label) ? `xn--${encodeLabel(label)}` : label))
      .join('.');
  },
  decode(input: string): string {
    return input
      .split('.')
      .map(label => (/^xn--/i.test(label) ? decodeLabel(label.slice(4)) : label))
      .join('.');
  },

  detect(input) {
    if (/(^|\.)xn--/i.test(input)) return { mode: 'decode', confidence: 'high', label: 'Punycode' };
    if (hasNonAscii(input)) return { mode: 'encode', confidence: 'high', label: 'Unicode' };
    return { mode: 'encode', confidence: 'low', label: 'ASCII' };
  },
};
