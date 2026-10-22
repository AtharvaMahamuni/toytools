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

describe('roi validation and edge branches', () => {
  it('rejects a zero cost', () => {
    const r = runFinance('roi', { cost: 0, final: 15000, years: 3 }, USD);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('validation-error');
  });
  it('a total loss is -100% with no annualized card', () => {
    const r = runFinance('roi', { cost: 10000, final: 0, years: 3 }, USD);
    expect(r.ok).toBe(true);
    expect(r.hero!.raw).toBe(-100);
    expect(r.metrics.some((m) => m.id === 'annualized')).toBe(false);
  });
  it('blank holding period skips annualized and nudges to add one', () => {
    const r = runFinance('roi', { cost: 10000, final: 15000, years: '' }, USD);
    expect(r.ok).toBe(true);
    expect(r.metrics.some((m) => m.id === 'annualized')).toBe(false);
    expect(r.insights!.some((i) => i.text.includes('holding period'))).toBe(true);
  });
  it('a loss emits the caution insight and a Net loss label', () => {
    const r = runFinance('roi', { cost: 10000, final: 8500, years: 1 }, USD);
    expect(r.insights!.some((i) => i.tone === 'caution')).toBe(true);
    expect(r.metrics.find((m) => m.id === 'gain')!.label).toBe('Net loss');
  });
});

describe('cagr validation and edge branches', () => {
  it('rejects zero start, end, and period', () => {
    expect(runFinance('cagr', { start: 0, end: 25000, years: 10 }, USD).ok).toBe(false);
    expect(runFinance('cagr', { start: 10000, end: 0, years: 10 }, USD).ok).toBe(false);
    expect(runFinance('cagr', { start: 10000, end: 25000, years: 0 }, USD).ok).toBe(false);
  });
  it('a shrinking value yields a negative rate, no doubling card, and a caution', () => {
    const r = runFinance('cagr', { start: 10000, end: 8000, years: 5 }, USD);
    expect(r.ok).toBe(true);
    expect(r.hero!.raw).toBeLessThan(0);
    expect(r.metrics.some((m) => m.id === 'doubling')).toBe(false);
    expect(r.insights!.some((i) => i.tone === 'caution')).toBe(true);
  });
  it('a sub-year period annualizes but warns about extrapolation', () => {
    const r = runFinance('cagr', { start: 10000, end: 11000, years: 0.5 }, USD);
    expect(r.ok).toBe(true);
    expect(r.insights!.some((i) => i.text.includes('shorter than a year'))).toBe(true);
    expect(r.timeline).toBeUndefined();
  });
  it('emits the smoothed timeline and doubling metric for growth', () => {
    const r = runFinance('cagr', { start: 10000, end: 25000, years: 10 }, USD);
    expect(r.timeline!.length).toBeGreaterThan(2);
    expect(r.timeline![0].value).toBe(10000);
    expect(r.timeline!.at(-1)!.value).toBeCloseTo(25000, 0);
    expect(r.metrics.find((m) => m.id === 'doubling')!.raw).toBeCloseTo(7.56, 1);
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

describe('loan amortization', () => {
  const base = { price: 100000, down: 0, rate: 12, years: 5, extra: 0 };

  it('matches the standard payment for 100000 at 12% over 5 years', () => {
    const r = runFinance('loan', base, USD);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBeCloseTo(2224.44, 2);
    expect(r.hero?.note).toBeUndefined();
    expect(r.metrics.find((m) => m.id === 'borrowed')?.raw).toBe(100000);
    expect(r.metrics.find((m) => m.id === 'interest')?.raw).toBeCloseTo(33466.83, 2);
    expect(r.metrics.find((m) => m.id === 'payoff')?.raw).toBe(60);
    expect(r.metrics.some((m) => m.id === 'saved')).toBe(false);
    expect(r.timeline?.[0]?.value).toBe(100000);
    expect(r.timeline?.[r.timeline.length - 1]?.value).toBe(0);
    const parts = (r.timeline ?? []).slice(1);
    const principalPaid = parts.reduce((sum, point) => sum + (point.parts?.principal ?? 0), 0);
    const interestPaid = parts.reduce((sum, point) => sum + (point.parts?.interest ?? 0), 0);
    expect(principalPaid).toBeCloseTo(100000, 2);
    expect(interestPaid).toBeCloseTo(33466.83, 2);
  });

  it('subtracts the down payment from the amount borrowed', () => {
    const r = runFinance('loan', { ...base, price: 500000, down: 100000, rate: 8.5, years: 20 }, USD);
    expect(r.ok).toBe(true);
    expect(r.metrics.find((m) => m.id === 'borrowed')?.raw).toBe(400000);
  });

  it('applies an extra payment to principal and shortens the term', () => {
    const plain = runFinance('loan', base, USD);
    const extra = runFinance('loan', { ...base, extra: 500 }, USD);
    expect(extra.ok).toBe(true);
    const plainInterest = plain.metrics.find((m) => m.id === 'interest')!.raw!;
    const extraInterest = extra.metrics.find((m) => m.id === 'interest')!.raw!;
    const months = extra.metrics.find((m) => m.id === 'payoff')!.raw!;
    expect(months).toBeLessThan(60);
    expect(extraInterest).toBeLessThan(plainInterest);
    expect(extra.metrics.find((m) => m.id === 'saved')?.raw).toBeCloseTo(plainInterest - extraInterest, 1);
    expect(extra.insights?.[0]?.text).toContain('saves');
    expect(extra.explanation).toContain('An extra');
    expect(extra.assumptions?.some((a) => a.value.includes('off the principal'))).toBe(true);
  });

  it('names a yearly rate when 2 was likely meant as a monthly rate, and stays quiet at 12%', () => {
    const low = runFinance('loan', { ...base, rate: 2 }, USD);
    expect(low.hero?.note).toContain('yearly rate');
    expect(low.hero?.note).toContain('24% a year');
    const ordinary = runFinance('loan', base, USD);
    expect(ordinary.hero?.note).toBeUndefined();
    const high = runFinance('loan', { ...base, rate: 48 }, USD);
    expect(high.hero?.note).toContain('yearly rate');
    expect(high.hero?.note).toContain('4% a month');
  });

  it('rejects a down payment that covers the whole price', () => {
    const r = runFinance('loan', { ...base, down: 100000 }, USD);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('validation-error');
    expect(r.error).toContain('nothing to borrow');
  });

  it('rejects a rate and term that never reduce the balance', () => {
    const r = runFinance('loan', { ...base, rate: 100, years: 40 }, USD);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('never pay the balance down');
  });

  it('lets an extra payment finish a rate the ordinary installment cannot', () => {
    const rescued = runFinance('loan', { ...base, rate: 100, years: 40, extra: 5000 }, USD);
    expect(rescued.ok).toBe(true);
    expect(rescued.metrics.find((m) => m.id === 'payoff')!.raw!).toBeLessThan(480);
    expect(rescued.metrics.some((m) => m.id === 'saved')).toBe(false);
    expect(rescued.insights?.[0]?.text).toContain('Interest is');
  });

  it('uses a zero rate as equal splits with no interest', () => {
    const r = runFinance('loan', { ...base, rate: 0, years: 1 }, USD);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBeCloseTo(100000 / 12, 2);
    expect(r.metrics.find((m) => m.id === 'interest')?.raw).toBe(0);
    expect(r.metrics.find((m) => m.id === 'payoff')?.value).toBe('1 year');
    expect(r.insights?.[0]?.text).toContain('no interest');
    expect(r.hero?.note).toBeUndefined();
  });

  it('labels a one-month payoff in the singular', () => {
    const r = runFinance('loan', { ...base, rate: 0, years: 1, extra: 100000 }, USD);
    expect(r.ok).toBe(true);
    expect(r.metrics.find((m) => m.id === 'payoff')?.value).toBe('1 month');
  });

  it('rejects a term under one month', () => {
    const r = runFinance('loan', { ...base, years: 0 }, USD);
    expect(r.ok).toBe(false);
    expect(r.error).toBe('The shortest term is one month. Type 0.08 for one month or 0.5 for six.');
    expect(runFinance('loan', { ...base, years: 0.04 }, USD).ok).toBe(false);
  });

  it('takes a term under a year as whole months', () => {
    const six = runFinance('loan', { ...base, rate: 12, years: 0.5 }, USD);
    expect(six.ok).toBe(true);
    expect(six.metrics.find((m) => m.id === 'payoff')?.raw).toBe(6);
    expect(six.metrics.find((m) => m.id === 'payoff')?.value).toBe('6 months');
    expect(six.hero?.raw).toBeCloseTo(17254.84, 2);
    const one = runFinance('loan', { ...base, rate: 0, years: 0.08 }, USD);
    expect(one.metrics.find((m) => m.id === 'payoff')?.raw).toBe(1);
    expect(one.hero?.raw).toBe(100000);
  });

  it('rounds each month of interest to the cent before it is booked', () => {
    // 150 at 12% over 3 months is a case where booking unrounded monthly interest gives a
    // different schedule. 51 a month and 3.02 interest match an independent cent-by-cent walk.
    const r = runFinance('loan', { ...base, price: 150, rate: 12, years: 0.25 }, USD);
    expect(r.hero?.raw).toBe(51);
    expect(r.metrics.find((m) => m.id === 'interest')?.raw).toBe(3.02);
    expect(r.timeline?.[1]?.parts).toEqual({ principal: 150, interest: 3.02 });
  });

  it('total paid is the amount borrowed plus the interest, to the cent', () => {
    const r = runFinance('loan', { ...base, down: 20000 }, USD);
    const total = r.metrics.find((m) => m.id === 'total')!;
    const interest = r.metrics.find((m) => m.id === 'interest')!.raw!;
    expect(total.raw).toBeCloseTo(80000 + interest, 2);
    expect(total.raw).toBe(106773.25);
  });

  it('books interest to the cent each month, so the schedule sums exactly', () => {
    // 1000 at 7% over 7 months: the unrounded interest would drift by fractions of a cent.
    const r = runFinance('loan', { ...base, price: 1000, rate: 7, years: 7 / 12 }, USD);
    const parts = (r.timeline ?? []).slice(1);
    const interestPaid = parts.reduce((sum, p) => sum + (p.parts?.interest ?? 0), 0);
    const interest = r.metrics.find((m) => m.id === 'interest')!.raw!;
    expect(Math.round(interest * 100)).toBe(interest * 100);
    expect(interestPaid).toBeCloseTo(interest, 6);
    // Matches an independent cent-by-cent schedule: 146.21 a month, 23.46 interest.
    expect(interest).toBe(23.46);
    expect(r.hero?.raw).toBe(146.21);
  });

  it('runs a sub-cent installment to the end of the term', () => {
    const zero = runFinance('loan', { ...base, price: 1, rate: 0, years: 20 }, USD);
    expect(zero.ok).toBe(true);
    expect(zero.metrics.find((m) => m.id === 'payoff')?.raw).toBe(240);
    expect(zero.hero?.value).toContain('Under');
    expect(zero.hero?.value).not.toBe('$0.00');
    expect(zero.explanation).not.toContain('An extra');
    expect(zero.insights?.[0]?.text).toContain('no interest');

    const tiny = runFinance('loan', { ...base, price: 1, rate: 1, years: 20 }, USD);
    expect(tiny.ok).toBe(true);
    expect(tiny.metrics.find((m) => m.id === 'payoff')?.raw).toBe(240);
    expect(tiny.explanation).not.toContain('An extra');
    expect(tiny.insights?.[0]?.text).not.toContain('zero yearly rate');
    expect(tiny.hero?.value).toContain('Under');
  });

  it('ignores an extra payment that rounds away to zero cents', () => {
    const plain = runFinance('loan', base, USD);
    const dust = runFinance('loan', { ...base, extra: 0.004 }, USD);
    expect(dust.ok).toBe(true);
    expect(dust.metrics.find((m) => m.id === 'interest')?.raw).toBe(plain.metrics.find((m) => m.id === 'interest')?.raw);
    expect(dust.metrics.some((m) => m.id === 'saved')).toBe(false);
    expect(dust.explanation).not.toContain('An extra');
    expect(dust.insights?.[0]?.text ?? '').not.toContain('$0.00');
  });

  it('rejects a rounded payment that does not reduce principal', () => {
    const r = runFinance('loan', { ...base, rate: 36, years: 40 }, USD);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('never pay the balance down');
  });

  it('does not describe rounded-away interest as a zero rate', () => {
    const r = runFinance('loan', { ...base, price: 0.01, rate: 12, years: 1 }, USD);
    expect(r.ok).toBe(true);
    expect(r.metrics.find((m) => m.id === 'payoff')?.raw).toBe(12);
    expect(r.metrics.find((m) => m.id === 'interest')?.raw).toBe(0);
    expect(r.insights?.[0]?.text).toContain('under half a cent');
    expect(r.insights?.[0]?.text).not.toContain('zero yearly rate');
    expect(r.explanation).not.toContain('An extra');
  });
});
