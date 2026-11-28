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
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

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

  calculate(input, { currency, locale }) {
    const loc = locale && locale !== 'en' ? locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

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
    const freqLabel = (ei.freqs && ei.freqs[String(n)]) || FREQUENCY_LABEL[String(n)] || `${n}/year`;

    const fromPrincipal = futureValueCompound(p.value, rate, n, years);
    const fromContrib = futureValueAnnuity(c.value, rate, n, years);
    const finalAmount = roundMoney(fromPrincipal + fromContrib);
    const totalContrib = roundMoney(c.value * 12 * years);
    const principalInvested = roundMoney(p.value);
    const interestEarned = roundMoney(finalAmount - principalInvested - totalContrib);

    const yearWord = years === 1 ? (ei.yearOne ?? 'year') : (ei.yearMany ?? 'years');
    const hero = card('final', ei.heroLabel ?? 'Final amount', money(finalAmount, currency), {
      raw: finalAmount,
      emphasis: 'hero',
      note: ei.heroNoteTpl ? tpl(ei.heroNoteTpl, { years, unit: yearWord }) : `after ${years} ${yearWord}`,
    });
    const metrics: ResultCard[] = [
      card('interest', ei.cardInterest ?? 'Interest earned', money(interestEarned, currency), { raw: interestEarned, emphasis: 'primary' }),
      card('principal', ei.cardPrincipal ?? 'Principal invested', money(principalInvested, currency), { raw: principalInvested }),
    ];
    if (totalContrib > 0) metrics.push(card('contributions', ei.cardContrib ?? 'Total contributions', money(totalContrib, currency), { raw: totalContrib }));

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
      { id: 'principal', label: ei.brkPrincipal ?? 'Principal', value: principalInvested, display: money(principalInvested, currency) },
      ...(totalContrib > 0 ? [{ id: 'contrib', label: ei.brkContrib ?? 'Contributions', value: totalContrib, display: money(totalContrib, currency) }] : []),
      { id: 'interest', label: ei.brkInterest ?? 'Interest', value: Math.max(0, interestEarned), display: money(interestEarned, currency) },
    ];

    const invested = principalInvested + totalContrib;
    const insights = [];
    if (interestEarned > 0 && invested > 0) {
      const sharePct = (interestEarned / finalAmount) * 100;
      insights.push(insight(
        ei.insShareTpl
          ? tpl(ei.insShareTpl, { pct: Math.round(sharePct) })
          : `Interest makes up ${Math.round(sharePct)}% of your final balance; the rest is money you put in.`,
        sharePct >= 50 ? 'positive' : 'info',
      ));
    }
    if (totalContrib > 0) {
      insights.push(insight(ei.insContrib ?? 'Most of your final wealth tends to come from compounding over time rather than the initial deposit.'));
    }

    const milestones = [
      milestone(ei.msDoubled ?? 'Money doubled', finalAmount >= principalInvested * 2),
      milestone(ei.msExceeds ?? 'Interest exceeds your deposits', interestEarned > invested),
    ];

    const assumptions = [
      assumption(ei.asmRate ?? 'Annual rate', percent(r.value)),
      assumption(ei.asmCompounding ?? 'Compounding', freqLabel),
      assumption(ei.asmContrib ?? 'Contribution', c.value > 0 ? `${money(c.value, currency)}/${ei.moUnit ?? 'mo'}` : (ei.none ?? 'none')),
    ];

    const decisions = [
      toolDecision('See what inflation does to this amount', 'inflation-calculator'),
      toolDecision('Estimate how long until it doubles', 'rule-of-72-calculator'),
      toolDecision('Work backwards from a savings goal', 'savings-goal-calculator'),
    ].map((d) => {
      const map: Record<string, string | undefined> = {
        'inflation-calculator': ei.decInflation,
        'rule-of-72-calculator': ei.decRule72,
        'savings-goal-calculator': ei.decGoal,
      };
      const label = d.tool?.slug ? map[d.tool.slug] : undefined;
      return label ? { ...d, label } : d;
    });

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
        ei.q1 ?? 'How much should I contribute each month to hit a target?',
        ei.q2 ?? 'What will this be worth in today’s money after inflation?',
      ],
      explanation: ei.explanationTpl
        ? tpl(ei.explanationTpl, {
            principal: money(principalInvested, currency),
            contribClause: totalContrib > 0
              ? (ei.expContribTpl ? tpl(ei.expContribTpl, { amount: money(c.value, currency) }) : ` and adding ${money(c.value, currency)} a month`)
              : '',
            rate: percent(r.value),
            freq: freqLabel,
            final: money(finalAmount, currency),
            years,
            unit: yearWord,
          })
        : `Starting with ${money(principalInvested, currency)}${totalContrib > 0 ? ` and adding ${money(c.value, currency)} a month` : ''} at ${percent(r.value)} compounded ${freqLabel}, the balance grows to ${money(finalAmount, currency)} after ${years} ${yearWord}.`,
      visualization: lineSpec('balance', series.map((v, i) => ({ x: i, y: v })), { kind: 'area', title: ei.vizTitle ?? 'Balance over time' }),
      meta: { years, finalAmount },
    });
  },
};
