// Phase C PR 2 item 3: a negative rate gets a clear error, never a silent 0%.
import { describe, it, expect } from 'vitest';
import { getFinanceCalculator } from './registry';

const run = (id: string, input: Record<string, unknown>) =>
  getFinanceCalculator(id)!.calculate(input as never, { currency: 'USD' } as never);

describe('negative rates (item 3)', () => {
  for (const [id, input, word] of [
    ['compound-interest', { principal: 1000, rate: -2, frequency: '12', years: 5, contribution: 0 }, 'interest rate'],
    ['inflation', { amount: 1000, rate: -2, years: 5 }, 'inflation rate'],
    ['sip', { monthly: 100, rate: -2, years: 5, initial: 0 }, 'expected return'],
  ] as const) {
    it(`${id} refuses -2% with a clear message`, () => {
      const r = run(id, input) as { ok?: boolean; error?: string } & Record<string, unknown>;
      const text = JSON.stringify(r);
      expect(text).toMatch(new RegExp(`${word} cannot be negative\\. Enter 0 or more\\.`, 'i'));
    });
  }
});
