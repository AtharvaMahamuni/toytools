import { describe, it, expect } from 'vitest';
import { runFinance } from '../registry';
import { money } from '../format';
import {
  estimateMdr,
  NOT_A_CUSTOMER_FEE,
  MDR_PAGE_CAP,
} from './upi-mdr-estimator';

const INR = { currency: 'INR' };

function ruleOf(amount: number, kind: string): string | undefined {
  const r = runFinance('upi-mdr-estimator', { amount, kind }, INR);
  return r.assumptions?.find((a) => a.label === 'Rule')?.value;
}

describe('estimateMdr thresholds', () => {
  it('is zero at 2000 for every kind', () => {
    for (const kind of ['ordinary', 'essential', 'capital', 'small'] as const) {
      expect(estimateMdr(2000, kind)).toEqual({ mdr: 0, rule: 'zero-at-or-under-2000' });
      expect(estimateMdr(1, kind).mdr).toBe(0);
    }
  });

  it('charges 0.4 percent at 2001 ordinary, and the cap only from 75000', () => {
    expect(estimateMdr(2001, 'ordinary')).toEqual({ mdr: 8, rule: 'ordinary-0-4' });
    const under = estimateMdr(74999, 'ordinary');
    expect(under.rule).toBe('ordinary-0-4');
    expect(under.mdr).toBe(300);
    expect(estimateMdr(75000, 'ordinary')).toEqual({ mdr: 300, rule: 'ordinary-cap-300' });
    expect(estimateMdr(75001, 'ordinary').rule).toBe('ordinary-cap-300');
  });

  it('uses a flat 5 rupees for essential above 2000', () => {
    expect(estimateMdr(2001, 'essential')).toEqual({ mdr: 5, rule: 'essential-flat-5' });
    expect(estimateMdr(100000, 'essential').mdr).toBe(5);
  });

  it('caps capital-market MDR at 300', () => {
    expect(estimateMdr(2001, 'capital')).toEqual({ mdr: 0.4, rule: 'capital-0-02' });
    expect(estimateMdr(1_000_000, 'capital')).toEqual({ mdr: 200, rule: 'capital-0-02' });
    expect(estimateMdr(2_000_000, 'capital')).toEqual({ mdr: 300, rule: 'capital-cap-300' });
  });

  it('stays at zero for the small-merchant what-if at any amount', () => {
    expect(estimateMdr(2001, 'small')).toEqual({ mdr: 0, rule: 'small-merchant-what-if' });
    expect(estimateMdr(500000, 'small').mdr).toBe(0);
  });
});

describe('upi-mdr-estimator calculator', () => {
  it('shows 20 rupees at 5000 ordinary, and says it is not a customer fee', () => {
    const r = runFinance('upi-mdr-estimator', { amount: 5000, kind: 'ordinary' }, INR);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(20);
    expect(r.hero?.value).toBe(money(20, 'INR'));
    expect(r.hero?.value).toBe('₹20.00');
    expect(r.hero?.note).toBe(NOT_A_CUSTOMER_FEE);
    expect(r.insights?.some((i) => i.text === NOT_A_CUSTOMER_FEE && i.tone === 'caution')).toBe(true);
    expect(r.explanation).toContain('not a government tax');
  });

  it('reports the named thresholds through the calculator', () => {
    expect(ruleOf(2000, 'ordinary')).toBe('zero-at-or-under-2000');
    expect(runFinance('upi-mdr-estimator', { amount: 2001, kind: 'ordinary' }, INR).hero?.raw).toBe(8);
    expect(ruleOf(74999, 'ordinary')).toBe('ordinary-0-4');
    expect(ruleOf(75000, 'ordinary')).toBe('ordinary-cap-300');
    expect(runFinance('upi-mdr-estimator', { amount: 2001, kind: 'essential' }, INR).hero?.raw).toBe(5);
    expect(ruleOf(2_000_000, 'capital')).toBe('capital-cap-300');
    expect(runFinance('upi-mdr-estimator', { amount: 2_000_000, kind: 'capital' }, INR).hero?.raw).toBe(300);
  });

  it('rejects blank, zero, paise, unknown kind, and the page cap', () => {
    expect(runFinance('upi-mdr-estimator', { amount: '' }, INR).error).toMatch(/whole rupees/);
    expect(runFinance('upi-mdr-estimator', { amount: 0, kind: 'ordinary' }, INR).ok).toBe(false);
    expect(runFinance('upi-mdr-estimator', { amount: 10.5, kind: 'ordinary' }, INR).error).toMatch(/No paise/);
    expect(runFinance('upi-mdr-estimator', { amount: 5000, kind: 'p2p' }, INR).ok).toBe(false);
    expect(runFinance('upi-mdr-estimator', { amount: MDR_PAGE_CAP + 1, kind: 'ordinary' }, INR).ok).toBe(false);
    expect(runFinance('upi-mdr-estimator', { amount: '5,000', kind: 'ordinary' }, INR).hero?.raw).toBe(20);
    expect(runFinance('upi-mdr-estimator', { amount: null, kind: 'ordinary' }, INR).ok).toBe(false);
    expect(runFinance('upi-mdr-estimator', { amount: 'abc', kind: 'ordinary' }, INR).error).toMatch(/number/);
    expect(runFinance('upi-mdr-estimator', { amount: -5, kind: 'ordinary' }, INR).error).toMatch(/greater than zero/);
    expect(runFinance('upi-mdr-estimator', { amount: ' 75000 ', kind: '' }, INR).assumptions?.find((a) => a.label === 'Rule')?.value).toBe('ordinary-cap-300');
  });
});
