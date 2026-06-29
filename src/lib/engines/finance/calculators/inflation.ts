// Inflation calculator. Shows what an amount today will be worth in future purchasing power, the value
// lost to inflation, and the future nominal cost of the same basket.

import type { FinanceCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard, TimelinePoint } from '@lib/results/types';
import { realValueAfterInflation, nominalValueAfterInflation } from '../models';
import { money, percent, roundMoney } from '../format';
import { number, positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

export const inflation: FinanceCalculator = {
  id: 'inflation',
  family: 'inflation',
  capabilities: { timeline: true, loadExample: true, undo: true },
  fields: [
    { id: 'amount', label: 'Amount today', type: 'currency', default: 100000, min: 0, presets: [
      { label: '$10k', value: 10000 }, { label: '$100k', value: 100000 }, { label: '$1m', value: 1000000 },
    ] },
    { id: 'rate', label: 'Annual inflation rate', type: 'percent', default: 3, min: 0, max: 100, step: 0.1, suffix: '%', presets: [
      { label: '2%', value: 2 }, { label: '3%', value: 3 }, { label: '6%', value: 6 },
    ] },
    { id: 'years', label: 'Years', type: 'duration', default: 25, min: 0, max: 100, step: 1, suffix: 'years' },
  ],

  calculate(input, { currency }) {
    const a = positive(input, 'amount', 'an amount');
    if (!a.ok) return a.result;
    const r = number(input, 'rate', 'an inflation rate', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    const y = number(input, 'years', 'a number of years', { min: 0, max: 100 });
    if (!y.ok) return y.result;

    const rate = r.value / 100;
    const real = roundMoney(realValueAfterInflation(a.value, rate, y.value));
    const lost = roundMoney(a.value - real);
    const futureCost = roundMoney(nominalValueAfterInflation(a.value, rate, y.value));
    const lostPct = a.value > 0 ? (lost / a.value) * 100 : 0;

    const hero = card('real', 'Future purchasing power', money(real, currency), { raw: real, emphasis: 'hero', note: `in today’s money after ${y.value} ${y.value === 1 ? 'year' : 'years'}` });
    const metrics: ResultCard[] = [
      card('lost', 'Value lost to inflation', money(lost, currency), { raw: lost, emphasis: 'primary' }),
      card('lostpct', 'Purchasing power lost', percent(lostPct), { raw: roundMoney(lostPct) }),
      card('cost', 'Future cost of the same goods', money(futureCost, currency), { raw: futureCost }),
    ];

    const timeline: TimelinePoint[] = [];
    for (let yr = 0; yr <= y.value; yr++) {
      if (yr === 0 || yr === y.value || yr % Math.max(1, Math.round(y.value / 6)) === 0) {
        const v = roundMoney(realValueAfterInflation(a.value, rate, yr));
        timeline.push({ year: yr, value: v, display: money(v, currency) });
      }
    }

    return successResult({
      hero,
      metrics,
      timeline,
      insights: [
        insight(`Inflation quietly removes about ${percent(lostPct)} of this amount’s buying power over ${y.value} ${y.value === 1 ? 'year' : 'years'}.`, lostPct > 30 ? 'caution' : 'info'),
        insight('Inflation usually has a larger impact than people expect, which is why beating it with returns matters.'),
      ],
      milestones: [
        milestone('Purchasing power halved', real <= a.value / 2, Math.round(y.value)),
      ],
      assumptions: [
        assumption('Inflation rate', percent(r.value)),
        assumption('Period', `${y.value} ${y.value === 1 ? 'year' : 'years'}`),
      ],
      decisions: [
        toolDecision('Find a return that beats inflation', 'compound-interest-calculator'),
        toolDecision('See how fast money doubles', 'rule-of-72-calculator'),
      ],
      nextQuestions: ['What return do I need to keep up with inflation?', 'How much should I save to offset this?'],
      explanation: `At ${percent(r.value)} inflation, ${money(a.value, currency)} today will buy what ${money(real, currency)} buys now, after ${y.value} ${y.value === 1 ? 'year' : 'years'}. The same goods would nominally cost ${money(futureCost, currency)}.`,
      meta: { years: y.value, real },
    });
  },
};
