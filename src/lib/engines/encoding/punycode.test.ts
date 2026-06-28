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
