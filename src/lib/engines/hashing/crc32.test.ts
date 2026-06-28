import { describe, it, expect } from 'vitest';
import { crc32, crc32hex } from './crc32';

describe('crc32', () => {
  it('matches the standard check value for "123456789"', () => {
    // The canonical CRC-32/ISO-HDLC check value is 0xCBF43926.
    expect(crc32hex('123456789')).toBe('cbf43926');
  });

  it('matches the well-known fox vector', () => {
    expect(crc32hex('The quick brown fox jumps over the lazy dog')).toBe('414fa339');
  });

  it('returns all zeros for empty input', () => {
    expect(crc32hex('')).toBe('00000000');
  });

  it('always produces eight lowercase hex digits', () => {
    for (const s of ['a', 'Hello', 'é', '☕', 'a'.repeat(1000)]) {
      expect(crc32hex(s)).toMatch(/^[0-9a-f]{8}$/);
    }
  });

  it('is deterministic and sensitive to small changes', () => {
    expect(crc32hex('hello')).toBe(crc32hex('hello'));
    expect(crc32hex('hello')).not.toBe(crc32hex('hellp'));
  });

  it('exposes the HashTool contract', () => {
    expect(crc32.id).toBe('crc32');
    expect(crc32.family).toBe('checksum');
    expect(crc32.bits).toBe(32);
    expect(crc32.hash('abc')).toBe(crc32hex('abc'));
  });
});
