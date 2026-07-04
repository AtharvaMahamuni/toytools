// CAGR calculator. The constant yearly rate that takes a value from start to end over a period,
// computed live (incumbents bury the formula in articles). Emits the growth story: hero rate,
// total growth, doubling time, and the smoothed year-by-year path the rate implies.

import type { FinanceCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard, TimelinePoint } from '@lib/results/types';
import { lineSpec } from '@lib/visualization/types';
import { compoundAnnualGrowthRate, doublingTime } from '../models';
import { money, percent, roundMoney, years as formatYears } from '../format';
import { positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

export const cagr: FinanceCalculator = {
  id: 'cagr',
  family: 'interest',
  capabilities: { timeline: true, loadExample: true, undo: true, visualization: false },
  fields: [
    { id: 'start', label: 'Starting value', type: 'currency', default: 10000, min: 0, presets: [
      { value: 1000 }, { value: 10000 }, { value: 100000 },
    ] },
    { id: 'end', label: 'Ending value', type: 'currency', default: 25000, min: 0 },
    { id: 'years', label: 'Period', type: 'duration', default: 10, min: 0, max: 100, step: 0.5, suffix: 'years' },
  ],
  scenarios: [
    { label: 'Index fund decade', values: { start: 10000, end: 25000, years: 10 } },
    { label: 'Fast-growing revenue', values: { start: 50000, end: 400000, years: 4 } },
    { label: 'Slow saver', values: { start: 5000, end: 6000, years: 5 } },
  ],

  calculate(input, { currency }) {
    const s = positive(input, 'start', 'a starting value');
    if (!s.ok) return s.result;
    const e = positive(input, 'end', 'an ending value');
    if (!e.ok) return e.result;
    const y = positive(input, 'years', 'a period');
    if (!y.ok) return y.result;

    const start = s.value;
    const end = e.value;
    const totalYears = y.value;

    const rate = compoundAnnualGrowthRate(start, end, totalYears);
    const cagrPct = roundMoney(rate * 100);
    const growthPct = roundMoney(((end - start) / start) * 100);
    const multiple = roundMoney(end / start);
    const doubleIn = doublingTime(rate);

    const hero = card('cagr', 'Compound annual growth rate', percent(cagrPct), {
      raw: cagrPct, emphasis: 'hero', note: `per year for ${formatYears(totalYears)}`,
    });
    const metrics: ResultCard[] = [
      card('growth', growthPct >= 0 ? 'Total growth' : 'Total decline', percent(Math.abs(growthPct)), { raw: growthPct, emphasis: 'primary' }),
      card('multiple', 'Growth multiple', `${multiple}×`, { raw: multiple }),
      ...(rate > 0
        ? [card('doubling', 'Doubles every', formatYears(doubleIn), { raw: roundMoney(doubleIn) })]
        : []),
    ];

    // The smoothed path the rate implies: start compounding at CAGR for each whole year.
    const wholeYears = Math.floor(totalYears);
    const timeline: TimelinePoint[] = [];
    const series: number[] = [];
    for (let yr = 0; yr <= wholeYears; yr++) {
      const val = roundMoney(start * Math.pow(1 + rate, yr));
      series.push(val);
      if (yr === 0 || yr === wholeYears || yr % Math.max(1, Math.round(wholeYears / 6)) === 0) {
        timeline.push({ year: yr, value: val, display: money(val, currency) });
      }
    }

    const insights = [];
    if (cagrPct > 0) {
      insights.push(insight(`Total growth of ${percent(Math.abs(growthPct))} over ${formatYears(totalYears)} works out to ${percent(cagrPct)} a year, less than dividing by the years because growth compounds.`, 'positive'));
    } else if (cagrPct < 0) {
      insights.push(insight(`The value shrank by ${percent(Math.abs(cagrPct))} a year on average over this period.`, 'caution'));
    }
    if (totalYears < 1) {
      insights.push(insight('Annualizing a period shorter than a year extrapolates a small window into a full year, so treat this rate with caution.', 'caution'));
    }
    insights.push(insight('CAGR assumes smooth, steady growth. Real returns vary year to year; this is the average that gets you from start to end.'));

    const milestones = [
      milestone('Value at least doubled over the period', end >= start * 2),
      milestone('Double-digit annual growth', cagrPct >= 10),
    ];

    const assumptions = [
      assumption('Growth', 'constant and compounding annually'),
      assumption('Cash flows', 'nothing added or withdrawn during the period'),
      assumption('Figures', 'before taxes and fees'),
    ];

    const decisions = [
      toolDecision('See the simple total return instead', 'roi-calculator'),
      toolDecision('Estimate doubling time with the Rule of 72', 'rule-of-72-calculator'),
      toolDecision('Project forward at this rate', 'compound-interest-calculator'),
    ];

    return successResult({
      hero,
      metrics,
      ...(wholeYears >= 1 ? { timeline, series } : {}),
      insights,
      milestones,
      assumptions,
      decisions,
      nextQuestions: [
        'What would this rate grow my money into over the next decade?',
        'Is this before or after inflation?',
      ],
      explanation: `Growing from ${money(start, currency)} to ${money(end, currency)} over ${formatYears(totalYears)} is a compound annual growth rate of ${percent(cagrPct)}: the steady yearly rate that produces the same overall ${growthPct >= 0 ? 'gain' : 'decline'}.`,
      ...(wholeYears >= 1 ? { visualization: lineSpec('balance', series.map((v, i) => ({ x: i, y: v })), { kind: 'area', title: 'The smoothed growth path this rate implies' }) } : {}),
      meta: { start, end, years: totalYears, cagrPct },
    });
  },
};
