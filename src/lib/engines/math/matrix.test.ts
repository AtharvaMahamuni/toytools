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

  it('keeps a huge determinant when the size of its rows overflows (fix round 1)', () => {
    // The product of the row sizes, 1e160 * 1, is fine here, but (max entry)^n = 1e320 is not:
    // an Infinity snap scale used to tidy every determinant to 0 and refuse the inverse.
    const m = [[1e160, 0], [0, 1]];
    expect(determinant(m)).toBe(1e160);
    expect(inverse(m)).toEqual([[1e-160, 0], [0, 1]]);
    const big = [[1e110, 0, 0], [0, 1e110, 0], [0, 0, 1]];
    expect(determinant(big)).toBe(1e220);
    expect(Array.isArray(inverse(big))).toBe(true);
  });

  it('judges each pivot against its own row, so a scaled diagonal stays invertible', () => {
    // diag(1, 1e-15) is diag(1e15, 1) divided by 1e15. Both are invertible.
    expect(determinant([[1, 0], [0, 1e-15]])).toBe(1e-15);
    expect(inverse([[1, 0], [0, 1e-15]])).toEqual([[1, 0], [0, 1e15]]);
    expect(determinant([[1e15, 0], [0, 1]])).toBe(1e15);
  });

  it('prints a true step when rounding-sized ad - bc is treated as singular', () => {
    const r = runMath('matrix', { operation: 'determinant', a: '1 2\n2 4.000000000000001' });
    expect(r.ok).toBe(true);
    expect(r.hero?.value).toBe('0');
    expect(r.explanation).not.toContain('= 0.');
    expect(r.explanation).toContain('≈ 0');
    expect(r.explanation).toContain('treated as singular');
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
