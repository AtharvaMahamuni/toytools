import { describe, expect, it } from 'vitest';
import { OPERATORS, factorial } from './operators';
import { FUNCTIONS } from './functions';
import { CONSTANTS } from './constants';
import type { EvalContext } from './types';

const rad: EvalContext = { angleMode: 'rad', ans: 0 };
const deg: EvalContext = { angleMode: 'deg', ans: 0 };

describe('operators registry', () => {
  it('applies each operator', () => {
    expect(OPERATORS['+'].apply(2, 3)).toBe(5);
    expect(OPERATORS['-'].apply(2, 3)).toBe(-1);
    expect(OPERATORS['*'].apply(2, 3)).toBe(6);
    expect(OPERATORS['/'].apply(6, 3)).toBe(2);
    expect(OPERATORS['%'].apply(7, 3)).toBe(1);
    expect(OPERATORS['^'].apply(2, 10)).toBe(1024);
    expect(OPERATORS['u-'].apply(5)).toBe(-5);
    expect(OPERATORS['u+'].apply(5)).toBe(5);
    expect(OPERATORS['!'].apply(5)).toBe(120);
  });
});

describe('factorial', () => {
  it('computes small factorials and 0!', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(6)).toBe(720);
  });
  it('returns NaN for negatives and non-integers', () => {
    expect(Number.isNaN(factorial(-1))).toBe(true);
    expect(Number.isNaN(factorial(2.5))).toBe(true);
  });
  it('overflows to Infinity past 170!', () => {
    expect(factorial(171)).toBe(Infinity);
  });
});

describe('functions registry — angle modes', () => {
  it('converts degrees on the way in and radians on the way out', () => {
    expect(FUNCTIONS.sin.apply([30], deg)).toBeCloseTo(0.5, 12);
    expect(FUNCTIONS.sin.apply([Math.PI / 6], rad)).toBeCloseTo(0.5, 12);
    expect(FUNCTIONS.atan.apply([1], deg)).toBeCloseTo(45, 10);
    expect(FUNCTIONS.atan.apply([1], rad)).toBeCloseTo(Math.PI / 4, 12);
    expect(FUNCTIONS.asin.apply([0.5], rad)).toBeCloseTo(Math.PI / 6, 12);
  });
});

describe('constants registry', () => {
  it('resolves each constant, including the π alias and ans', () => {
    expect(CONSTANTS.pi(rad)).toBeCloseTo(Math.PI, 12);
    expect(CONSTANTS['π'](rad)).toBeCloseTo(Math.PI, 12);
    expect(CONSTANTS.e(rad)).toBeCloseTo(Math.E, 12);
    expect(CONSTANTS.tau(rad)).toBeCloseTo(2 * Math.PI, 12);
    expect(CONSTANTS.ans({ angleMode: 'rad', ans: 99 })).toBe(99);
  });
});
