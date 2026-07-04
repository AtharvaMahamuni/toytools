// Finance formula registry — the formulas as reusable DATA (not embedded in calculators or guides).
// Guides cite a formula by id to render its expression/variables/assumptions; calculators reference
// the same id so the math and its explanation never drift.

export interface FinanceFormula {
  id: string;
  name: string;
  expression: string;
  variables: { symbol: string; meaning: string }[];
  explanation: string;
  assumptions: string[];
  limitations?: string[];
  references?: string[];
}

export const FINANCE_FORMULAS: Record<string, FinanceFormula> = {
  'compound-interest': {
    id: 'compound-interest',
    name: 'Compound interest (future value)',
    expression: 'FV = P (1 + r/n)^(n·t)',
    variables: [
      { symbol: 'P', meaning: 'Principal (initial amount)' },
      { symbol: 'r', meaning: 'Annual interest rate (decimal)' },
      { symbol: 'n', meaning: 'Compounding periods per year' },
      { symbol: 't', meaning: 'Number of years' },
    ],
    explanation:
      'Each period the balance earns interest, and the next period earns interest on that interest. More frequent compounding and more time both increase the final amount.',
    assumptions: ['Rate is constant', 'Interest is reinvested', 'No taxes or fees'],
  },
  'annuity-future-value': {
    id: 'annuity-future-value',
    name: 'Future value of regular contributions',
    expression: 'FV = PMT · [((1 + i)^N − 1) / i]',
    variables: [
      { symbol: 'PMT', meaning: 'Contribution each period' },
      { symbol: 'i', meaning: 'Periodic rate (r/n)' },
      { symbol: 'N', meaning: 'Total number of periods (n·t)' },
    ],
    explanation:
      'Regular contributions each grow by compounding for the time remaining. The series sums to a closed form that this tool evaluates.',
    assumptions: ['Contributions are made at the end of each period', 'Rate is constant'],
  },
  'sinking-fund': {
    id: 'sinking-fund',
    name: 'Required regular saving (sinking fund)',
    expression: 'PMT = (FV − P(1 + i)^N) · i / ((1 + i)^N − 1)',
    variables: [
      { symbol: 'FV', meaning: 'Savings goal (target amount)' },
      { symbol: 'P', meaning: 'Current savings' },
      { symbol: 'i', meaning: 'Monthly rate (annual / 12)' },
      { symbol: 'N', meaning: 'Number of months' },
    ],
    explanation:
      'Solves the contribution needed each month so that current savings plus future contributions, both compounding, reach the goal exactly on time.',
    assumptions: ['Return is constant', 'Contributions are monthly'],
  },
  'inflation-real-value': {
    id: 'inflation-real-value',
    name: 'Purchasing power after inflation',
    expression: 'Real = Amount / (1 + f)^t',
    variables: [
      { symbol: 'Amount', meaning: "Today's nominal amount" },
      { symbol: 'f', meaning: 'Annual inflation rate (decimal)' },
      { symbol: 't', meaning: 'Number of years' },
    ],
    explanation:
      'Inflation erodes what money can buy. Dividing by the cumulative inflation factor gives the future amount expressed in today’s purchasing power.',
    assumptions: ['Inflation rate is constant'],
  },
  'roi': {
    id: 'roi',
    name: 'Return on investment',
    expression: 'ROI% = (V − C) / C × 100',
    variables: [
      { symbol: 'V', meaning: 'Final value of the investment' },
      { symbol: 'C', meaning: 'Cost (amount invested)' },
    ],
    explanation:
      'The net gain or loss expressed as a share of what the investment cost. It answers "how much did I make on what I put in" but says nothing about how long the money was tied up.',
    assumptions: ['One buy-in and one exit, no interim cash flows', 'Figures are before taxes and fees'],
    limitations: ['Ignores time; use the annualized form ((V/C)^(1/t) − 1) to compare different holding periods'],
  },
  'cagr': {
    id: 'cagr',
    name: 'Compound annual growth rate',
    expression: 'CAGR = (End / Start)^(1/t) − 1',
    variables: [
      { symbol: 'Start', meaning: 'Value at the beginning of the period' },
      { symbol: 'End', meaning: 'Value at the end of the period' },
      { symbol: 't', meaning: 'Number of years' },
    ],
    explanation:
      'The constant yearly rate that would grow the starting value into the ending value in exactly t years. It smooths out year-to-year swings into one comparable number.',
    assumptions: ['Growth compounds annually at a constant rate', 'No money is added or withdrawn during the period'],
    limitations: ['Hides volatility: very different paths can share the same CAGR'],
  },
  'rule-of-72': {
    id: 'rule-of-72',
    name: 'Rule of 72 (doubling time)',
    expression: 'Years ≈ 72 / rate%',
    variables: [
      { symbol: 'rate%', meaning: 'Annual growth rate as a percent' },
    ],
    explanation:
      'A mental shortcut: dividing 72 by the percentage growth rate estimates how many years it takes for an amount to double. It is most accurate for rates between roughly 6% and 10%.',
    assumptions: ['Growth compounds annually', 'Rate is constant'],
    limitations: ['An approximation; the exact doubling time uses ln(2)/ln(1+r)'],
  },
};

export function getFormula(id: string): FinanceFormula | undefined {
  return FINANCE_FORMULAS[id];
}
