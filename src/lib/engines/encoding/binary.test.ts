import { describe, it, expect } from 'vitest';
import { binary } from './binary';

describe('binary encoder', () => {
  it('encodes ASCII to space-separated 8-bit groups', () => {
    expect(binary.encode('Hi')).toBe('01001000 01101001');
  });

  it('encodes multi-byte UTF-8 per byte', () => {
    // "é" is two UTF-8 bytes (0xC3 0xA9)
    expect(binary.encode('é')).toBe('11000011 10101001');
  });

  it('round-trips arbitrary text', () => {
    const samples = ['Hello, World!', 'café ☕', '0101 is text too', ''];
    for (const s of samples) expect(binary.decode(binary.encode(s))).toBe(s);
  });

  it('decodes tolerantly, ignoring non-bit characters', () => {
    expect(binary.decode('01001000\n01101001')).toBe('Hi');
    expect(binary.decode('0100-1000 0110.1001')).toBe('Hi');
  });

  it('decodes empty input to empty string', () => {
    expect(binary.decode('   ')).toBe('');
  });

  it('throws on a bit count that is not a multiple of 8', () => {
    expect(() => binary.decode('0100100')).toThrow(/multiple of 8/);
  });

  describe('detect', () => {
    it('flags grouped binary as a high-confidence decode', () => {
      expect(binary.detect!('01001000 01101001')).toEqual({ mode: 'decode', confidence: 'high', label: 'Binary' });
    });
    it('flags ungrouped binary as medium-confidence decode', () => {
      expect(binary.detect!('0100100001101001').mode).toBe('decode');
    });
    it('treats prose as a low-confidence encode', () => {
      expect(binary.detect!('hello world').confidence).toBe('low');
    });
  });

  describe('validate', () => {
    it('passes on encode and on empty', () => {
      expect(binary.validate!('anything', 'encode').ok).toBe(true);
      expect(binary.validate!('', 'decode').ok).toBe(true);
    });
    it('rejects non-binary characters with a position', () => {
      const r = binary.validate!('0101 2000', 'decode');
      expect(r.ok).toBe(false);
      expect(r.position).toBeGreaterThanOrEqual(0);
    });
    it('rejects a bit count that is not a multiple of 8', () => {
      expect(binary.validate!('0100100', 'decode').ok).toBe(false);
    });
  });

  describe('meta', () => {
    it('reports bytes and bits for encode', () => {
      const rows = binary.meta!('Hi', '01001000 01101001', 'encode');
      expect(rows.find(r => r.label === 'Bits')?.value).toBe('16');
      expect(rows.find(r => r.label === 'Bytes')?.value).toContain('2');
    });
    it('reports for decode direction', () => {
      const rows = binary.meta!('01001000 01101001', 'Hi', 'decode');
      expect(rows.find(r => r.label === 'Bits')?.value).toBe('16');
    });
  });
});
