import type { EncodingTool } from './types';
import { byteLength } from './util';

// JSON string escaping. Encode turns plain text into the body of a JSON string literal
// (quotes, backslashes, control characters escaped) WITHOUT the surrounding quotes, matching
// what you paste between quotes in a JSON document. Decode reverses it, tolerating input that
// still carries the outer quotes.

const ESCAPE_SEQUENCE = /\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/;
const ESCAPE_SEQUENCE_ALL = /\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g;

function stripOuterQuotes(input: string): string {
  const t = input.trim();
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
  return t;
}

function countEscapes(s: string): number {
  return (s.match(ESCAPE_SEQUENCE_ALL) ?? []).length;
}

export const jsonEscape: EncodingTool = {
  id: 'json-escape',
  family: 'web',
  displayName: 'JSON string',
  sample: 'He said "hello",\nthen left.\tPath: C:\\temp',
  placeholder: 'Type text to escape, or paste an escaped JSON string to unescape.',
  insight:
    'JSON strings cannot contain raw quotes, backslashes, or control characters like newlines and tabs. Escaping replaces them with backslash sequences (\\" \\\\ \\n \\t \\uXXXX) so the text fits inside one JSON string literal. Unescaping turns those sequences back into the original characters.',
  technical: [
    { term: 'Escaped', detail: '" \\ and control chars U+0000..U+001F (plus U+2028/U+2029 for JS safety)' },
    { term: 'Sequences', detail: '\\" \\\\ \\/ \\b \\f \\n \\r \\t and \\uXXXX' },
    { term: 'Quotes', detail: 'Output has no surrounding quotes; unescape accepts them' },
    { term: 'Standard', detail: 'RFC 8259 string grammar' },
  ],
  encode(input: string): string {
    // JSON.stringify produces a valid string literal; drop the outer quotes and additionally
    // escape U+2028/U+2029, which are legal JSON but break when inlined into JavaScript.
    return JSON.stringify(input)
      .slice(1, -1)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  },
  decode(input: string): string {
    const body = stripOuterQuotes(input);
    try {
      return JSON.parse(`"${body}"`) as string;
    } catch {
      throw new Error('Not a valid JSON string: check for unescaped quotes or a dangling backslash');
    }
  },

  detect(input) {
    const t = input.trim();
    const quoted = t.length >= 2 && t.startsWith('"') && t.endsWith('"');
    if (ESCAPE_SEQUENCE.test(t) || quoted) {
      return { mode: 'decode', confidence: quoted ? 'high' : 'medium', label: 'Escaped JSON string' };
    }
    return { mode: 'encode', confidence: 'low', label: 'Text' };
  },

  validate(input, mode) {
    if (mode === 'encode' || !input) return { ok: true, severity: 'info' };
    try {
      JSON.parse(`"${stripOuterQuotes(input)}"`);
      return { ok: true, severity: 'info' };
    } catch {
      return {
        ok: false,
        severity: 'error',
        message: 'Not a valid JSON string body (unescaped quote, control character, or bad \\u sequence).',
      };
    }
  },

  meta(input, output, mode) {
    return [
      { label: mode === 'encode' ? 'Characters in' : 'Escaped length', value: String(input.length) },
      { label: mode === 'encode' ? 'Escaped length' : 'Characters out', value: String(output.length) },
      { label: 'Escape sequences', value: String(countEscapes(mode === 'encode' ? output : input)) },
      { label: 'UTF-8 bytes', value: String(byteLength(mode === 'encode' ? input : output)) },
    ];
  },
};
