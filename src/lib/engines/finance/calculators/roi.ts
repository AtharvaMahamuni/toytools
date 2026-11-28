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
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

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

  calculate(input, { currency, locale }) {
    const loc = locale && locale !== 'en' ? locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const c = positive(input, 'cost', 'the amount invested');
    if (!c.ok) return c.result;
    const f = number(input, 'final', 'the final value', { min: 0 });
    if (!f.ok) return f.result;
    const y = number(input, 'years', 'the holding period', { optional: true, min: 0, max: 100 });
    if (!y.ok) return y.result;

    const cost = c.value;
    const final = f.value;
    const years = y.value;
    const yearWord = years === 1 ? (ei.yearOne ?? 'year') : (ei.yearMany ?? 'years');

    const gain = roundMoney(final - cost);
    const roiPct = roundMoney(((final - cost) / cost) * 100);
    const annualPct = years > 0 && final > 0
      ? roundMoney(compoundAnnualGrowthRate(cost, final, years) * 100)
      : null;

    const hero = card('roi', ei.heroLabel ?? 'Return on investment', percent(roiPct), {
      raw: roiPct,
      emphasis: 'hero',
      note: gain >= 0
        ? (ei.noteGainTpl ? tpl(ei.noteGainTpl, { amt: money(gain, currency) }) : `a gain of ${money(gain, currency)}`)
        : (ei.noteLossTpl ? tpl(ei.noteLossTpl, { amt: money(Math.abs(gain), currency) }) : `a loss of ${money(Math.abs(gain), currency)}`),
    });
    const metrics: ResultCard[] = [
      card('gain', gain >= 0 ? (ei.cardGain ?? 'Net gain') : (ei.cardLoss ?? 'Net loss'), money(Math.abs(gain), currency), { raw: gain, emphasis: 'primary' }),
      card('final', ei.cardFinal ?? 'Final value', money(final, currency), { raw: final }),
      ...(annualPct !== null
        ? [card('annualized', ei.cardAnnualized ?? 'Annualized return', `${percent(annualPct)}/${ei.yrUnit ?? 'yr'}`, { raw: annualPct })]
        : []),
    ];

    const insights = [];
    if (gain > 0) {
      insights.push(insight(
        ei.insGainTpl
          ? tpl(ei.insGainTpl, { base: money(100, currency), back: money(roundMoney(100 * (final / cost)), currency) })
          : `Every ${money(100, currency)} you put in came back as ${money(roundMoney(100 * (final / cost)), currency)}.`,
        'positive',
      ));
    } else if (gain < 0) {
      insights.push(insight(
        ei.insLossTpl
          ? tpl(ei.insLossTpl, { loss: money(Math.abs(gain), currency), pct: percent(Math.abs(roiPct)) })
          : `This position lost ${money(Math.abs(gain), currency)}, a ${percent(Math.abs(roiPct))} decline on what you paid.`,
        'caution',
      ));
    }
    if (annualPct !== null && years > 1) {
      insights.push(insight(
        ei.insAnnualTpl
          ? tpl(ei.insAnnualTpl, { years, annual: percent(annualPct) })
          : `Simple ROI ignores time. Over ${years} years this works out to ${percent(annualPct)} a year, which is the number to compare against yearly benchmarks.`,
      ));
    } else if (years === 0) {
      insights.push(insight(ei.insNoPeriod ?? 'Add a holding period to see the annualized return, the fair way to compare investments held for different lengths of time.'));
    }

    const milestones = [
      milestone(ei.msDoubled ?? 'Investment at least doubled', final >= cost * 2),
      milestone(ei.msAhead ?? 'Came out ahead of what you paid', gain > 0),
    ];

    const assumptions = [
      assumption(ei.asmFigures ?? 'Figures', ei.asmFiguresVal ?? 'before taxes and fees'),
      assumption(ei.asmCash ?? 'Cash flows', ei.asmCashVal ?? 'one buy-in, one exit, nothing in between'),
      assumption(ei.asmPeriod ?? 'Holding period', years > 0 ? `${years} ${yearWord}` : (ei.notSpecified ?? 'not specified')),
    ];

    const decisions = [
      toolDecision('Turn this growth into a clean annual rate', 'cagr-calculator'),
      toolDecision('Project what this could grow into next', 'compound-interest-calculator'),
      toolDecision('Check the gain against inflation', 'inflation-calculator'),
    ].map((d) => {
      const map: Record<string, string | undefined> = {
        'cagr-calculator': ei.decCagr,
        'compound-interest-calculator': ei.decCompound,
        'inflation-calculator': ei.decInflation,
      };
      const label = d.tool?.slug ? map[d.tool.slug] : undefined;
      return label ? { ...d, label } : d;
    });

    return successResult({
      hero,
      metrics,
      insights,
      milestones,
      assumptions,
      decisions,
      nextQuestions: [
        ei.q1 ?? 'What annual return does this work out to?',
        ei.q2 ?? 'How does this compare with leaving the money in an index fund?',
      ],
      explanation: ei.explanationTpl
        ? tpl(ei.explanationTpl, {
            cost: money(cost, currency),
            final: money(final, currency),
            pct: percent(Math.abs(roiPct)),
            dir: gain >= 0 ? (ei.returnWord ?? 'return') : (ei.lossWord ?? 'loss'),
            annualClause: annualPct !== null
              ? (ei.expAnnualTpl ? tpl(ei.expAnnualTpl, { annual: percent(annualPct), years, unit: yearWord }) : ` (${percent(annualPct)} a year over ${years} ${yearWord})`)
              : '',
          })
        : `You invested ${money(cost, currency)} and ended with ${money(final, currency)}, a ${percent(Math.abs(roiPct))} ${gain >= 0 ? 'return' : 'loss'}${annualPct !== null ? ` (${percent(annualPct)} a year over ${years} ${yearWord})` : ''}.`,
      meta: { cost, final, roiPct, annualPct },
    });
  },
};
