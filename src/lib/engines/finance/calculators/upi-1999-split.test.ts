import { describe, it, expect } from 'vitest';
import { runFinance } from '../registry';
import { moneyWhole } from '../format';
import {
  splitWholeRupees,
  groupedSplitLine,
  onePaymentLine,
  partsSumLine,
  paymentCountLabel,
  UPI_CAP,
  upi1999Split,
} from './upi-1999-split';

const INR = { currency: 'INR' };

describe('groupedSplitLine', () => {
  it('groups 5000 as two chunks then the remainder', () => {
    const chunks = splitWholeRupees(5000);
    expect(chunks).toEqual([1999, 1999, 1002]);
    expect(chunks.reduce((sum, n) => sum + n, 0)).toBe(5000);
    expect(groupedSplitLine(chunks)).toBe('2 × ₹1,999, then ₹1,002');
    expect(paymentCountLabel(chunks.length)).toBe('3 payments');
    expect(partsSumLine(5000)).toBe('The parts sum to ₹5,000.');
  });

  it('omits the remainder clause when every part is 1999', () => {
    expect(splitWholeRupees(3998)).toEqual([1999, 1999]);
    expect(groupedSplitLine(splitWholeRupees(3998))).toBe('2 × ₹1,999');
    expect(groupedSplitLine(splitWholeRupees(9995))).toBe('5 × ₹1,999');
    expect(splitWholeRupees(2001)).toEqual([1999, 2]);
    expect(groupedSplitLine(splitWholeRupees(2001))).toBe('1 × ₹1,999, then ₹2');
  });
});

describe('upi-1999-split calculator', () => {
  it('says one payment of the amount at 2000 and below', () => {
    for (const amount of [1, 1999, 2000]) {
      const r = runFinance('upi-1999-split', { amount }, INR);
      expect(r.ok).toBe(true);
      expect(r.hero?.value).toBe(onePaymentLine(amount));
      expect(r.hero?.value).toBe(`One payment of ${moneyWhole(amount, 'INR')}. Nothing to split.`);
      expect(r.metrics.filter((m) => m.emphasis !== 'hero')).toEqual([]);
      expect(r.insights?.some((i) => i.text.includes('UPI tax'))).toBe(false);
    }
  });

  it('groups 5000 into one line, a payment count, and a sum check', () => {
    const r = runFinance('upi-1999-split', { amount: 5000 }, INR);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(3);
    expect(r.hero?.value).toBe('2 × ₹1,999, then ₹1,002');
    expect(r.hero?.label).toBe('3 payments');
    expect(r.hero?.note).toBe('The parts sum to ₹5,000.');
    expect(r.metrics.filter((m) => m.emphasis !== 'hero')).toEqual([]);
    expect(r.insights?.some((i) => i.tone === 'caution' && i.text.includes('does not owe'))).toBe(true);
  });

  it('rejects negative, zero, blank, and non-numeric input', () => {
    expect(runFinance('upi-1999-split', { amount: -1 }, INR).ok).toBe(false);
    expect(runFinance('upi-1999-split', { amount: 0 }, INR).error).toMatch(/greater than zero/);
    expect(runFinance('upi-1999-split', { amount: '' }, INR).error).toMatch(/Enter total rupees/);
    expect(runFinance('upi-1999-split', { amount: 'abc' }, INR).error).toMatch(/must be a number/);
    expect(runFinance('upi-1999-split', {}, INR).ok).toBe(false);
  });

  it('rejects paise and amounts over the cap, and groups the cap itself', () => {
    expect(runFinance('upi-1999-split', { amount: 10.5 }, INR).error).toMatch(/No paise/);
    const over = runFinance('upi-1999-split', { amount: UPI_CAP + 1 }, INR);
    expect(over.ok).toBe(false);
    expect(over.error).toMatch(/10,00,000/);
    const atCap = runFinance('upi-1999-split', { amount: UPI_CAP }, INR);
    expect(atCap.ok).toBe(true);
    expect(atCap.metrics.filter((m) => m.emphasis !== 'hero')).toEqual([]);
    expect(atCap.hero?.value).toBe('500 × ₹1,999, then ₹500');
    expect(atCap.hero?.label).toBe('501 payments');
    expect(atCap.hero?.note).toBe('The parts sum to ₹10,00,000.');
  });

  it('parses Indian grouping and stays quiet under the threshold about the tax line', () => {
    const grouped = runFinance('upi-1999-split', { amount: '5,000' }, INR);
    expect(grouped.hero?.value).toBe('2 × ₹1,999, then ₹1,002');
    expect(grouped.metrics.filter((m) => m.emphasis !== 'hero')).toEqual([]);
    expect(upi1999Split.id).toBe('upi-1999-split');
  });
});
