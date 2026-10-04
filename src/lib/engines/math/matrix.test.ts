import { describe, expect, it } from 'vitest';
import { runMath } from './registry';
import { determinant, fmt, inverse, tidy } from './calculators/matrix';

const SCALED_SINGULAR = [
  [100000, 200000, 300000],
  [400000, 500000, 600000],
  [700000, 800000, 900000],
];

describe('matrix singularity', () => {
  it('calls a 1e5-scaled singular matrix singular in both Determinant and Inverse', () => {
    expect(determinant(SCALED_SINGULAR)).toBe(0);
    expect(inverse(SCALED_SINGULAR)).toBe('The determinant is 0, so this matrix has no inverse.');
  });

  it('keeps the determinant of diag(1e-9) at 1e-18 and inverts it to diag(1e9)', () => {
    const m = [[1e-9, 0], [0, 1e-9]];
    expect(determinant(m)).toBeCloseTo(1e-18, 30);
    expect(determinant(m)).not.toBe(0);
    expect(inverse(m)).toEqual([[1e9, 0], [0, 1e9]]);
  });

  it('shows 1e-18 in the 2 by 2 worked step, not 0', () => {
    const r = runMath('matrix', { operation: 'determinant', a: '1e-9 0\n0 1e-9' });
    expect(r.ok).toBe(true);
    expect(r.hero?.value).toBe('1e-18');
    expect(r.explanation).toContain('= 1e-18.');
  });

  it('agrees on an ordinary invertible matrix', () => {
    expect(determinant([[1, 2], [3, 4]])).toBe(-2);
    expect(inverse([[1, 2], [3, 4]])).toEqual([[-2, 1], [1.5, -0.5]]);
  });
});

describe('matrix tidy', () => {
  it.each([
    [12345.0001, 12345.0001],
    [1000000.005, 1000000.005],
    [1234.00001, 1234.00001],
    [1e-13, 1e-13],
    [1e297, 1e297],
    [0.1 + 0.2, 0.3],
    [0.9999999999999998, 1],
  ])('tidy(%s) is %s', (input, expected) => {
    expect(tidy(input)).toBe(expected);
  });

  it('gives 1/3 and 2/3 the same precision', () => {
    expect(fmt(1 / 3)).toBe('0.333333333333');
    expect(fmt(2 / 3)).toBe('0.666666666667');
  });

  it('adds 12345.0001 and 0 without rounding the result', () => {
    const r = runMath('matrix', { operation: 'add', a: '12345.0001', b: '0' });
    expect(r.hero?.value).toBe('12345.0001');
  });

  it('snaps cancellation noise to 0 only next to the numbers it came from', () => {
    expect(tidy(5.551115123125783e-17, 1)).toBe(0);
    expect(tidy(1e-13)).toBe(1e-13);
  });
});
