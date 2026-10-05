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

  // Fix round 2: round 1 snapped det to 0 against the product of the row sizes, which erased the
  // real determinants of these well-conditioned (or merely ill-scaled) invertible matrices.
  const pascal = (n: number) =>
    Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        let c = 1;
        for (let k = 0; k < j; k++) c = (c * (i + j - k)) / (k + 1);
        return c;
      }),
    );
  const hilbert = (n: number) =>
    Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => 1 / (i + j + 1)));

  it('gives Pascal 7 and Pascal 8 their determinant of 1, with an inverse', () => {
    expect(determinant(pascal(8))).toBe(1);
    expect(Array.isArray(inverse(pascal(8)))).toBe(true);
    expect(determinant(pascal(7))).toBe(1);
  });

  it('gives [[1, 1e12], [0, 1]] its determinant of 1, with an inverse', () => {
    expect(determinant([[1, 1e12], [0, 1]])).toBe(1);
    expect(Array.isArray(inverse([[1, 1e12], [0, 1]]))).toBe(true);
  });

  it('inverts Vandermonde 1..8 and gives its determinant 125411328000', () => {
    const vandermonde = Array.from({ length: 8 }, (_, i) => Array.from({ length: 8 }, (_, j) => (i + 1) ** j));
    expect(Array.isArray(inverse(vandermonde))).toBe(true);
    expect(determinant(vandermonde)).toBe(125411328000);
  });

  it('inverts Hilbert 6 and 7 and keeps their tiny determinants', () => {
    // Exact values: det(H6) = 1/186313420339200000, det(H7) = 1/2067909047925770649600000.
    expect(Array.isArray(inverse(hilbert(6)))).toBe(true);
    expect(Array.isArray(inverse(hilbert(7)))).toBe(true);
    expect(Math.abs((determinant(hilbert(6)) as number) * 186313420339200000 - 1)).toBeLessThan(1e-6);
    expect(Math.abs((determinant(hilbert(7)) as number) * 2067909047925770649600000 - 1)).toBeLessThan(1e-3);
  });

  it('still calls singular input singular after dropping the determinant snap', () => {
    const SINGULAR: number[][][] = [
      [[1, 2], [2, 4]],
      [[0.1, 0.2], [0.3, 0.6]],
      [[1, 2], [2, 4.000000000000001]],
      [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      SCALED_SINGULAR,
      [[1e5, 2e5], [3e5, 6e5]],
      [[1, 2, 3], [2, 4, 6], [1, 1, 1]],
      [[1e-10, 2e-10, 3e-10], [4, 5, 6], [7, 8, 9]],
      [[1e-5, 1], [1, 1e5]],
      [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6], [0.7, 0.8, 0.9]],
      [[1 / 3, 2 / 3], [1, 2]],
      [[1e-20, 2e-20], [1, 2]],
      [[1e-300, 2e-300], [1, 2]],
      [[0, 0], [1, 2]],
      [[0.1, 0.2, 0.3], [0.2, 0.4, 0.6], [0.3, 0.5, 0.7]],
      [[1e200, 2e200, 3e200], [4e200, 5e200, 6e200], [7e200, 8e200, 9e200]],
      [[1e-200, 1], [1, 1e200]],
    ];
    for (const m of SINGULAR) {
      expect(determinant(m)).toBe(0);
      expect(inverse(m)).toBe('The determinant is 0, so this matrix has no inverse.');
    }
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
