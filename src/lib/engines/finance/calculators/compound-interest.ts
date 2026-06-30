// Compound Interest calculator. Future value of a principal (optionally with monthly contributions)
// under periodic compounding. Emits the full story: hero + metrics + a yearly timeline + breakdown +
// insights + milestones + assumptions + decisions.

import type { FinanceCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard, TimelinePoint, BreakdownPart } from '@lib/results/types';
import { lineSpec } from '@lib/visualization/types';
import { futureValueCompound, futureValueAnnuity } from '../models';
import { money, percent, roundMoney } from '../format';
import { number, positive, choice } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

const FREQUENCY_LABEL: Record<string, string> = {
  '1': 'annually',
  '4': 'quarterly',
  '12': 'monthly',
  '365': 'daily',
};

export const compoundInterest: FinanceCalculator = {
  id: 'compound-interest',
  family: 'interest',
  capabilities: { timeline: true, loadExample: true, undo: true, visualization: false },
  fields: [
    { id: 'principal', label: 'Initial amount', type: 'currency', default: 10000, min: 0, presets: [
      { value: 1000 }, { value: 10000 }, { value: 50000 },
    ] },
    { id: 'rate', label: 'Annual interest rate', type: 'percent', default: 7, min: 0, max: 100, step: 0.1, suffix: '%' },
    { id: 'frequency', label: 'Compounding frequency', type: 'select', default: '12', options: [
      { value: '1', label: 'Annually' }, { value: '4', label: 'Quarterly' },
      { value: '12', label: 'Monthly' }, { value: '365', label: 'Daily' },
    ] },
    { id: 'years', label: 'Years', type: 'duration', default: 20, min: 0, max: 100, step: 1, suffix: 'years' },
    { id: 'contribution', label: 'Monthly contribution', type: 'currency', default: 0, min: 0, optional: true,
      help: 'Optional. Added at the end of each month.' },
  ],
  scenarios: [
    { label: 'Retirement', values: { principal: 20000, rate: 7, frequency: '12', years: 30, contribution: 500 } },
    { label: 'Child education', values: { principal: 5000, rate: 6, frequency: '12', years: 15, contribution: 200 } },
    { label: 'Dream house', values: { principal: 30000, rate: 5, frequency: '12', years: 10, contribution: 800 } },
  ],

  calculate(input, { currency }) {
    const p = positive(input, 'principal', 'an initial amount');
    if (!p.ok) return p.result;
    const r = number(input, 'rate', 'an interest rate', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    const y = number(input, 'years', 'a number of years', { min: 0, max: 100 });
    if (!y.ok) return y.result;
    const c = number(input, 'contribution', 'the monthly contribution', { optional: true, min: 0 });
    if (!c.ok) return c.result;

    const n = Number(choice(input, 'frequency', '12'));
    const rate = r.value / 100;
    const years = y.value;

    const fromPrincipal = futureValueCompound(p.value, rate, n, years);
    const fromContrib = futureValueAnnuity(c.value, rate, n, years);
    const finalAmount = roundMoney(fromPrincipal + fromContrib);
    const totalContrib = roundMoney(c.value * 12 * years);
    const principalInvested = roundMoney(p.value);
    const interestEarned = roundMoney(finalAmount - principalInvested - totalContrib);

    const hero = card('final', 'Final amount', money(finalAmount, currency), { raw: finalAmount, emphasis: 'hero', note: `after ${years} ${years === 1 ? 'year' : 'years'}` });
    const metrics: ResultCard[] = [
      card('interest', 'Interest earned', money(interestEarned, currency), { raw: interestEarned, emphasis: 'primary' }),
      card('principal', 'Principal invested', money(principalInvested, currency), { raw: principalInvested }),
    ];
    if (totalContrib > 0) metrics.push(card('contributions', 'Total contributions', money(totalContrib, currency), { raw: totalContrib }));

    // Yearly timeline (and a chart-ready series for the future).
    const timeline: TimelinePoint[] = [];
    const series: number[] = [];
    for (let yr = 0; yr <= years; yr++) {
      const bal = roundMoney(futureValueCompound(p.value, rate, n, yr) + futureValueAnnuity(c.value, rate, n, yr));
      series.push(bal);
      if (yr === 0 || yr === years || yr % Math.max(1, Math.round(years / 6)) === 0) {
        timeline.push({ year: yr, value: bal, display: money(bal, currency) });
      }
    }

    const breakdown: BreakdownPart[] = [
      { id: 'principal', label: 'Principal', value: principalInvested, display: money(principalInvested, currency) },
      ...(totalContrib > 0 ? [{ id: 'contrib', label: 'Contributions', value: totalContrib, display: money(totalContrib, currency) }] : []),
      { id: 'interest', label: 'Interest', value: Math.max(0, interestEarned), display: money(interestEarned, currency) },
    ];

    const invested = principalInvested + totalContrib;
    const insights = [];
    if (interestEarned > 0 && invested > 0) {
      const sharePct = (interestEarned / finalAmount) * 100;
      insights.push(insight(`Interest makes up ${Math.round(sharePct)}% of your final balance; the rest is money you put in.`, sharePct >= 50 ? 'positive' : 'info'));
    }
    if (totalContrib > 0) {
      insights.push(insight('Most of your final wealth tends to come from compounding over time rather than the initial deposit.'));
    }

    const milestones = [
      milestone('Money doubled', finalAmount >= principalInvested * 2),
      milestone('Interest exceeds your deposits', interestEarned > invested),
    ];

    const assumptions = [
      assumption('Annual rate', percent(r.value)),
      assumption('Compounding', FREQUENCY_LABEL[String(n)] ?? `${n}/year`),
      assumption('Contribution', c.value > 0 ? `${money(c.value, currency)}/mo` : 'none'),
    ];

    const decisions = [
      toolDecision('See what inflation does to this amount', 'inflation-calculator'),
      toolDecision('Estimate how long until it doubles', 'rule-of-72-calculator'),
      toolDecision('Work backwards from a savings goal', 'savings-goal-calculator'),
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
        'How much should I contribute each month to hit a target?',
        'What will this be worth in today’s money after inflation?',
      ],
      explanation: `Starting with ${money(principalInvested, currency)}${totalContrib > 0 ? ` and adding ${money(c.value, currency)} a month` : ''} at ${percent(r.value)} compounded ${FREQUENCY_LABEL[String(n)] ?? `${n}/year`}, the balance grows to ${money(finalAmount, currency)} after ${years} ${years === 1 ? 'year' : 'years'}.`,
      visualization: lineSpec('balance', series.map((v, i) => ({ x: i, y: v })), { kind: 'area', title: 'Balance over time' }),
      meta: { years, finalAmount },
    });
  },
};
