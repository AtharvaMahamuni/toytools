// Finance worked examples — finance's data for the platform example registry. One source of truth for
// guides, the widget Load Example action, and tests (finance.test.ts re-runs each and asserts `expect`).

import { buildExampleRegistry, examplesForRef, type WorkedExample } from '@lib/examples/types';
import type { FinanceInput } from './types';

export const FINANCE_EXAMPLES: WorkedExample<FinanceInput>[] = [
  {
    id: 'compound-interest-basic',
    engine: 'finance',
    ref: 'compound-interest',
    title: '$10,000 at 7% for 20 years',
    inputs: { principal: 10000, rate: 7, frequency: '12', years: 20, contribution: 0 },
    expect: { final: 40387.39 },
    narrative: '$10,000 left to compound monthly at 7% grows to about $40,387 in 20 years, with no extra contributions.',
  },
  {
    id: 'compound-interest-contrib',
    engine: 'finance',
    ref: 'compound-interest',
    title: '$1,000 + $200/mo at 8% for 30 years',
    inputs: { principal: 1000, rate: 8, frequency: '12', years: 30, contribution: 200 },
    narrative: 'Adding $200 a month for 30 years at 8% shows how regular contributions dominate the final balance.',
  },
  {
    id: 'savings-goal-basic',
    engine: 'finance',
    ref: 'savings-goal',
    title: 'Save $50,000 in 5 years',
    inputs: { goal: 50000, current: 5000, rate: 6, years: 5 },
    narrative: 'Reaching a $50,000 goal in 5 years with $5,000 saved and a 6% return needs a steady monthly amount.',
  },
  {
    id: 'sip-basic',
    engine: 'finance',
    ref: 'sip',
    title: '$500/mo at 10% for 10 years',
    inputs: { monthly: 500, rate: 10, years: 10, initial: 0 },
    expect: { final: 102422.49, invested: 60000, gain: 42422.49 },
    narrative: 'A $500 monthly SIP at a 10% expected return grows to about $102,422 in 10 years, of which $60,000 is your own money.',
  },
  {
    id: 'sip-with-lump-sum',
    engine: 'finance',
    ref: 'sip',
    title: '$1,000/mo + $5,000 lump sum at 11% for 15 years',
    inputs: { monthly: 1000, rate: 11, years: 15, initial: 5000 },
    narrative: 'Pairing a monthly SIP with a starting lump sum shows how both streams compound side by side.',
  },
  {
    id: 'emergency-fund-basic',
    engine: 'finance',
    ref: 'emergency-fund',
    title: '6 months at $3,000/mo',
    inputs: { expenses: 3000, months: 6, saved: 4000 },
    expect: { recommended: 18000, remaining: 14000 },
    narrative: 'Six months of $3,000 expenses is an $18,000 target; with $4,000 saved, $14,000 remains.',
  },
  {
    id: 'inflation-basic',
    engine: 'finance',
    ref: 'inflation',
    title: '$100,000 after 25 years at 3%',
    inputs: { amount: 100000, rate: 3, years: 25 },
    expect: { real: 47760.56 },
    narrative: '$100,000 keeps the buying power of about $47,761 after 25 years of 3% inflation.',
  },
  {
    id: 'roi-basic',
    engine: 'finance',
    ref: 'roi',
    title: '$10,000 in, $15,000 out over 3 years',
    inputs: { cost: 10000, final: 15000, years: 3 },
    expect: { roi: 50, gain: 5000, annualized: 14.47 },
    narrative: 'Turning $10,000 into $15,000 is a 50% return; held for 3 years, that works out to about 14.5% a year.',
  },
  {
    id: 'roi-loss',
    engine: 'finance',
    ref: 'roi',
    title: 'A $10,000 position sold at $8,500',
    inputs: { cost: 10000, final: 8500, years: '' },
    expect: { roi: -15, gain: -1500 },
    narrative: 'Selling a $10,000 position at $8,500 is a $1,500 loss, or -15% on what you paid.',
  },
  {
    id: 'cagr-basic',
    engine: 'finance',
    ref: 'cagr',
    title: '$10,000 to $25,000 in 10 years',
    inputs: { start: 10000, end: 25000, years: 10 },
    expect: { cagr: 9.6, growth: 150, multiple: 2.5 },
    narrative: 'Growing $10,000 into $25,000 over a decade is 150% total growth, but only about 9.6% a year once compounding is accounted for.',
  },
  {
    id: 'rule-of-72-basic',
    engine: 'finance',
    ref: 'rule-of-72',
    title: 'Doubling time at 8%',
    inputs: { rate: 8 },
    expect: { doubling: 9 },
    narrative: 'At 8% a year, money doubles in roughly 9 years (72 / 8).',
  },
];

export const FINANCE_EXAMPLE_MAP = buildExampleRegistry(FINANCE_EXAMPLES);

export function financeExamplesFor(ref: string): WorkedExample<FinanceInput>[] {
  return examplesForRef(FINANCE_EXAMPLES, 'finance', ref);
}
