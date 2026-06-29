import { describe, it, expect } from 'vitest';
import { FINANCE_FORMULAS, getFormula } from './formulas';
import { financeManifest } from './manifest';
import { FINANCE_CONCEPTS, FINANCE_CONCEPT_MAP } from './concepts';
import { FINANCE_EXAMPLES, financeExamplesFor } from './examples';
import { FINANCE_CALCULATORS, runFinance } from './registry';
import { isNumericField } from '@lib/inputs/field';
import { moneyWhole } from './format';

const USD = { currency: 'USD' };

describe('formula registry', () => {
  it('every formula resolves and has variables + an expression', () => {
    for (const id of Object.keys(FINANCE_FORMULAS)) {
      const f = getFormula(id);
      expect(f, id).toBeDefined();
      expect(f!.expression.length).toBeGreaterThan(0);
      expect(f!.variables.length).toBeGreaterThan(0);
      expect(f!.assumptions.length).toBeGreaterThan(0);
    }
  });
  it('returns undefined for an unknown id', () => {
    expect(getFormula('nope')).toBeUndefined();
  });
});

describe('finance manifest', () => {
  it('lists every registered calculator as a processor', () => {
    expect(financeManifest.engine).toBe('finance');
    expect(financeManifest.processors.sort()).toEqual(Object.keys(FINANCE_CALCULATORS).sort());
    expect(financeManifest.families).toEqual(expect.arrayContaining(['interest', 'savings', 'inflation']));
    expect(financeManifest.resultTypes).toContain('hero');
  });
});

describe('concept registry', () => {
  it('builds a map of every concept', () => {
    expect(FINANCE_CONCEPT_MAP.size).toBe(FINANCE_CONCEPTS.length);
    expect(FINANCE_CONCEPT_MAP.get('compound-interest')?.term).toBe('Compound interest');
  });
  it('every relatedConcepts target resolves to a real concept', () => {
    for (const c of FINANCE_CONCEPTS) {
      for (const rel of c.relatedConcepts ?? []) {
        expect(FINANCE_CONCEPT_MAP.has(rel), `${c.id} -> ${rel}`).toBe(true);
      }
    }
  });
});

describe('example registry', () => {
  it('every example references a real calculator', () => {
    for (const ex of FINANCE_EXAMPLES) {
      expect(FINANCE_CALCULATORS[ex.ref], ex.id).toBeDefined();
    }
  });
  it('financeExamplesFor filters by ref', () => {
    const ci = financeExamplesFor('compound-interest');
    expect(ci.length).toBeGreaterThan(0);
    expect(ci.every((e) => e.ref === 'compound-interest')).toBe(true);
    expect(financeExamplesFor('does-not-exist')).toEqual([]);
  });
});

describe('field helpers + formatting branches', () => {
  it('isNumericField distinguishes select', () => {
    expect(isNumericField('currency')).toBe(true);
    expect(isNumericField('select')).toBe(false);
  });
  it('moneyWhole drops the cents', () => {
    expect(moneyWhole(1234.56, 'USD')).toBe('$1,235');
  });
});

// Exercise the validation + calculator branches that the happy-path tests miss, so branch coverage
// reflects the real guard logic (negative, out-of-range, optional-blank, already-met, caution tones).
describe('validation + calculator branches', () => {
  it('compound interest: rate over 100 is rejected, blank optional contribution is allowed', () => {
    expect(runFinance('compound-interest', { principal: 1000, rate: 150, frequency: '12', years: 10 }, USD).uiState).toBe('validation-error');
    const ok = runFinance('compound-interest', { principal: 1000, rate: 7, frequency: '12', years: 10, contribution: '' }, USD);
    expect(ok.ok).toBe(true);
  });

  it('compound interest: missing years and negative principal both fail', () => {
    expect(runFinance('compound-interest', { principal: 1000, rate: 7, frequency: '12', years: '' }, USD).ok).toBe(false);
    expect(runFinance('compound-interest', { principal: -5, rate: 7, frequency: '12', years: 10 }, USD).ok).toBe(false);
  });

  it('inflation: each input is validated', () => {
    expect(runFinance('inflation', { amount: '', rate: 3, years: 10 }, USD).ok).toBe(false);
    expect(runFinance('inflation', { amount: 1000, rate: 'x', years: 10 }, USD).ok).toBe(false);
    expect(runFinance('inflation', { amount: 1000, rate: 3, years: '' }, USD).ok).toBe(false);
    // high loss triggers the caution insight tone
    const r = runFinance('inflation', { amount: 100000, rate: 8, years: 30 }, USD);
    expect(r.insights!.some((i) => i.tone === 'caution')).toBe(true);
  });

  it('savings goal: zero years rejected, already-met returns zero, low-return path', () => {
    expect(runFinance('savings-goal', { goal: 50000, current: 0, rate: 6, years: 0 }, USD).ok).toBe(false);
    const met = runFinance('savings-goal', { goal: 1000, current: 5000, rate: 5, years: 3 }, USD);
    expect(met.hero!.raw).toBe(0);
    expect(met.milestones!.some((m) => m.id.startsWith('ms') && m.reached)).toBe(true);
  });

  it('emergency fund: complete vs partial progress', () => {
    const complete = runFinance('emergency-fund', { expenses: 1000, months: 3, saved: 5000 }, USD);
    expect(complete.insights!.some((i) => i.tone === 'positive')).toBe(true);
    const partial = runFinance('emergency-fund', { expenses: 1000, months: 6, saved: 1000 }, USD);
    expect(partial.metrics.find((m) => m.id === 'remaining')!.raw).toBe(5000);
  });

  it('rule of 72: low-rate caution branch (approximation drifts) and close-rate positive', () => {
    expect(runFinance('rule-of-72', { rate: 2 }, USD).insights!.some((i) => i.tone === 'caution')).toBe(true);
    expect(runFinance('rule-of-72', { rate: 8 }, USD).insights!.some((i) => i.tone === 'positive')).toBe(true);
  });
});
