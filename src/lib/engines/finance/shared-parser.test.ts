import { describe, it, expect } from 'vitest';
import { runFinance } from './registry';
import { parseAmount, positive } from './validation';

// Every finance calculator reads typed numbers through the shared parser (src/lib/inputs/parse.ts),
// so the comma rule is the same everywhere (reviewer, PR 277).
const INR = { currency: 'INR' };

describe('finance engines use the shared parser', () => {
  it('parseAmount follows the comma rule', () => {
    expect(parseAmount('1,5')).toBe(1.5);
    expect(parseAmount('0,500')).toBe(0.5);
    expect(parseAmount('1,500')).toBe(1500);
    expect(parseAmount('1,50,000')).toBe(150000);
    expect(parseAmount('₹25,000')).toBe(25000);
    expect(parseAmount(42)).toBe(42);
    expect(Number.isNaN(parseAmount('1,2,3'))).toBe(true);
  });

  it('upi-1999-split: "5,000" is 5000; "2,5" is refused as paise, not read as 25', () => {
    expect(runFinance('upi-1999-split', { amount: '5,000' }, INR).hero?.value).toBe('2 × ₹1,999, then ₹1,002');
    expect(runFinance('upi-1999-split', { amount: '2,5' }, INR).error).toMatch(/whole rupees/);
  });

  it('upi-mdr-estimator: "20,01,000" is grouped Indian thousands', () => {
    const r = runFinance('upi-mdr-estimator', { amount: '20,01,000', kind: 'ordinary' }, INR);
    const n = runFinance('upi-mdr-estimator', { amount: 2001000, kind: 'ordinary' }, INR);
    expect(r.hero?.raw).toBe(n.hero?.raw);
    expect(runFinance('upi-mdr-estimator', { amount: '0,500', kind: 'ordinary' }, INR).error).toMatch(/whole rupees/);
  });

  it('split-bill: "1000,5" is 1000.50, and "1,000" is one thousand', () => {
    const a = runFinance('split-bill', { bill: '1000,5', people: 3, tip: 0 }, INR);
    const b = runFinance('split-bill', { bill: 1000.5, people: 3, tip: 0 }, INR);
    expect(a.ok).toBe(true);
    expect(a.hero?.raw).toBe(b.hero?.raw);
    const c = runFinance('split-bill', { bill: '1,000', people: 3, tip: 0 }, INR);
    expect(c.hero?.raw).toBe(runFinance('split-bill', { bill: 1000, people: 3, tip: 0 }, INR).hero?.raw);
  });

  it('the shared number() guard (every other finance calculator) reads "1,5" as 1.5', () => {
    const a = positive({ rate: '7,5' }, 'rate', 'Rate');
    const b = positive({ principal: '1,50,000' }, 'principal', 'Principal');
    expect(a.ok && a.value).toBe(7.5);
    expect(b.ok && b.value).toBe(150000);
  });
});
