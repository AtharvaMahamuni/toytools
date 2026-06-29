// Emergency Fund calculator. Recommends a cash buffer (months of expenses), shows progress against
// current savings, and the amount remaining.

import type { FinanceCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard, BreakdownPart } from '@lib/results/types';
import { progressSpec } from '@lib/visualization/types';
import { money, percent, roundMoney } from '../format';
import { number, positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

export const emergencyFund: FinanceCalculator = {
  id: 'emergency-fund',
  family: 'savings',
  capabilities: { loadExample: true, undo: true },
  fields: [
    { id: 'expenses', label: 'Monthly expenses', type: 'currency', default: 3000, min: 0, presets: [
      { label: '$2k', value: 2000 }, { label: '$3k', value: 3000 }, { label: '$5k', value: 5000 },
    ] },
    { id: 'months', label: 'Months of cover', type: 'integer', default: 6, min: 1, max: 24, step: 1, suffix: 'months', presets: [
      { label: '3', value: 3 }, { label: '6', value: 6 }, { label: '12', value: 12 },
    ] },
    { id: 'saved', label: 'Current emergency savings', type: 'currency', default: 0, min: 0, optional: true },
  ],
  scenarios: [
    { label: 'Student', values: { expenses: 1200, months: 3, saved: 500 } },
    { label: 'Family', values: { expenses: 4500, months: 6, saved: 8000 } },
    { label: 'Freelancer', values: { expenses: 3000, months: 12, saved: 5000 } },
  ],

  calculate(input, { currency }) {
    const expenses = positive(input, 'expenses', 'your monthly expenses');
    if (!expenses.ok) return expenses.result;
    const months = positive(input, 'months', 'a number of months');
    if (!months.ok) return months.result;
    const saved = number(input, 'saved', 'current savings', { optional: true, min: 0 });
    if (!saved.ok) return saved.result;

    const recommended = roundMoney(expenses.value * months.value);
    const remaining = roundMoney(Math.max(0, recommended - saved.value));
    const progressPct = recommended > 0 ? Math.min(100, (saved.value / recommended) * 100) : 0;
    const complete = saved.value >= recommended;

    const hero = card('recommended', 'Recommended fund', money(recommended, currency), {
      raw: recommended, emphasis: 'hero', note: `${months.value} months of expenses`,
    });
    const metrics: ResultCard[] = [
      card('progress', 'Progress', percent(progressPct), { raw: roundMoney(progressPct), emphasis: 'primary' }),
      card('remaining', 'Still to save', money(remaining, currency), { raw: remaining }),
      card('saved', 'Saved so far', money(saved.value, currency), { raw: roundMoney(saved.value) }),
    ];

    const breakdown: BreakdownPart[] = [
      { id: 'saved', label: 'Saved', value: Math.min(saved.value, recommended), display: money(Math.min(saved.value, recommended), currency) },
      { id: 'remaining', label: 'Remaining', value: remaining, display: money(remaining, currency) },
    ];

    return successResult({
      hero,
      metrics,
      breakdown,
      insights: [
        complete
          ? insight('Your emergency fund is fully funded. That is a strong financial safety net.', 'positive')
          : insight(`You are ${percent(progressPct)} of the way there, with ${money(remaining, currency)} to go.`),
        insight('A common guideline is three to six months of expenses, more if your income is variable.'),
      ],
      milestones: [
        milestone('Emergency fund complete', complete),
        milestone('Halfway funded', progressPct >= 50),
      ],
      assumptions: [
        assumption('Monthly expenses', money(expenses.value, currency)),
        assumption('Target cover', `${months.value} months`),
      ],
      decisions: [
        toolDecision('Plan monthly saving to close the gap', 'savings-goal-calculator'),
        toolDecision('Grow surplus cash with compounding', 'compound-interest-calculator'),
      ],
      nextQuestions: ['How much should I save each month to finish this?', 'Where should I keep my emergency fund?'],
      explanation: `With ${money(expenses.value, currency)} in monthly expenses, a ${months.value}-month emergency fund is ${money(recommended, currency)}.${complete ? ' You have already reached it.' : ` You have ${money(saved.value, currency)} saved, leaving ${money(remaining, currency)}.`}`,
      visualization: progressSpec(saved.value, recommended, { title: 'Emergency fund progress' }),
      meta: { recommended, remaining },
    });
  },
};
