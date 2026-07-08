import { describe, expect, it } from 'vitest';
import { formatResult } from './format';

describe('formatResult', () => {
  it('handles zero and non-finite values', () => {
    expect(formatResult(0)).toBe('0');
    expect(formatResult(Number.NaN)).toBe('undefined');
    expect(formatResult(Infinity)).toBe('∞');
    expect(formatResult(-Infinity)).toBe('-∞');
  });

  it('trims floating-point noise', () => {
    expect(formatResult(0.1 + 0.2)).toBe('0.3');
    expect(formatResult(1 / 3)).toBe('0.333333333333'); // 12 significant digits
    expect(formatResult(Math.SQRT2)).toBe('1.41421356237');
  });

  it('keeps plain decimals and integers', () => {
    expect(formatResult(2)).toBe('2');
    expect(formatResult(-5.5)).toBe('-5.5');
    expect(formatResult(1000000000)).toBe('1000000000');
  });

  it('uses scientific notation for very large magnitudes', () => {
    expect(formatResult(1e15)).toBe('1e15');
    expect(formatResult(1.23e20)).toBe('1.23e20');
  });

  it('uses scientific notation for very small magnitudes', () => {
    expect(formatResult(1e-10)).toBe('1e-10');
    expect(formatResult(5e-10)).toBe('5e-10');
  });

  it('respects a custom significant-digit budget', () => {
    expect(formatResult(1 / 3, { maxSignificant: 4 })).toBe('0.3333');
  });
});
