// Unit tests for the math engine's pure arithmetic core: fraction parsing/arithmetic,
// BigInt combinatorics, and prime factorization.

import { describe, expect, it } from 'vitest';
import {
  approxBigInt,
  bgcd,
  blcm,
  divFractions,
  divisorCount,
  factorialBig,
  formatBigInt,
  formatFactorization,
  formatFraction,
  formatMixed,
  fractionToDecimal,
  gcdInt,
  isPrime,
  lcmInt,
  mulFractions,
  nCr,
  nCrWithRepetition,
  nPr,
  nPrWithRepetition,
  parseFraction,
  primeFactorize,
  simplify,
  addFractions,
  subFractions,
  MAX_COMBINATORICS_N,
  MAX_FACTOR_INPUT,
} from './models';

describe('fractions', () => {
  it('parses integers, fractions, and mixed numbers', () => {
    expect(parseFraction('7')).toEqual({ n: 7n, d: 1n });
    expect(parseFraction('-7')).toEqual({ n: -7n, d: 1n });
    expect(parseFraction('3/4')).toEqual({ n: 3n, d: 4n });
    expect(parseFraction(' -3/4 ')).toEqual({ n: -3n, d: 4n });
    expect(parseFraction('1 2/3')).toEqual({ n: 5n, d: 3n });
    expect(parseFraction('-1 2/3')).toEqual({ n: -5n, d: 3n });
  });

  it('rejects malformed or out-of-range input', () => {
    for (const bad of ['', 'abc', '1/0', '1 2', '1.5', '2/3/4', '--3', '1/-4', '2000000000']) {
      expect(parseFraction(bad), bad).toBeNull();
    }
  });

  it('does exact arithmetic and simplifies', () => {
    const half = parseFraction('1/2')!;
    const threeQ = parseFraction('3/4')!;
    expect(simplify(addFractions(half, threeQ))).toEqual({ n: 5n, d: 4n });
    expect(simplify(subFractions(half, threeQ))).toEqual({ n: -1n, d: 4n });
    expect(simplify(mulFractions(half, threeQ))).toEqual({ n: 3n, d: 8n });
    expect(simplify(divFractions(threeQ, parseFraction('1/8')!)!)).toEqual({ n: 6n, d: 1n });
    expect(divFractions(half, parseFraction('0')!)).toBeNull();
  });

  it('formats fractions, mixed numbers, and decimals', () => {
    expect(formatFraction({ n: 5n, d: 4n })).toBe('5/4');
    expect(formatMixed({ n: 5n, d: 4n })).toBe('1 1/4');
    expect(formatMixed({ n: -5n, d: 3n })).toBe('-1 2/3');
    expect(formatMixed({ n: 6n, d: 2n })).toBe('3');
    expect(formatMixed({ n: 3n, d: 4n })).toBe('3/4');
    expect(fractionToDecimal({ n: 5n, d: 4n })).toBeCloseTo(1.25, 12);
  });

  it('gcd/lcm on bigints', () => {
    expect(bgcd(12n, 18n)).toBe(6n);
    expect(bgcd(-12n, 18n)).toBe(6n);
    expect(blcm(4n, 6n)).toBe(12n);
  });
});

describe('combinatorics', () => {
  it('computes factorials, nCr, and nPr exactly', () => {
    expect(factorialBig(0)).toBe(1n);
    expect(factorialBig(5)).toBe(120n);
    expect(nCr(5, 2)).toBe(10n);
    expect(nCr(52, 5)).toBe(2598960n);
    expect(nPr(5, 2)).toBe(20n);
    expect(nPr(60, 3)).toBe(205320n);
    expect(nCr(10, 0)).toBe(1n);
    expect(nCr(10, 10)).toBe(1n);
  });

  it('handles repetition variants', () => {
    expect(nCrWithRepetition(4, 3)).toBe(20n); // C(6, 3)
    expect(nPrWithRepetition(10, 4)).toBe(10000n);
    expect(nPrWithRepetition(0, 0)).toBe(1n);
    expect(nPrWithRepetition(0, 2)).toBeNull();
  });

  it('rejects out-of-range arguments', () => {
    expect(nCr(5, 6)).toBeNull();
    expect(nCr(-1, 0)).toBeNull();
    expect(nCr(MAX_COMBINATORICS_N + 1, 1)).toBeNull();
    expect(factorialBig(2.5)).toBeNull();
  });

  it('formats big integers with grouping and scientific approximation', () => {
    expect(formatBigInt(2598960n)).toBe('2,598,960');
    expect(formatBigInt(-1234n)).toBe('-1,234');
    expect(approxBigInt(1234n)).toBeNull();
    expect(approxBigInt(factorialBig(100)!)).toMatch(/^9\.33 × 10\^157$/);
  });
});

describe('primes', () => {
  it('factorizes with exponents', () => {
    expect(primeFactorize(360)).toEqual([
      { prime: 2, exp: 3 },
      { prime: 3, exp: 2 },
      { prime: 5, exp: 1 },
    ]);
    expect(formatFactorization(primeFactorize(360)!)).toBe('2³ × 3² × 5');
    expect(primeFactorize(97)).toEqual([{ prime: 97, exp: 1 }]);
    // A large semiprime near the cap exercises the wheel's tail.
    expect(primeFactorize(999999999989)).toEqual([{ prime: 999999999989, exp: 1 }]);
  });

  it('rejects out-of-range input', () => {
    expect(primeFactorize(1)).toBeNull();
    expect(primeFactorize(0)).toBeNull();
    expect(primeFactorize(2.5)).toBeNull();
    expect(primeFactorize(MAX_FACTOR_INPUT + 1)).toBeNull();
  });

  it('answers isPrime, divisor count, gcd, and lcm', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(91)).toBe(false); // 7 × 13
    expect(divisorCount(primeFactorize(360)!)).toBe(24);
    expect(gcdInt(36, 60)).toBe(12);
    expect(lcmInt(36, 60)).toBe(180n);
    expect(lcmInt(1_000_000_007, 998_244_353)).toBe(998244353n * 1000000007n);
  });
});
