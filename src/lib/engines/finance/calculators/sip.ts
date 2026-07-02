// SIP calculator. Future value of a Systematic Investment Plan: a fixed monthly investment
// compounding at an expected annual return, optionally on top of a starting lump sum. Emits the
// full story: hero + metrics + a yearly timeline + breakdown + insights + milestones + assumptions.

import type { FinanceCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard, TimelinePoint, BreakdownPart } from '@lib/results/types';
import { lineSpec } from '@lib/visualization/types';
import { futureValueCompound, futureValueAnnuity } from '../models';
import { money, percent, roundMoney } from '../format';
import { number, positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

export const sip: FinanceCalculator = {
  id: 'sip',
  family: 'savings',
  capabilities: { timeline: true, loadExample: true, undo: true, visualization: false },
  fields: [
    { id: 'monthly', label: 'Monthly investment', type: 'currency', default: 500, min: 0, presets: [
      { value: 100 }, { value: 500 }, { value: 1000 },
    ] },
    { id: 'rate', label: 'Expected annual return', type: 'percent', default: 10, min: 0, max: 100, step: 0.1, suffix: '%' },
    { id: 'years', label: 'Investment period', type: 'duration', default: 10, min: 0, max: 100, step: 1, suffix: 'years' },
    { id: 'initial', label: 'Starting lump sum', type: 'currency', default: 0, min: 0, optional: true,
      help: 'Optional. Invested once at the start, alongside the monthly plan.' },
  ],
  scenarios: [
    { label: 'First salary SIP', values: { monthly: 200, rate: 10, years: 20, initial: 0 } },
    { label: 'Wealth building', values: { monthly: 1000, rate: 11, years: 15, initial: 5000 } },
    { label: 'Short-term goal', values: { monthly: 750, rate: 8, years: 5, initial: 2000 } },
  ],

  calculate(input, { currency }) {
    const m = positive(input, 'monthly', 'a monthly investment');
    if (!m.ok) return m.result;
    const r = number(input, 'rate', 'an expected return', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    const y = positive(input, 'years', 'an investment period');
    if (!y.ok) return y.result;
    const init = number(input, 'initial', 'the starting lump sum', { optional: true, min: 0 });
    if (!init.ok) return init.result;

    const rate = r.value / 100;
    const years = y.value;
    const months = Math.round(years * 12);

    const fromSip = futureValueAnnuity(m.value, rate, 12, years);
    const fromLump = futureValueCompound(init.value, rate, 12, years);
    const finalValue = roundMoney(fromSip + fromLump);
    const totalInvested = roundMoney(m.value * months + init.value);
    const wealthGained = roundMoney(finalValue - totalInvested);

    const hero = card('final', 'Investment value', money(finalValue, currency), {
      raw: finalValue, emphasis: 'hero', note: `after ${years} ${years === 1 ? 'year' : 'years'}`,
    });
    const metrics: ResultCard[] = [
      card('gain', 'Wealth gained', money(Math.max(0, wealthGained), currency), { raw: Math.max(0, wealthGained), emphasis: 'primary' }),
      card('invested', 'Total invested', money(totalInvested, currency), { raw: totalInvested }),
      card('months', 'Instalments', `${months}`, { raw: months }),
    ];

    // Yearly timeline plus a chart-ready series.
    const timeline: TimelinePoint[] = [];
    const series: number[] = [];
    for (let yr = 0; yr <= years; yr++) {
      const bal = roundMoney(futureValueAnnuity(m.value, rate, 12, yr) + futureValueCompound(init.value, rate, 12, yr));
      series.push(bal);
      if (yr === 0 || yr === years || yr % Math.max(1, Math.round(years / 6)) === 0) {
        timeline.push({ year: yr, value: bal, display: money(bal, currency) });
      }
    }

    const breakdown: BreakdownPart[] = [
      ...(init.value > 0 ? [{ id: 'lump', label: 'Lump sum', value: roundMoney(init.value), display: money(init.value, currency) }] : []),
      { id: 'invested', label: 'Monthly instalments', value: roundMoney(m.value * months), display: money(m.value * months, currency) },
      { id: 'gain', label: 'Growth', value: Math.max(0, wealthGained), display: money(wealthGained, currency) },
    ];

    const insights = [];
    if (wealthGained > 0 && finalValue > 0) {
      const sharePct = (wealthGained / finalValue) * 100;
      insights.push(insight(`Market growth contributes ${Math.round(sharePct)}% of the final value; the rest is money you put in.`, sharePct >= 50 ? 'positive' : 'info'));
    }
    insights.push(insight('A SIP invests the same amount every month, so you buy more units when prices are low and fewer when they are high (rupee/dollar cost averaging).'));

    const milestones = [
      milestone('Value doubled your contributions', finalValue >= totalInvested * 2),
      milestone('Growth exceeds what you invested', wealthGained > totalInvested),
    ];

    const assumptions = [
      assumption('Expected return', percent(r.value)),
      assumption('Instalment timing', 'end of each month'),
      assumption('Compounding', 'monthly'),
      assumption('Starting lump sum', init.value > 0 ? money(init.value, currency) : 'none'),
    ];

    const decisions = [
      toolDecision('Check what this is worth after inflation', 'inflation-calculator'),
      toolDecision('Compare with a one-time lump sum', 'compound-interest-calculator'),
      toolDecision('Work backwards from a savings target', 'savings-goal-calculator'),
    ];

    return successResult({
      hero,
      metrics,
      timeline,
      series,
      breakdown,
      insights,
      milestones,
      assumptions,
      decisions,
      nextQuestions: [
        'What monthly SIP do I need to reach a specific target?',
        'How much difference does starting five years earlier make?',
      ],
      explanation: `Investing ${money(m.value, currency)} every month${init.value > 0 ? ` plus a ${money(init.value, currency)} lump sum` : ''} at an expected ${percent(r.value)} annual return grows to ${money(finalValue, currency)} after ${years} ${years === 1 ? 'year' : 'years'}. You invest ${money(totalInvested, currency)} in total; growth adds ${money(Math.max(0, wealthGained), currency)}.`,
      visualization: lineSpec('balance', series.map((v, i) => ({ x: i, y: v })), { kind: 'area', title: 'Investment value over time' }),
      meta: { years, finalValue, totalInvested },
    });
  },
};
