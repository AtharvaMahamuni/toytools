import { describe, it, expect } from 'vitest';
import {
  runEncoding,
  ENCODERS,
  detectEncoding,
  validateEncoding,
  encodingMeta,
  encodingInfo,
} from './registry';

// --- Registry resolver ---

describe('runEncoding', () => {
  it('encodes via a known encoder', () =>
    expect(runEncoding('base64', 'encode', 'Hello').output).toBe('SGVsbG8='));
  it('decodes via a known encoder', () =>
    expect(runEncoding('base64', 'decode', 'SGVsbG8=').output).toBe('Hello'));
  it('passes input through unchanged for unknown id', () => {
    const r = runEncoding('does-not-exist', 'encode', 'hello');
    expect(r).toEqual({ ok: true, output: 'hello' });
  });
  it('captures decode failure as a result error (does not throw)', () => {
    const r = runEncoding('base64', 'decode', '!!!not base64!!!');
    expect(r.ok).toBe(false);
    expect(r.output).toBe('');
    expect(r.error).toMatch(/decode/i);
  });
  it('captures URL decode failure for a malformed percent sequence', () => {
    const r = runEncoding('url', 'decode', '%E0%A4%A');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });
});

// --- Base64 (byte-parity with the original widget) ---

describe('base64', () => {
  const { encode, decode } = ENCODERS.base64;
  it('encodes ASCII', () => expect(encode('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ=='));
  it('round-trips ASCII', () => expect(decode(encode('Hello, World!'))).toBe('Hello, World!'));
  it('encodes empty string to empty', () => expect(encode('')).toBe(''));
  it('decodes empty string to empty', () => expect(decode('')).toBe(''));
  it('handles UTF-8 (accented)', () => expect(decode(encode('café'))).toBe('café'));
  it('handles UTF-8 (emoji)', () => expect(decode(encode('🚀✨'))).toBe('🚀✨'));
  it('trims whitespace on decode', () => expect(decode('  SGVsbG8=  ')).toBe('Hello'));
  it('decodes line-wrapped base64 (MIME 76-char wrapping)', () =>
    expect(decode('SGVs\nbG8s\r\nIFdv cmxkIQ==')).toBe('Hello, World!'));
  it('throws on invalid base64 (caught by resolver)', () =>
    expect(() => decode('@@@')).toThrow());
});

// --- URL ---

describe('url', () => {
  const { encode, decode } = ENCODERS.url;
  it('encodes spaces and reserved chars', () =>
    expect(encode('hello world & a=1')).toBe('hello%20world%20%26%20a%3D1'));
  it('round-trips', () => expect(decode(encode('a/b?c=d&e=f'))).toBe('a/b?c=d&e=f'));
  it('handles empty string', () => expect(encode('')).toBe(''));
  it('handles UTF-8', () => expect(decode(encode('café ☕'))).toBe('café ☕'));
});

// --- Hex ---

describe('hex', () => {
  const { encode, decode } = ENCODERS.hex;
  it('encodes ASCII to space-separated hex pairs', () =>
    expect(encode('Hello')).toBe('48 65 6c 6c 6f'));
  it('encodes empty string to empty', () => expect(encode('')).toBe(''));
  it('decodes space-separated hex pairs', () =>
    expect(decode('48 65 6c 6c 6f')).toBe('Hello'));
  it('decodes hex without spaces', () =>
    expect(decode('48656c6c6f')).toBe('Hello'));
  it('decodes with 0x prefixes stripped', () =>
    expect(decode('0x48 0x65 0x6c 0x6c 0x6f')).toBe('Hello'));
  it('is case-insensitive on decode', () =>
    expect(decode('48 65 6C 6C 6F')).toBe('Hello'));
  it('round-trips ASCII', () => expect(decode(encode('Hello, World!'))).toBe('Hello, World!'));
  it('round-trips UTF-8', () => expect(decode(encode('café ☕'))).toBe('café ☕'));
  it('throws on odd number of nibbles', () =>
    expect(() => decode('abc')).toThrow());
});

// --- HTML entities ---

describe('rot13', () => {
  it('rotates letters 13 places preserving case', () =>
    expect(runEncoding('rot13', 'encode', 'Hello, World!').output).toBe('Uryyb, Jbeyq!'));
  it('is its own inverse', () => {
    const once = runEncoding('rot13', 'encode', 'Attack at dawn 07:00!').output;
    expect(runEncoding('rot13', 'decode', once).output).toBe('Attack at dawn 07:00!');
  });
  it('leaves digits, punctuation, and non-Latin text untouched', () =>
    expect(runEncoding('rot13', 'encode', '123 \u00e9\u00fc\u4e2d!').output).toBe('123 \u00e9\u00fc\u4e2d!'));
});

describe('json-escape', () => {
  it('escapes quotes, backslashes, and control characters without outer quotes', () => {
    expect(runEncoding('json-escape', 'encode', 'He said "hi"\n').output).toBe('He said \\"hi\\"\\n');
    expect(runEncoding('json-escape', 'encode', 'C:\\temp\tok').output).toBe('C:\\\\temp\\tok');
  });
  it('escapes U+2028/U+2029 for JS-safe inlining', () => {
    expect(runEncoding('json-escape', 'encode', 'a\u2028b\u2029c').output).toBe('a\\u2028b\\u2029c');
  });
  it('unescapes a string body and tolerates outer quotes', () => {
    expect(runEncoding('json-escape', 'decode', 'a\\"b\\nc').output).toBe('a"b\nc');
    expect(runEncoding('json-escape', 'decode', '"a\\u0041"').output).toBe('aA');
  });
  it('round-trips arbitrary text', () => {
    const original = 'multi\nline "text" with\tunicode: caf\u00e9 \u2028 done';
    const escaped = runEncoding('json-escape', 'encode', original).output;
    expect(runEncoding('json-escape', 'decode', escaped).output).toBe(original);
  });
  it('captures an invalid escape as a result error', () => {
    const r = runEncoding('json-escape', 'decode', 'bad \\x escape');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/decode/i);
  });
});

describe('html-entity', () => {
  const { encode, decode } = ENCODERS['html-entity'];
  it('encodes the five significant characters', () =>
    expect(encode(`<div class="x">Tom & 'Jerry'</div>`)).toBe(
      '&lt;div class=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/div&gt;',
    ));
  it('encodes ampersand first (no double-encoding)', () =>
    expect(encode('a & b')).toBe('a &amp; b'));
  it('round-trips', () => {
    const src = `<a href="?x=1&y=2">it's</a>`;
    expect(decode(encode(src))).toBe(src);
  });
  it('decodes named entities including apos', () =>
    expect(decode('&lt;b&gt;&amp;&apos;&quot;')).toBe(`<b>&'"`));
  it('decodes common typographic named entities', () =>
    expect(decode('&copy; 2026 &mdash; caf&eacute;? &hellip; &laquo;ok&raquo;'))
      .toBe('© 2026 — caf&eacute;? … «ok»'));
  it('decodes &nbsp; to a non-breaking space', () =>
    expect(decode('a&nbsp;b')).toBe('a b'));
  it('decodes decimal numeric references', () => expect(decode('&#65;&#66;')).toBe('AB'));
  it('decodes hex numeric references', () => expect(decode('&#x41;&#X42;')).toBe('AB'));
  it('leaves unknown entities untouched', () => expect(decode('&nope;')).toBe('&nope;'));
  it('leaves out-of-range numeric references untouched', () =>
    expect(decode('&#xFFFFFFFF;')).toBe('&#xFFFFFFFF;'));
  it('handles empty string', () => expect(encode('')).toBe(''));
});

// --- Detection (confidence) ---

describe('detectEncoding', () => {
  it('detects Base64 with high confidence when padded', () => {
    const d = detectEncoding('base64', 'SGVsbG8=');
    expect(d.mode).toBe('decode');
    expect(d.confidence).toBe('high');
    expect(d.label).toBe('Base64');
  });
  it('detects plain text as encode', () => {
    expect(detectEncoding('base64', 'Hello there!').mode).toBe('encode');
  });
  it('detects percent-encoding for url', () => {
    const d = detectEncoding('url', 'hello%20world');
    expect(d.mode).toBe('decode');
    expect(d.confidence).toBe('high');
  });
  it('detects HTML entities', () => {
    expect(detectEncoding('html-entity', 'a &amp; b').mode).toBe('decode');
  });
  it('detects spaced hex bytes with high confidence', () => {
    const d = detectEncoding('hex', '48 65 6c 6c 6f');
    expect(d.mode).toBe('decode');
    expect(d.confidence).toBe('high');
  });
  it('returns a safe default for an unknown id', () => {
    expect(detectEncoding('nope', 'x')).toEqual({ mode: 'encode', confidence: 'low' });
  });
  it('returns encode for empty input', () => {
    expect(detectEncoding('base64', '').mode).toBe('encode');
  });
});

// --- Validation (severity + position) ---

describe('validateEncoding', () => {
  it('passes valid Base64 on decode', () => {
    expect(validateEncoding('base64', 'decode', 'SGVsbG8=').ok).toBe(true);
  });
  it('flags a bad Base64 character with a position', () => {
    const v = validateEncoding('base64', 'decode', 'SGV*bG8=');
    expect(v.ok).toBe(false);
    expect(v.severity).toBe('error');
    expect(v.position).toBe(3);
    expect(v.message).toMatch(/Base64 alphabet/i);
  });
  it('warns when Base64 length is not a multiple of 4', () => {
    const v = validateEncoding('base64', 'decode', 'SGVsbG8');
    expect(v.ok).toBe(false);
    expect(v.severity).toBe('warning');
  });
  it('flags malformed percent-encoding with a position', () => {
    const v = validateEncoding('url', 'decode', 'a%2gb');
    expect(v.ok).toBe(false);
    expect(v.position).toBe(1);
    expect(v.message).toMatch(/percent/i);
  });
  it('flags an odd number of hex digits', () => {
    const v = validateEncoding('hex', 'decode', '4 8 6');
    expect(v.ok).toBe(false);
    expect(v.message).toMatch(/even number/i);
  });
  it('flags a non-hex character with a position', () => {
    const v = validateEncoding('hex', 'decode', '48 6z');
    expect(v.ok).toBe(false);
    expect(v.severity).toBe('error');
  });
  it('treats encode direction as always ok', () => {
    expect(validateEncoding('base64', 'encode', 'anything *!*').ok).toBe(true);
  });
  it('returns ok for an unknown id', () => {
    expect(validateEncoding('nope', 'decode', 'x').ok).toBe(true);
  });
});

// --- Metadata ---

describe('encodingMeta', () => {
  it('reports input bytes, base64 length and expansion', () => {
    const rows = encodingMeta('base64', 'Hi', 'SGk=', 'encode');
    const byLabel = Object.fromEntries(rows.map(r => [r.label, r.value]));
    expect(byLabel['Input bytes']).toBe('2');
    expect(byLabel['Base64 length']).toBe('4');
    expect(byLabel['Expansion']).toBe('2.00×');
  });
  it('reports byte count for hex', () => {
    const rows = encodingMeta('hex', 'Hello', '48 65 6c 6c 6f', 'encode');
    const byLabel = Object.fromEntries(rows.map(r => [r.label, r.value]));
    expect(byLabel['Bytes']).toBe('5 bytes');
  });
  it('returns [] for an unknown id', () => {
    expect(encodingMeta('nope', 'a', 'b', 'encode')).toEqual([]);
  });
});

// --- Static info ---

describe('encodingInfo', () => {
  it('exposes displayName, reversible and modes', () => {
    const info = encodingInfo('base64');
    expect(info.displayName).toBe('Base64');
    expect(info.reversible).toBe(true);
    expect(info.modes.forward).toBe('encode');
    expect(info.modes.inverse).toBe('decode');
    expect(info.sample).toBeTruthy();
    expect(info.technical && info.technical.length).toBeGreaterThan(0);
  });
  it('falls back gracefully for an unknown id', () => {
    const info = encodingInfo('nope');
    expect(info.displayName).toBe('nope');
    expect(info.reversible).toBe(true);
  });
});
