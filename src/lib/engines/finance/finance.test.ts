import { describe, it, expect } from 'vitest';
import { runFinance, FINANCE_CALCULATORS, financeFields } from './registry';
import { FINANCE_EXAMPLES } from './examples';
import type { FinanceInput } from './types';

const USD = { currency: 'USD' };

/** Build an input object from a calculator's field defaults. */
function defaultsFor(id: string): FinanceInput {
  return Object.fromEntries(financeFields(id).map((f) => [f.id, f.default]));
}

describe('runFinance resolver', () => {
  it('returns a calculation-error for an unknown id', () => {
    const r = runFinance('nope', {}, USD);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('calculation-error');
    expect(r.error).toBe('Unknown calculator');
  });
});

describe('all-default invariant (build-time fields ↔ runtime calc seam)', () => {
  it.each(Object.keys(FINANCE_CALCULATORS))('%s computes ok with all default inputs', (id) => {
    const r = runFinance(id, defaultsFor(id), USD);
    expect(r.ok).toBe(true);
    expect(r.uiState).toBe('success');
    expect(r.hero).toBeDefined();
    expect(r.metrics.length).toBeGreaterThan(0);
  });
});

describe('worked-example registry drives the tests (no duplicate fixtures)', () => {
  it.each(FINANCE_EXAMPLES.filter((e) => e.expect).map((e) => [e.id, e] as const))(
    '%s matches its expected values',
    (_id, ex) => {
      const r = runFinance(ex.ref, ex.inputs, USD);
      expect(r.ok).toBe(true);
      const byId = new Map([r.hero, ...r.metrics].filter(Boolean).map((c) => [c!.id, c!.raw]));
      for (const [key, value] of Object.entries(ex.expect!)) {
        expect(byId.get(key)).toBeCloseTo(value, 1);
      }
    },
  );
});

describe('validation paths', () => {
  it('compound interest requires a principal', () => {
    const r = runFinance('compound-interest', { principal: '', rate: 7, frequency: '12', years: 10 }, USD);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('validation-error');
  });

  it('rule of 72 rejects a zero rate', () => {
    const r = runFinance('rule-of-72', { rate: 0 }, USD);
    expect(r.ok).toBe(false);
  });

  it('savings goal returns 0/month when current already meets the goal', () => {
    const r = runFinance('savings-goal', { goal: 1000, current: 2000, rate: 5, years: 3 }, USD);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(0);
  });
});

describe('sip validation and edge branches', () => {
  it('rejects a missing monthly amount', () => {
    const r = runFinance('sip', { monthly: '', rate: 10, years: 10, initial: 0 }, USD);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('validation-error');
  });
  it('rejects a zero investment period', () => {
    const r = runFinance('sip', { monthly: 500, rate: 10, years: 0, initial: 0 }, USD);
    expect(r.ok).toBe(false);
  });
  it('rejects a negative starting lump sum', () => {
    const r = runFinance('sip', { monthly: 500, rate: 10, years: 10, initial: -5 }, USD);
    expect(r.ok).toBe(false);
  });
  it('rejects an out-of-range rate', () => {
    const r = runFinance('sip', { monthly: 500, rate: 250, years: 10, initial: 0 }, USD);
    expect(r.ok).toBe(false);
  });
  it('handles a zero return: value equals contributions, no growth insight share', () => {
    const r = runFinance('sip', { monthly: 100, rate: 0, years: 2, initial: 0 }, USD);
    expect(r.ok).toBe(true);
    expect(r.hero!.raw).toBe(2400);
    const invested = r.metrics.find(m => m.id === 'invested')!;
    expect(invested.raw).toBe(2400);
    const gain = r.metrics.find(m => m.id === 'gain')!;
    expect(gain.raw).toBe(0);
  });
  it('singular year phrasing and lump-sum breakdown entry', () => {
    const r = runFinance('sip', { monthly: 100, rate: 12, years: 1, initial: 1000 }, USD);
    expect(r.ok).toBe(true);
    expect(r.hero!.note).toBe('after 1 year');
    expect(r.breakdown!.some(b => b.id === 'lump')).toBe(true);
    expect(r.explanation).toContain('lump sum');
  });
  it('omits the lump-sum breakdown entry when starting from zero', () => {
    const r = runFinance('sip', { monthly: 100, rate: 12, years: 3, initial: 0 }, USD);
    expect(r.ok).toBe(true);
    expect(r.breakdown!.some(b => b.id === 'lump')).toBe(false);
  });
});

describe('storytelling output', () => {
  it('compound interest emits a contributions metric only when contributing', () => {
    const withContrib = runFinance('compound-interest', { principal: 1000, rate: 8, frequency: '12', years: 30, contribution: 200 }, USD);
    expect(withContrib.metrics.some((m) => m.id === 'contributions')).toBe(true);
    const without = runFinance('compound-interest', { principal: 1000, rate: 8, frequency: '12', years: 30, contribution: 0 }, USD);
    expect(without.metrics.some((m) => m.id === 'contributions')).toBe(false);
  });

  it('every successful result carries insights, milestones, assumptions and decisions', () => {
    for (const id of Object.keys(FINANCE_CALCULATORS)) {
      const r = runFinance(id, defaultsFor(id), USD);
      expect(r.insights?.length, `${id} insights`).toBeGreaterThan(0);
      expect(r.milestones?.length, `${id} milestones`).toBeGreaterThan(0);
      expect(r.assumptions?.length, `${id} assumptions`).toBeGreaterThan(0);
      expect(r.decisions?.length, `${id} decisions`).toBeGreaterThan(0);
    }
  });

  it('emergency fund progress matches the worked example', () => {
    const r = runFinance('emergency-fund', { expenses: 3000, months: 6, saved: 4000 }, USD);
    expect(r.hero?.raw).toBe(18000);
    expect(r.metrics.find((m) => m.id === 'remaining')?.raw).toBe(14000);
  });
});
