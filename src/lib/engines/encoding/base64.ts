import type { EncodingTool } from './types';
import { byteLength } from './util';

// Base64 — byte-parity with the original hand-written widget:
//   encode: btoa(unescape(encodeURIComponent(text)))
//   decode: decodeURIComponent(escape(atob(text)))
// The encodeURIComponent/unescape dance makes btoa UTF-8 safe; decode mirrors it.
// Decode strips ALL whitespace first: copied base64 is routinely line-wrapped
// (76-char MIME convention) and atob throws on embedded newlines.
// btoa/atob/escape/unescape are global in browsers and Node 18+. All calls stay
// inside methods so importing this module is side-effect-free (safe under tsx/vitest).

const B64 = /^[A-Za-z0-9+/]*={0,2}$/;

/** Pad to the next multiple of 4. A remainder of 1 is unpaddable, so callers reject it first. */
function pad(s: string): string {
  const rem = s.length % 4;
  return rem === 0 ? s : s + '='.repeat(4 - rem);
}

/**
 * Does this actually decode to text a person would want?
 *
 * The gate on every recovery offer. Without it, "Helloo" matches the Base64 alphabet, has a
 * paddable length, and would earn an offer to decode it into mojibake. An offer that fires on
 * ordinary text is worse than no offer, so a fix is only proposed when it demonstrably works:
 * the decode is attempted, and the result must be mostly printable. This also correctly declines
 * image data URIs, whose payload is binary and has no useful text rendering in a text tool.
 */
function decodesToText(candidate: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(escape(atob(candidate)));
  } catch (_) {
    return false;
  }
  if (!decoded) return false;
  // eslint-disable-next-line no-control-regex
  const noise = (decoded.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD]/g) || []).length;
  return noise / decoded.length < 0.1;
}

export const base64: EncodingTool = {
  id: 'base64',
  family: 'binary-text',
  displayName: 'Base64',
  sample: 'Hello, World!',
  placeholder: 'Type text to encode, or paste a Base64 string to decode.',
  insight:
    'Base64 represents binary data using 64 ASCII characters. It is an encoding format, not encryption: anyone can decode it, so never use it to hide secrets.',
  technical: [
    { term: 'Standard', detail: 'RFC 4648 (base64 alphabet A–Z a–z 0–9 + /)' },
    { term: 'Padding', detail: '"=" pads the output to a multiple of 4 characters' },
    { term: 'Text encoding', detail: 'Input is treated as UTF-8 before encoding' },
    { term: 'Size', detail: 'Output is about 33% larger than the input bytes' },
  ],
  encode: (input) => btoa(unescape(encodeURIComponent(input))),
  decode: (input) => decodeURIComponent(escape(atob(input.replace(/\s+/g, '')))),

  detect(input) {
    const s = input.replace(/\s+/g, '');
    if (s.length >= 4 && s.length % 4 === 0 && B64.test(s)) {
      // Padding or a non-alphabetic mix is a strong signal it is really Base64.
      const looksEncoded = s.includes('=') || /[A-Z]/.test(s) === false || /[0-9+/]/.test(s);
      return { mode: 'decode', confidence: looksEncoded ? 'high' : 'medium', label: 'Base64' };
    }
    return { mode: 'encode', confidence: 'low', label: 'Text' };
  },

  validate(input, mode) {
    if (mode === 'encode') return { ok: true, severity: 'info' };
    const s = input.replace(/\s+/g, '');
    if (!s) return { ok: true };
    // First character outside the Base64 alphabet (ignoring trailing padding).
    const body = s.replace(/=+$/, '');
    const bad = body.search(/[^A-Za-z0-9+/]/);
    if (bad !== -1) {
      return {
        ok: false,
        severity: 'error',
        message: `Unexpected character "${body[bad]}" near position ${bad + 1}: not part of the Base64 alphabet.`,
        position: bad,
      };
    }
    const padAt = s.indexOf('=');
    if (padAt !== -1 && !/=+$/.test(s.slice(padAt))) {
      return {
        ok: false,
        severity: 'error',
        message: `Unexpected "=" padding near position ${padAt + 1}: padding may only appear at the very end.`,
        position: padAt,
      };
    }
    if (s.length % 4 !== 0) {
      return {
        ok: false,
        severity: 'warning',
        message: 'Base64 length should be a multiple of 4, so the string may be truncated.',
      };
    }
    return { ok: true, severity: 'info' };
  },

  // The tool's craft (kind: recovery). Three shapes of Base64 that arrive from the real world and
  // that the validator can only reject: a data URI straight out of devtools or a CSS file, a
  // base64url token out of a JWT or a URL, and a value whose "=" padding was stripped in transit.
  // Each gets a correct, useless "Unexpected character" today. See config.ts for the declaration.
  recover(input) {
    const raw = input.trim();
    if (!raw) return null;

    // data:[<mime>][;charset=…];base64,<payload>
    const dataUri = raw.match(/^data:[^,]*;base64,([\s\S]*)$/i);
    if (dataUri) {
      const payload = dataUri[1].replace(/\s+/g, '');
      if (payload && B64.test(payload) && decodesToText(pad(payload))) {
        return { label: 'Decode the data URI payload', text: pad(payload), mode: 'decode' };
      }
      return null;
    }

    const s = raw.replace(/\s+/g, '');
    if (s.length < 4) return null;

    // base64url: the JWT/URL-safe alphabet swaps "+/" for "-_" and usually drops the padding.
    if (/[-_]/.test(s) && /^[A-Za-z0-9\-_]+={0,2}$/.test(s)) {
      const standard = pad(s.replace(/-/g, '+').replace(/_/g, '/'));
      if (s.length % 4 !== 1 && decodesToText(standard)) {
        return { label: 'Decode as base64url', text: standard, mode: 'decode' };
      }
      return null;
    }

    // Padding stripped in transit. A remainder of 1 cannot be padded into a valid length, so there
    // is nothing honest to offer there.
    if (B64.test(s) && !s.includes('=') && s.length % 4 !== 0 && s.length % 4 !== 1) {
      const padded = pad(s);
      if (decodesToText(padded)) {
        return { label: 'Add the missing padding and decode', text: padded, mode: 'decode' };
      }
    }

    return null;
  },

  meta(input, output, mode) {
    const sourceBytes = byteLength(mode === 'encode' ? input : output);
    const encoded = mode === 'encode' ? output : input.replace(/\s+/g, '');
    const ratio = sourceBytes ? (encoded.length / sourceBytes).toFixed(2) : '0';
    return [
      { label: 'Input bytes', value: String(sourceBytes) },
      { label: 'Base64 length', value: String(encoded.length) },
      { label: 'Expansion', value: `${ratio}×` },
    ];
  },
};
