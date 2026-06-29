import { describe, it, expect } from 'vitest';
import { parseHumanNumber } from './parse';
import { formatGrouped } from './format';
import { adaptiveStep } from './step';

describe('parseHumanNumber', () => {
  it('passes through plain numbers and numeric strings', () => {
    expect(parseHumanNumber(1234)).toBe(1234);
    expect(parseHumanNumber('1234')).toBe(1234);
    expect(parseHumanNumber('7.5')).toBe(7.5);
  });

  it('applies western magnitude suffixes', () => {
    expect(parseHumanNumber('10k')).toBe(10_000);
    expect(parseHumanNumber('250k')).toBe(250_000);
    expect(parseHumanNumber('5m')).toBe(5_000_000);
    expect(parseHumanNumber('2b')).toBe(2_000_000_000);
  });

  it('applies Indian magnitude words', () => {
    expect(parseHumanNumber('12 lakh')).toBe(1_200_000);
    expect(parseHumanNumber('2 crore')).toBe(20_000_000);
    expect(parseHumanNumber('1.5 cr')).toBe(15_000_000);
  });

  it('strips currency symbols, separators and a trailing percent', () => {
    expect(parseHumanNumber('₹25,000')).toBe(25_000);
    expect(parseHumanNumber('$1,234.50')).toBe(1234.5);
    expect(parseHumanNumber('7.5%')).toBe(7.5);
  });

  it('returns null for blanks, junk and unknown suffixes', () => {
    expect(parseHumanNumber('')).toBeNull();
    expect(parseHumanNumber('   ')).toBeNull();
    expect(parseHumanNumber('abc')).toBeNull();
    expect(parseHumanNumber('10 widgets')).toBeNull();
    expect(parseHumanNumber(Infinity)).toBeNull();
    expect(parseHumanNumber(undefined)).toBeNull();
  });
});

describe('formatGrouped', () => {
  it('groups Western by default', () => {
    expect(formatGrouped(1250000)).toBe('1,250,000');
  });

  it('groups Indian (lakh/crore) when asked', () => {
    expect(formatGrouped(1250000, { grouping: 'indian' })).toBe('12,50,000');
  });

  it('formats currency with a configurable code', () => {
    expect(formatGrouped(1234.5, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })).toBe('$1,234.50');
  });

  it('scales percent inputs (5 -> 5%)', () => {
    expect(formatGrouped(5, { style: 'percent', maximumFractionDigits: 0 })).toBe('5%');
  });

  it('supports compact notation', () => {
    expect(formatGrouped(1250000, { compact: true, maximumFractionDigits: 2 })).toBe('1.25M');
  });

  it('never throws on non-finite input', () => {
    expect(formatGrouped(Infinity)).toBe('0');
  });
});

describe('adaptiveStep', () => {
  it('scales with magnitude', () => {
    expect(adaptiveStep(50)).toBe(10);
    expect(adaptiveStep(500)).toBe(50);
    expect(adaptiveStep(5_000)).toBe(100);
    expect(adaptiveStep(50_000)).toBe(500);
    expect(adaptiveStep(500_000)).toBe(1_000);
    expect(adaptiveStep(5_000_000)).toBe(10_000);
    expect(adaptiveStep(50_000_000)).toBe(100_000);
    expect(adaptiveStep(500_000_000)).toBe(1_000_000);
  });

  it('handles zero and negatives', () => {
    expect(adaptiveStep(0)).toBe(10);
    expect(adaptiveStep(-500)).toBe(50);
  });
});
