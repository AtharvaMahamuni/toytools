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
  looksLikeVpa,
  describeUpiNextPay,
  stepUpiDone,
  upiPayHref,
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

describe('upi next chunk link', () => {
  it('builds one link for the next unpaid chunk and no other query keys', () => {
    const first = describeUpiNextPay(7996, 'name@upi', 0);
    expect(first?.label).toBe('Payment 1 of 4 \u00b7 ₹1,999');
    expect(first?.href).toBe('upi://pay?pa=name%40upi&am=1999&cu=INR&tn=Payment%201%20of%204');
    expect(first?.href?.split('?')[1].split('&').map((part) => part.split('=')[0])).toEqual([
      'pa',
      'am',
      'cu',
      'tn',
    ]);
    expect(first?.href).not.toMatch(/(?:^|[?&])(?:pn|tid|tr)=/);

    const second = describeUpiNextPay(7996, 'name@upi', 1);
    expect(second?.label).toBe('Payment 2 of 4 \u00b7 ₹1,999');
    expect(second?.href).toContain('am=1999');
    expect(second?.href).toContain('tn=Payment%202%20of%204');
    expect(second?.allMarked).toBe(false);

    const last = describeUpiNextPay(5000, 'name@upi', 2);
    expect(last?.label).toBe('Payment 3 of 3 \u00b7 ₹1,002');
    expect(last?.amount).toBe(1002);
    expect(last?.href).toContain('am=1002');
  });

  it('omits the link when the UPI ID is empty or not name@handle', () => {
    expect(describeUpiNextPay(5000, '', 0)?.href).toBeNull();
    expect(describeUpiNextPay(5000, '   ', 0)?.vpaMessage).toBeNull();
    expect(describeUpiNextPay(5000, '   ', 0)?.href).toBeNull();
    const bad = describeUpiNextPay(5000, 'not-a-vpa', 0);
    expect(bad?.href).toBeNull();
    expect(bad?.vpaMessage).toMatch(/name@handle/);
    expect(looksLikeVpa('name@')).toBe(false);
    expect(looksLikeVpa('@upi')).toBe(false);
    expect(looksLikeVpa('name@@upi')).toBe(false);
    expect(looksLikeVpa('name @upi')).toBe(false);
    expect(looksLikeVpa('a@b')).toBe(false);
    expect(looksLikeVpa('name@upi')).toBe(true);
    expect(looksLikeVpa('9876543210@ybl')).toBe(true);
    expect(describeUpiNextPay(2000, '  name@upi  ', 0)?.href).toContain('pa=name%40upi');
  });

  it('treats 2000 as one payment and refuses an illegal total', () => {
    const one = describeUpiNextPay(2000, 'name@upi', 0);
    expect(one?.label).toBe('Payment 1 of 1 \u00b7 ₹2,000');
    expect(one?.href).toContain('am=2000');
    expect(one?.total).toBe(1);
    expect(describeUpiNextPay(0, 'name@upi', 0)).toBeNull();
    expect(describeUpiNextPay(10.5, 'name@upi', 0)).toBeNull();
    expect(describeUpiNextPay(UPI_CAP + 1, 'name@upi', 0)).toBeNull();
  });

  it('hides the link when every chunk is marked and steps back on untick', () => {
    const all = describeUpiNextPay(5000, 'name@upi', 3);
    expect(all?.allMarked).toBe(true);
    expect(all?.href).toBeNull();
    expect(all?.label).toBe('Payment 3 of 3 \u00b7 ₹1,002');
    expect(stepUpiDone(0, 3, true)).toBe(1);
    expect(stepUpiDone(1, 3, true)).toBe(2);
    expect(stepUpiDone(2, 3, false)).toBe(1);
    expect(stepUpiDone(3, 3, false)).toBe(2);
    expect(stepUpiDone(3, 3, true)).toBe(3);
    expect(upiPayHref('name@upi', 1999, 0, 3)).not.toContain('pn=');
  });
});
