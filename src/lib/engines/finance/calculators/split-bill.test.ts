import { describe, it, expect } from 'vitest';
import { runFinance } from '../registry';
import { money } from '../format';
import { splitBillFair, rupeesFromPaise } from './split-bill';

const INR = { currency: 'INR' };

describe('splitBillFair', () => {
  it('splits 1000 with a 10 percent tip across 3 people', () => {
    const split = splitBillFair(1000, 3, 10);
    expect(split.totalPaise).toBe(110000);
    expect(split.remainderPaise).toBe(2);
    expect(split.sharesPaise).toEqual([36666, 36666, 36668]);
    expect(split.sharesPaise.reduce((a, b) => a + b, 0)).toBe(split.totalPaise);
    expect(split.sharesPaise.map(rupeesFromPaise)).toEqual([366.66, 366.66, 366.68]);
  });

  it('stays quiet about leftover paise when the total divides evenly', () => {
    const split = splitBillFair(900, 3, 0);
    expect(split.remainderPaise).toBe(0);
    expect(split.sharesPaise).toEqual([30000, 30000, 30000]);
  });
});

describe('split-bill calculator', () => {
  it('shows the 1000 / 3 / 10 sample and the sum check', () => {
    const r = runFinance('split-bill', { bill: 1000, people: 3, tip: 10 }, INR);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(1100);
    expect(r.hero?.value).toBe(money(1100, 'INR'));
    expect(r.hero?.value).toBe('₹1,100.00');
    expect(r.hero?.label).toBe('Total with tip');
    expect(r.metrics.filter((m) => m.emphasis !== 'hero')).toEqual([]);
    expect(r.hero?.note).toBe('3 people. Each person pays ₹366.66. The last person pays ₹366.68.');
    expect(r.meta?.each).toBe(366.66);
    expect(r.meta?.last).toBe(366.68);
    expect(r.assumptions?.find((a) => a.label === 'Remainder paise')?.value).toBe('2');
  });

  it('does not mention leftover paise when shares are equal', () => {
    const r = runFinance('split-bill', { bill: 900, people: 3, tip: 0 }, INR);
    expect(r.ok).toBe(true);
    expect(r.hero?.note).toBe('3 people. Each person pays ₹300.00.');
    expect(r.hero?.note).not.toMatch(/last person/);
    expect(r.insights?.some((i) => /leftover|last person/.test(i.text))).toBe(false);
    expect(r.metrics.filter((m) => m.emphasis !== 'hero')).toEqual([]);
  });

  it('treats a blank tip as zero and keeps the last person on the remainder', () => {
    const r = runFinance('split-bill', { bill: 100, people: 3, tip: '' }, INR);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(100);
    expect(r.hero?.note).toBe('3 people. Each person pays ₹33.33. The last person pays ₹33.34.');
    expect(r.metrics.filter((m) => m.emphasis !== 'hero')).toEqual([]);
  });

  it('rejects out of range people, a high tip, paise past two places, and a zero bill', () => {
    expect(runFinance('split-bill', { bill: 100, people: 1, tip: 0 }, INR).error).toMatch(/2 to 30/);
    expect(runFinance('split-bill', { bill: 100, people: 31, tip: 0 }, INR).ok).toBe(false);
    expect(runFinance('split-bill', { bill: 100, people: 2.5, tip: 0 }, INR).error).toMatch(/whole number/);
    expect(runFinance('split-bill', { bill: 100, people: 2, tip: 31 }, INR).error).toMatch(/0 to 30/);
    expect(runFinance('split-bill', { bill: 10.555, people: 2, tip: 0 }, INR).error).toMatch(/two decimal/);
    expect(runFinance('split-bill', { bill: 0, people: 2, tip: 0 }, INR).ok).toBe(false);
    expect(runFinance('split-bill', { bill: '', people: 2, tip: 0 }, INR).ok).toBe(false);
    expect(runFinance('split-bill', { bill: null, people: 2, tip: 0 }, INR).ok).toBe(false);
    expect(runFinance('split-bill', { bill: 'abc', people: 2, tip: 0 }, INR).error).toMatch(/number/);
    expect(runFinance('split-bill', { bill: '1,000', people: 2, tip: 0 }, INR).hero?.raw).toBe(1000);
    expect(runFinance('split-bill', { bill: 100_000_001, people: 2, tip: 0 }, INR).error).toMatch(/page limit/);
    expect(runFinance('split-bill', { bill: 100, people: null, tip: 0 }, INR).ok).toBe(false);
    expect(runFinance('split-bill', { bill: 100, people: 'x', tip: 0 }, INR).error).toMatch(/number/);
    expect(runFinance('split-bill', { bill: 100, people: 2, tip: 'nope' }, INR).error).toMatch(/number/);
    expect(runFinance('split-bill', { bill: 100, people: 2, tip: 1.5 }, INR).error).toMatch(/whole number/);
    expect(runFinance('split-bill', { bill: 100, people: 2, tip: -1 }, INR).ok).toBe(false);
    expect(runFinance('split-bill', { bill: 80, people: 2 }, INR).hero?.raw).toBe(80);
  });
});
