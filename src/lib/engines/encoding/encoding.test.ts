import { describe, it, expect } from 'vitest';
import { runEncoding, ENCODERS } from './registry';

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

// --- HTML entities ---

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
