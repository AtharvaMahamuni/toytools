import { describe, expect, it } from 'vitest';
import { LAZY_FINANCE_IDS, loadFinanceCalculator, runLazyFinance } from './lazy';
import { FINANCE_CALCULATORS, runFinance } from './registry';
import { FINANCE_EXAMPLES } from './examples';

// Card ids count up per call, so the comparison is on what the page shows.
const shown = (r: ReturnType<typeof runLazyFinance>) => JSON.stringify([r.uiState, r.hero, r.metrics, r.error, r.explanation]);

describe('finance lazy loading', () => {
  it('has one loader per registry id', () => {
    expect([...LAZY_FINANCE_IDS].sort()).toEqual(Object.keys(FINANCE_CALCULATORS).sort());
  });

  it('an id is unknown until loaded, then runs exactly like the registry', async () => {
    const id = Object.keys(FINANCE_CALCULATORS)[0]!;
    expect(runLazyFinance(id, {}, {} as never).uiState).toBe('calculation-error');
    for (const each of Object.keys(FINANCE_CALCULATORS)) {
      await loadFinanceCalculator(each);
      await loadFinanceCalculator(each);
      const input = FINANCE_EXAMPLES.find((ex) => ex.ref === each)?.inputs ?? {};
      expect(shown(runLazyFinance(each, input as never, {} as never)), each).toBe(shown(runFinance(each, input as never, {} as never)));
    }
  });

  it('an unknown id stays an error', async () => {
    await loadFinanceCalculator('nope');
    expect(runLazyFinance('nope', {}, {} as never).uiState).toBe('calculation-error');
  });
});
