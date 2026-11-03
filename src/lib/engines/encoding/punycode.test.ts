import { describe, it, expect } from 'vitest';
import { punycode } from './punycode';

describe('punycode encoder', () => {
  // Well-known IDN vectors.
  const cases: [string, string][] = [
    ['münchen.de', 'xn--mnchen-3ya.de'],
    ['bücher.de', 'xn--bcher-kva.de'],
    ['example.com', 'example.com'],          // pure ASCII passes through
    ['☃.net', 'xn--n3h.net'],                // snowman
  ];

  it.each(cases)('encodes %s → %s', (unicode, ascii) => {
    expect(punycode.encode(unicode)).toBe(ascii);
  });

  it.each(cases)('decodes %s ← (round-trip)', (unicode, ascii) => {
    expect(punycode.decode(ascii)).toBe(unicode);
  });

  it('round-trips a multi-label international domain', () => {
    const d = 'i❤.例え.テスト';
    expect(punycode.decode(punycode.encode(d))).toBe(d);
  });

  it('leaves an all-ASCII domain unchanged in both directions', () => {
    expect(punycode.encode('a.b.c')).toBe('a.b.c');
    expect(punycode.decode('a.b.c')).toBe('a.b.c');
  });

  it('handles astral characters (emoji) via surrogate pairs', () => {
    const s = '😀';
    expect(punycode.decode(punycode.encode(s + '.test'))).toBe(s + '.test');
  });

  describe('detect', () => {
    it('flags xn-- domains as decode', () => {
      expect(punycode.detect!('xn--mnchen-3ya.de')).toMatchObject({ mode: 'decode', confidence: 'high' });
    });
    it('flags unicode domains as encode', () => {
      expect(punycode.detect!('münchen.de')).toMatchObject({ mode: 'encode', confidence: 'high' });
    });
    it('treats plain ASCII as low-confidence encode', () => {
      expect(punycode.detect!('example.com').confidence).toBe('low');
    });
  });

  it('throws on an invalid punycode digit (caught by the engine resolver)', () => {
    // '{' is outside the basic-digit alphabet → invalid input.
    expect(() => punycode.decode('xn--abc{')).toThrow();
  });
});

// Regression (#291 shipped this): "well-known" is not punycode. The xn-- fix corrupted it and the
// status said Valid.
describe('punycode prefix fix only for real punycode', () => {
  it('does not offer xn-- for an ordinary hyphenated word', () => {
    expect(punycode.recover!('well-known', 'decode')).toBeNull();
    expect(punycode.recover!('self-service', 'decode')).toBeNull();
  });

  it('offers xn-- for a label that decodes to a real name', () => {
    expect(punycode.recover!('mnchen-3ya', 'decode')).toEqual({ label: 'Add xn-- prefix and decode', text: 'xn--mnchen-3ya' });
  });

  it('never reports a corrupted decode as valid', () => {
    expect(punycode.validate!('xn--well-known', 'decode').ok).toBe(false);
    expect(punycode.validate!('xn--mnchen-3ya.de', 'decode').ok).toBe(true);
    expect(punycode.validate!('xn--bcher-kva.example', 'decode').ok).toBe(true);
  });
});
