import { describe, expect, it } from 'vitest';
import { evaluate } from './evaluate';
import type { AngleMode } from './types';

/** Evaluate and return the numeric value, failing the test if the engine reported an error. */
function ev(expr: string, opts?: { angleMode?: AngleMode; ans?: number }): number {
  const r = evaluate(expr, opts);
  if (!r.ok) throw new Error(`unexpected error for "${expr}": ${r.error}`);
  return r.value;
}

/** Assert the engine reports an error (never throws). */
function errOf(expr: string): string {
  const r = evaluate(expr, { angleMode: 'deg' });
  expect(r.ok, `expected "${expr}" to error`).toBe(false);
  return r.ok ? '' : r.error;
}

describe('arithmetic & precedence', () => {
  it('applies multiplication before addition', () => {
    expect(ev('2+3*4')).toBe(14);
    expect(ev('(2+3)*4')).toBe(20);
  });
  it('is left-associative for + - * /', () => {
    expect(ev('2-3-4')).toBe(-5);
    expect(ev('100/2/5')).toBe(10);
  });
  it('makes ^ right-associative', () => {
    expect(ev('2^3^2')).toBe(512); // 2^(3^2) = 2^9
    expect(ev('4^0.5')).toBe(2);
  });
  it('supports modulo at multiply precedence', () => {
    expect(ev('10%3')).toBe(1);
    expect(ev('2+10%3')).toBe(3);
  });
  it('handles decimals and scientific notation', () => {
    expect(ev('.5+.5')).toBe(1);
    expect(ev('1.5e3')).toBe(1500);
    expect(ev('2e-2')).toBeCloseTo(0.02, 10);
  });
});

describe('unary operators', () => {
  it('negates and keeps ^ tighter than unary minus', () => {
    expect(ev('-5')).toBe(-5);
    expect(ev('-2^2')).toBe(-4); // -(2^2)
    expect(ev('2^-2')).toBe(0.25);
    expect(ev('3*-2')).toBe(-6);
    expect(ev('-(2+3)')).toBe(-5);
    expect(ev('--5')).toBe(5);
    expect(ev('+-3')).toBe(-3);
  });
});

describe('factorial', () => {
  it('computes and binds tighter than ^ and unary minus', () => {
    expect(ev('5!')).toBe(120);
    expect(ev('0!')).toBe(1);
    expect(ev('3!+1')).toBe(7);
    expect(ev('-3!')).toBe(-6); // -(3!)
    expect(ev('2^3!')).toBe(64); // 2^(3!)
  });
  it('rejects negative and non-integer factorials', () => {
    expect(errOf('(-1)!')).toMatch(/undefined/i);
    expect(errOf('2.5!')).toMatch(/undefined/i);
  });
});

describe('constants & ans', () => {
  it('resolves pi, e, tau, and aliases', () => {
    expect(ev('pi')).toBeCloseTo(Math.PI, 12);
    expect(ev('π')).toBeCloseTo(Math.PI, 12);
    expect(ev('e')).toBeCloseTo(Math.E, 12);
    expect(ev('tau')).toBeCloseTo(2 * Math.PI, 12);
  });
  it('injects the previous answer via ans', () => {
    expect(ev('ans+1', { ans: 42 })).toBe(43);
    expect(ev('ans', { ans: -7 })).toBe(-7);
  });
});

describe('implicit multiplication', () => {
  it('multiplies adjacent values and groups', () => {
    expect(ev('2pi')).toBeCloseTo(2 * Math.PI, 12);
    expect(ev('2(3)')).toBe(6);
    expect(ev('(1+2)(3+4)')).toBe(21);
    expect(ev('(1+2)3')).toBe(9);
    expect(ev('2sqrt(4)')).toBe(4);
  });
  it('treats two bare numbers as an error, not a product', () => {
    expect(errOf('2 3')).toBeTruthy();
  });
});

describe('functions (radians)', () => {
  const rad = { angleMode: 'rad' as const };
  it('evaluates core functions', () => {
    expect(ev('sin(0)', rad)).toBeCloseTo(0, 12);
    expect(ev('cos(0)', rad)).toBeCloseTo(1, 12);
    expect(ev('sqrt(2)', rad)).toBeCloseTo(Math.SQRT2, 12);
    expect(ev('cbrt(27)', rad)).toBeCloseTo(3, 12);
    expect(ev('ln(e)', rad)).toBeCloseTo(1, 12);
    expect(ev('log(1000)', rad)).toBeCloseTo(3, 12);
    expect(ev('abs(-5)', rad)).toBe(5);
    expect(ev('exp(0)', rad)).toBe(1);
    expect(ev('floor(2.7)', rad)).toBe(2);
    expect(ev('ceil(2.1)', rad)).toBe(3);
    expect(ev('round(2.5)', rad)).toBe(3);
    expect(ev('pow(2,10)', rad)).toBe(1024);
  });
});

describe('functions (degrees)', () => {
  const deg = { angleMode: 'deg' as const };
  it('respects degree mode for trig and inverse trig', () => {
    expect(ev('sin(30)', deg)).toBeCloseTo(0.5, 12);
    expect(ev('cos(60)', deg)).toBeCloseTo(0.5, 12);
    expect(ev('tan(45)', deg)).toBeCloseTo(1, 12);
    expect(ev('asin(0.5)', deg)).toBeCloseTo(30, 10);
    expect(ev('acos(0.5)', deg)).toBeCloseTo(60, 10);
    expect(ev('atan(1)', deg)).toBeCloseTo(45, 10);
  });
});

describe('error handling (never throws)', () => {
  it('reports syntax and domain problems as messages', () => {
    expect(errOf('2+')).toBeTruthy();
    expect(errOf('(2+3')).toMatch(/parenthesis/i);
    expect(errOf('2+3)')).toMatch(/parenthesis/i);
    expect(errOf('')).toMatch(/empty/i);
    expect(errOf('sin')).toMatch(/parenthes/i);
    expect(errOf('sin(1,2)')).toMatch(/argument/i);
    expect(errOf('pow(2)')).toMatch(/argument/i);
    expect(errOf('1/0')).toMatch(/divide|large/i);
    expect(errOf('sqrt(-1)')).toMatch(/undefined/i);
    expect(errOf('log(-5)')).toMatch(/undefined/i);
    expect(errOf('abc')).toMatch(/unknown/i);
    expect(errOf(',5')).toMatch(/comma/i);
    expect(errOf('@')).toMatch(/unexpected/i);
  });
});
