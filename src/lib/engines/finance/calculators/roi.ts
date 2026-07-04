// ROI calculator. Simple return on investment (net gain over cost) with the figure incumbents
// skip: the annualized return when a holding period is given, so a 50% gain over 3 years can be
// compared honestly against yearly benchmarks. Handles losses as first-class results.

import type { FinanceCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { compoundAnnualGrowthRate } from '../models';
import { money, percent, roundMoney } from '../format';
import { number, positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

export const roi: FinanceCalculator = {
  id: 'roi',
  family: 'interest',
  capabilities: { timeline: false, loadExample: true, undo: true, visualization: false },
  fields: [
    { id: 'cost', label: 'Amount invested', type: 'currency', default: 10000, min: 0, presets: [
      { value: 1000 }, { value: 10000 }, { value: 100000 },
    ] },
    { id: 'final', label: 'Final value', type: 'currency', default: 15000, min: 0,
      help: 'What the investment is worth now, or what you sold it for.' },
    { id: 'years', label: 'Holding period', type: 'duration', default: 3, min: 0, max: 100, step: 0.5, suffix: 'years', optional: true,
      help: 'Optional. Adds the annualized return so you can compare against yearly benchmarks.' },
  ],
  scenarios: [
    { label: 'Stock position', values: { cost: 5000, final: 6500, years: 2 } },
    { label: 'Property sale', values: { cost: 200000, final: 260000, years: 5 } },
    { label: 'Losing trade', values: { cost: 10000, final: 8500, years: 1 } },
  ],

  calculate(input, { currency }) {
    const c = positive(input, 'cost', 'the amount invested');
    if (!c.ok) return c.result;
    const f = number(input, 'final', 'the final value', { min: 0 });
    if (!f.ok) return f.result;
    const y = number(input, 'years', 'the holding period', { optional: true, min: 0, max: 100 });
    if (!y.ok) return y.result;

    const cost = c.value;
    const final = f.value;
    const years = y.value;

    const gain = roundMoney(final - cost);
    const roiPct = roundMoney(((final - cost) / cost) * 100);
    // Annualized return only when there is a period and the maths is defined (a total loss has no
    // meaningful annual rate).
    const annualPct = years > 0 && final > 0
      ? roundMoney(compoundAnnualGrowthRate(cost, final, years) * 100)
      : null;

    const hero = card('roi', 'Return on investment', percent(roiPct), {
      raw: roiPct, emphasis: 'hero',
      note: gain >= 0 ? `a gain of ${money(gain, currency)}` : `a loss of ${money(Math.abs(gain), currency)}`,
    });
    const metrics: ResultCard[] = [
      card('gain', gain >= 0 ? 'Net gain' : 'Net loss', money(Math.abs(gain), currency), { raw: gain, emphasis: 'primary' }),
      card('final', 'Final value', money(final, currency), { raw: final }),
      ...(annualPct !== null
        ? [card('annualized', 'Annualized return', `${percent(annualPct)}/yr`, { raw: annualPct })]
        : []),
    ];

    const insights = [];
    if (gain > 0) {
      insights.push(insight(`Every ${money(100, currency)} you put in came back as ${money(roundMoney(100 * (final / cost)), currency)}.`, 'positive'));
    } else if (gain < 0) {
      insights.push(insight(`This position lost ${money(Math.abs(gain), currency)}, a ${percent(Math.abs(roiPct))} decline on what you paid.`, 'caution'));
    }
    if (annualPct !== null && years > 1) {
      insights.push(insight(`Simple ROI ignores time. Over ${years} years this works out to ${percent(annualPct)} a year, which is the number to compare against yearly benchmarks.`));
    } else if (years === 0) {
      insights.push(insight('Add a holding period to see the annualized return, the fair way to compare investments held for different lengths of time.'));
    }

    const milestones = [
      milestone('Investment at least doubled', final >= cost * 2),
      milestone('Came out ahead of what you paid', gain > 0),
    ];

    const assumptions = [
      assumption('Figures', 'before taxes and fees'),
      assumption('Cash flows', 'one buy-in, one exit, nothing in between'),
      assumption('Holding period', years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : 'not specified'),
    ];

    const decisions = [
      toolDecision('Turn this growth into a clean annual rate', 'cagr-calculator'),
      toolDecision('Project what this could grow into next', 'compound-interest-calculator'),
      toolDecision('Check the gain against inflation', 'inflation-calculator'),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones,
      assumptions,
      decisions,
      nextQuestions: [
        'What annual return does this work out to?',
        'How does this compare with leaving the money in an index fund?',
      ],
      explanation: `You invested ${money(cost, currency)} and ended with ${money(final, currency)}, a ${percent(Math.abs(roiPct))} ${gain >= 0 ? 'return' : 'loss'}${annualPct !== null ? ` (${percent(annualPct)} a year over ${years} ${years === 1 ? 'year' : 'years'})` : ''}.`,
      meta: { cost, final, roiPct, annualPct },
    });
  },
};
