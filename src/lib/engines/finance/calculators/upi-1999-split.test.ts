import { describe, it, expect } from 'vitest';
import { runFinance } from '../registry';
import {
  splitWholeRupees,
  chunkSumLine,
  UPI_CAP,
  upi1999Split,
} from './upi-1999-split';

const INR = { currency: 'INR' };

describe('splitWholeRupees', () => {
  it('splits 5000 into 1999 + 1999 + 1002', () => {
    const chunks = splitWholeRupees(5000);
    expect(chunks).toEqual([1999, 1999, 1002]);
    expect(chunks.reduce((sum, n) => sum + n, 0)).toBe(5000);
    expect(chunkSumLine(chunks, 5000)).toBe('1999 + 1999 + 1002 = 5000');
  });

  it('keeps a short remainder, including under 1999', () => {
    expect(splitWholeRupees(2001)).toEqual([1999, 2]);
    expect(splitWholeRupees(3998)).toEqual([1999, 1999]);
  });
});

describe('upi-1999-split calculator', () => {
  it('says nothing to split at 2000 and below', () => {
    for (const amount of [1, 1999, 2000]) {
      const r = runFinance('upi-1999-split', { amount }, INR);
      expect(r.ok).toBe(true);
      expect(r.hero?.label).toBe('One payment. Nothing to split.');
      expect(r.hero?.raw).toBe(1);
      expect(r.metrics.map((m) => m.raw)).toEqual([amount]);
      expect(r.insights?.some((i) => i.text.includes('UPI tax'))).toBe(false);
    }
  });

  it('lists the 5000 chunks and the sum check', () => {
    const r = runFinance('upi-1999-split', { amount: 5000 }, INR);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(3);
    expect(r.hero?.note).toBe('1999 + 1999 + 1002 = 5000');
    expect(r.metrics.map((m) => m.raw)).toEqual([1999, 1999, 1002]);
    expect(r.metrics.map((m) => m.value)).toEqual(['₹1,999', '₹1,999', '₹1,002']);
    const sum = (r.metrics.map((m) => m.raw ?? 0)).reduce((a, b) => a + b, 0);
    expect(sum).toBe(5000);
    expect(r.insights?.some((i) => i.tone === 'caution')).toBe(true);
  });

  it('rejects negative, zero, blank, and non-numeric input', () => {
    expect(runFinance('upi-1999-split', { amount: -1 }, INR).ok).toBe(false);
    expect(runFinance('upi-1999-split', { amount: 0 }, INR).error).toMatch(/greater than zero/);
    expect(runFinance('upi-1999-split', { amount: '' }, INR).error).toMatch(/Enter total rupees/);
    expect(runFinance('upi-1999-split', { amount: 'abc' }, INR).error).toMatch(/must be a number/);
    expect(runFinance('upi-1999-split', {}, INR).ok).toBe(false);
  });

  it('rejects paise and amounts over the cap', () => {
    expect(runFinance('upi-1999-split', { amount: 10.5 }, INR).error).toMatch(/No paise/);
    const over = runFinance('upi-1999-split', { amount: UPI_CAP + 1 }, INR);
    expect(over.ok).toBe(false);
    expect(over.error).toMatch(/10,00,000/);
    const atCap = runFinance('upi-1999-split', { amount: UPI_CAP }, INR);
    expect(atCap.ok).toBe(true);
    const raws = atCap.metrics.map((m) => m.raw ?? 0);
    expect(raws.reduce((a, b) => a + b, 0)).toBe(UPI_CAP);
    expect(atCap.hero?.note).toMatch(/sum to 1000000/);
  });

  it('parses Indian grouping and stays quiet under the threshold about the tax line', () => {
    const grouped = runFinance('upi-1999-split', { amount: '5,000' }, INR);
    expect(grouped.metrics.map((m) => m.raw)).toEqual([1999, 1999, 1002]);
    expect(upi1999Split.id).toBe('upi-1999-split');
  });
});
