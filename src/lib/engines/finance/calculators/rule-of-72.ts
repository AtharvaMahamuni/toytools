// Rule of 72 calculator. Estimates how long an amount takes to double at a given annual growth rate,
// and contrasts the shortcut with the exact doubling time. A comparison table lives in the explanation.

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { ruleOf72 } from '../models';
import { years as fmtYears, percent } from '../format';
import { number } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

/** Exact doubling time for comparison: ln(2)/ln(1+r). */
function exactDoubling(ratePercent: number): number {
  const r = ratePercent / 100;
  return Math.log(2) / Math.log(1 + r);
}

export const ruleOf72Calc: FinanceCalculator = {
  id: 'rule-of-72',
  family: 'interest',
  capabilities: { loadExample: true, undo: true },
  fields: [
    { id: 'rate', label: 'Annual growth rate', type: 'percent', default: 8, min: 0, max: 100, step: 0.1, suffix: '%', presets: [
      { label: '4%', value: 4 }, { label: '7%', value: 7 }, { label: '10%', value: 10 },
    ] },
  ],

  calculate(input, _opts) {
    const r = number(input, 'rate', 'a growth rate', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    if (r.value <= 0) return validationError('Enter a growth rate above zero to estimate doubling time.');

    const approx = ruleOf72(r.value);
    const exact = exactDoubling(r.value);

    const hero = card('doubling', 'Time to double', fmtYears(approx), { raw: Number(approx.toFixed(2)), emphasis: 'hero', note: `at ${percent(r.value)} a year` });
    const metrics: ResultCard[] = [
      card('exact', 'Exact doubling time', fmtYears(exact), { raw: Number(exact.toFixed(2)), emphasis: 'primary' }),
      card('quadruple', 'Time to quadruple', fmtYears(approx * 2), { raw: Number((approx * 2).toFixed(2)) }),
    ];

    const insights = [
      insight(`At ${percent(r.value)}, money doubles about every ${fmtYears(approx)} using the Rule of 72.`),
    ];
    const diff = Math.abs(approx - exact);
    insights.push(insight(diff < 0.4
      ? 'The Rule of 72 is very close to the exact answer at this rate.'
      : 'The Rule of 72 is a rough shortcut; the exact figure differs more at very high or low rates.', diff < 0.4 ? 'positive' : 'caution'));

    const assumptions = [
      assumption('Growth rate', percent(r.value)),
      assumption('Compounding', 'annual'),
    ];

    // A small comparison table rendered in the explanation (presentation-independent).
    const rows = [4, 6, 8, 10, 12].map((rate) => `${rate}% -> ${fmtYears(ruleOf72(rate))}`).join(', ');

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [milestone('Doubles within 10 years', approx <= 10, Math.round(approx))],
      assumptions,
      decisions: [
        toolDecision('Project the actual growth of an amount', 'compound-interest-calculator'),
        toolDecision('Check inflation against this growth', 'inflation-calculator'),
      ],
      nextQuestions: ['How much will a specific amount grow to?', 'Does this beat inflation?'],
      explanation: `The Rule of 72 divides 72 by the growth rate to estimate doubling time. At common rates: ${rows}.`,
      meta: { rate: r.value, doubling: Number(approx.toFixed(2)) },
    });
  },
};
