import type { EncodingTool } from './types';
import { byteLength, count } from './util';

// URL (percent) encoding. encodeURIComponent escapes everything that isn't an
// unreserved URI character; decodeURIComponent reverses it and throws on a
// malformed percent sequence (e.g. '%E0%A4%A') — caught by the resolver.

export const url: EncodingTool = {
  id: 'url',
  family: 'web',
  displayName: 'URL Encoding',
  sample: 'https://example.com/search?q=hello world & friends',
  placeholder: 'Type text to encode, or paste a percent-encoded string to decode.',
  insight:
    'URL (percent) encoding escapes reserved and non-ASCII characters as %XX so they survive inside a URL. Spaces become %20 and each non-ASCII character becomes one or more UTF-8 bytes.',
  technical: [
    { term: 'Standard', detail: 'RFC 3986 percent-encoding' },
    { term: 'Function', detail: 'Mirrors JavaScript encodeURIComponent / decodeURIComponent' },
    { term: 'Unreserved', detail: 'A–Z a–z 0–9 - _ . ! ~ * \' ( ) pass through unchanged' },
    { term: 'Bytes', detail: 'Non-ASCII is UTF-8 encoded before escaping' },
  ],
  encode: (input) => encodeURIComponent(input),
  decode: (input) => decodeURIComponent(input),

  detect(input) {
    if (/%[0-9A-Fa-f]{2}/.test(input)) {
      return { mode: 'decode', confidence: 'high', label: 'Percent-encoded' };
    }
    if (/[^A-Za-z0-9\-_.!~*'()]/.test(input)) {
      return { mode: 'encode', confidence: 'medium', label: 'Text' };
    }
    return { mode: 'encode', confidence: 'low', label: 'Text' };
  },

  validate(input, mode) {
    if (mode === 'encode') return { ok: true, severity: 'info' };
    if (!input) return { ok: true };
    // Find the first "%" not followed by two hex digits.
    const m = input.match(/%(?![0-9A-Fa-f]{2})/);
    if (m && m.index !== undefined) {
      return {
        ok: false,
        severity: 'error',
        message: `Invalid percent-encoding at position ${m.index + 1}: "%" must be followed by two hex digits.`,
        position: m.index,
      };
    }
    return { ok: true, severity: 'info' };
  },

  // The tool's craft (kind: recovery). Percent-encoding fails in three ways that look like the
  // tool being broken: a value that went through encodeURIComponent twice and decodes to more
  // percent escapes, a form-encoded value where "+" means space and decodes as a literal plus,
  // and a stray "%" from ordinary prose ("50% off") that makes the whole decode throw.
  recover(input, mode) {
    if (mode !== 'decode' || !input) return null;

    // Double-encoded: one decode leaves percent escapes behind, so the user decodes twice by hand.
    if (/%25[0-9A-Fa-f]{2}/.test(input)) {
      try {
        const once = decodeURIComponent(input);
        if (/%[0-9A-Fa-f]{2}/.test(once)) {
          return { label: 'Decode twice (this is double-encoded)', text: once, mode: 'decode' };
        }
      } catch (_) {
        return null;
      }
    }

    // Stray "%" that is not an escape. decodeURIComponent throws on the whole string, so a single
    // percent sign in prose costs the entire decode.
    if (/%(?![0-9A-Fa-f]{2})/.test(input)) {
      const escaped = input.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
      try {
        decodeURIComponent(escaped);
        return { label: 'Treat the stray "%" as a literal percent sign', text: escaped, mode: 'decode' };
      } catch (_) {
        return null;
      }
    }

    // application/x-www-form-urlencoded uses "+" for space; decodeURIComponent does not.
    if (input.includes('+') && /%[0-9A-Fa-f]{2}/.test(input)) {
      return {
        label: 'Treat "+" as spaces (form-encoded)',
        text: input.replace(/\+/g, '%20'),
        mode: 'decode',
      };
    }

    return null;
  },

  meta(input, output, mode) {
    const source = mode === 'encode' ? output : input;
    const escapes = (source.match(/%[0-9A-Fa-f]{2}/g) || []).length;
    return [
      { label: 'Escapes', value: count(escapes, 'sequence') },
      { label: 'Input length', value: String(input.length) },
      { label: 'Output bytes', value: String(byteLength(output)) },
    ];
  },
};
