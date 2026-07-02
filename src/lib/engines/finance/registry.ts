// Finance Engine registry — single source of truth. The shared FinanceWidget never imports a
// calculator directly: it calls ToyTools.runFinance(id, input, opts), which resolves through
// runFinance() below. The widget also reads the build-time field schema via financeFields().
//
// Adding a calculator: create the file, add one import + one entry. Keys are the processorIds.

import type { FinanceCalculator, FinanceInput, FinanceOpts, FinanceResult, FinanceFieldDef } from './types';
import { calculationError } from '@lib/results/index';
import { compoundInterest } from './calculators/compound-interest';
import { ruleOf72Calc } from './calculators/rule-of-72';
import { inflation } from './calculators/inflation';
import { savingsGoal } from './calculators/savings-goal';
import { emergencyFund } from './calculators/emergency-fund';
import { sip } from './calculators/sip';

export const FINANCE_CALCULATORS: Record<string, FinanceCalculator> = {
  'compound-interest': compoundInterest,
  'rule-of-72': ruleOf72Calc,
  'inflation': inflation,
  'savings-goal': savingsGoal,
  'emergency-fund': emergencyFund,
  'sip': sip,
};

/**
 * Resolve a calculator by id and run it. Never throws: an unknown id (or an unexpected exception
 * inside a calculator) returns a calculation-error result so the experience layer renders uniformly.
 *
 * `runFinanceBatch` is a reserved future seam: today every call is a single calculation, but the
 * 1-call signature is stable so a batch API can be added later without breaking callers.
 */
export function runFinance(id: string, input: FinanceInput, opts: FinanceOpts): FinanceResult {
  const calc = FINANCE_CALCULATORS[id];
  if (!calc) {
    // eslint-disable-next-line no-console
    console.warn(`[finance] Unknown calculator id "${id}".`);
    return calculationError('Unknown calculator');
  }
  try {
    return calc.calculate(input, opts);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[finance] Calculator "${id}" threw:`, err);
    return calculationError('Could not complete this calculation');
  }
}

/** Build-time field schema for the widget frontmatter. Never throws; unknown id -> []. */
export function financeFields(id: string): FinanceFieldDef[] {
  return FINANCE_CALCULATORS[id]?.fields ?? [];
}

/** The full calculator definition (fields, scenarios, layout, capabilities) for the widget. */
export function getFinanceCalculator(id: string): FinanceCalculator | undefined {
  return FINANCE_CALCULATORS[id];
}
