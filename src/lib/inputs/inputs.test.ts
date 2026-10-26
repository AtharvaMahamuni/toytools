import { describe, it, expect } from 'vitest';
import { parseHumanNumber } from './parse';
import { formatGrouped, formatDecimal, tinyNonZero } from './format';
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

describe('parseHumanNumber exponents (audit S3-15)', () => {
  it('reads 1e9 as a billion, not as 1', () => {
    expect(parseHumanNumber('1e9')).toBe(1e9);
    expect(parseHumanNumber('1E9')).toBe(1e9);
    expect(parseHumanNumber('2.5e-3')).toBe(0.0025);
    expect(parseHumanNumber('-4e+2')).toBe(-400);
    expect(parseHumanNumber('1e3k')).toBe(1e6);
  });

  it('refuses a half-typed or overflowing exponent instead of reading its prefix', () => {
    expect(parseHumanNumber('1e')).toBeNull();
    expect(parseHumanNumber('1e-')).toBeNull();
    expect(parseHumanNumber('1e400')).toBeNull();
    expect(parseHumanNumber('e9')).toBeNull();
    expect(parseHumanNumber('abc')).toBeNull();
  });

  it('keeps the existing readings', () => {
    expect(parseHumanNumber('10k')).toBe(1e4);
    expect(parseHumanNumber('2 crore')).toBe(2e7);
    expect(parseHumanNumber('₹25,000')).toBe(25000);
    expect(parseHumanNumber('7.5%')).toBe(7.5);
    expect(parseHumanNumber('5m')).toBe(5e6);
  });
});

describe('comma rule (Atharva, 26 Oct 2026): "1,5" is 1.5, "1,500" is 1500', () => {
  it('a lone comma without three digits after it is a decimal comma', () => {
    expect(parseHumanNumber('1,5')).toBe(1.5);
    expect(parseHumanNumber('12,75')).toBe(12.75);
    expect(parseHumanNumber('0,0025')).toBe(0.0025);
    expect(parseHumanNumber('-1,5')).toBe(-1.5);
    expect(parseHumanNumber(',5')).toBe(0.5);
    // A leading zero group is never thousands (reviewer, PR 277): 0,500 is 0.5, not 500.
    expect(parseHumanNumber('0,500')).toBe(0.5);
    expect(parseHumanNumber('0,5')).toBe(0.5);
    expect(parseHumanNumber('-0,250')).toBe(-0.25);
    expect(parseHumanNumber('1,5 lakh')).toBe(150000);
    expect(parseHumanNumber('1,5%')).toBe(1.5);
  });

  it('complete Western or Indian grouping is thousands separators', () => {
    expect(parseHumanNumber('1,500')).toBe(1500);
    expect(parseHumanNumber('12,345,678')).toBe(12345678);
    expect(parseHumanNumber('1,500.25')).toBe(1500.25);
    expect(parseHumanNumber('1,50,000')).toBe(150000);
    expect(parseHumanNumber('12,50,00,000')).toBe(125000000);
    expect(parseHumanNumber('₹25,000')).toBe(25000);
    expect(parseHumanNumber('$1,234.56')).toBe(1234.56);
  });

  it('ambiguous comma use is rejected, never guessed', () => {
    for (const s of ['0,500,000', '1,2,3', '1,5.2', '1.500,25', '12,34,5', '1,', '1,,5']) {
      expect(parseHumanNumber(s), s).toBeNull();
    }
  });

  it('round-trips what formatGrouped displays', () => {
    for (const n of [1500, 1234567.5, 0.0025, 1.5]) {
      expect(parseHumanNumber(formatGrouped(n, { maximumFractionDigits: 4 }))).toBe(n);
      expect(parseHumanNumber(formatGrouped(n, { grouping: 'indian', maximumFractionDigits: 4 }))).toBe(n);
    }
  });
});

describe('tiny values never display as 0 (Atharva, 26 Oct 2026)', () => {
  it('tinyNonZero: two significant digits, scientific below 1e-6, noise stays 0', () => {
    expect(tinyNonZero(0.0025, 1)).toBe('0.0025');
    expect(tinyNonZero(-0.000012, 2)).toBe('-0.000012');
    expect(tinyNonZero(2.5e-7, 2)).toBe('2.5e-7');
    expect(tinyNonZero(3e-9, 2)).toBe('3e-9');
    expect(tinyNonZero(5.5e-17, 2)).toBeNull();
    expect(tinyNonZero(0, 2)).toBeNull();
    expect(tinyNonZero(0.05, 1)).toBeNull(); // rounds to 0.1, which is visible
    expect(tinyNonZero(0.04, 1)).toBe('0.04');
  });

  it('formatGrouped and formatDecimal keep tiny values visible; money keeps cents', () => {
    expect(formatGrouped(0.0025, { maximumFractionDigits: 2 })).toBe('0.0025');
    expect(formatGrouped(0.0004)).toBe('0.0004');
    expect(formatGrouped(0.004, { style: 'percent', maximumFractionDigits: 1 })).toBe('0.004%');
    expect(formatGrouped(1234.5, { maximumFractionDigits: 2 })).toBe('1,234.5');
    expect(formatGrouped(0.001, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe('$0.00');
    expect(formatGrouped(0)).toBe('0');
    expect(formatDecimal(0.0025, 2)).toBe('0.0025');
    expect(formatDecimal(22.456, 1)).toBe('22.5');
    expect(formatDecimal(0.1 + 0.2 - 0.3, 2)).toBe('0');
  });
});
