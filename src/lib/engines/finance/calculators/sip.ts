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
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

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

  calculate(input, { currency, locale }) {
    const loc = locale && locale !== 'en' ? locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const m = positive(input, 'monthly', 'a monthly investment');
    if (!m.ok) return m.result;
    const r = number(input, 'rate', 'an expected return', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    const y = positive(input, 'years', 'an investment period', { max: 100 });
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
    const yearWord = years === 1 ? (ei.yearOne ?? 'year') : (ei.yearMany ?? 'years');

    const hero = card('final', ei.heroLabel ?? 'Investment value', money(finalValue, currency), {
      raw: finalValue,
      emphasis: 'hero',
      note: ei.heroNoteTpl ? tpl(ei.heroNoteTpl, { years, unit: yearWord }) : `after ${years} ${yearWord}`,
    });
    const metrics: ResultCard[] = [
      card('gain', ei.cardGain ?? 'Wealth gained', money(Math.max(0, wealthGained), currency), { raw: Math.max(0, wealthGained), emphasis: 'primary' }),
      card('invested', ei.cardInvested ?? 'Total invested', money(totalInvested, currency), { raw: totalInvested }),
      card('months', ei.cardMonths ?? 'Instalments', `${months}`, { raw: months }),
    ];

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
      ...(init.value > 0 ? [{ id: 'lump', label: ei.brkLump ?? 'Lump sum', value: roundMoney(init.value), display: money(init.value, currency) }] : []),
      { id: 'invested', label: ei.brkMonthly ?? 'Monthly instalments', value: roundMoney(m.value * months), display: money(m.value * months, currency) },
      { id: 'gain', label: ei.brkGrowth ?? 'Growth', value: Math.max(0, wealthGained), display: money(wealthGained, currency) },
    ];

    const insights = [];
    if (wealthGained > 0 && finalValue > 0) {
      const sharePct = (wealthGained / finalValue) * 100;
      insights.push(insight(
        ei.insShareTpl ? tpl(ei.insShareTpl, { pct: Math.round(sharePct) }) : `Market growth contributes ${Math.round(sharePct)}% of the final value; the rest is money you put in.`,
        sharePct >= 50 ? 'positive' : 'info',
      ));
    }
    insights.push(insight(ei.insAvg ?? 'A SIP invests the same amount every month, so you buy more units when prices are low and fewer when they are high (rupee/dollar cost averaging).'));

    const milestones = [
      milestone(ei.msDoubled ?? 'Value doubled your contributions', finalValue >= totalInvested * 2),
      milestone(ei.msExceeds ?? 'Growth exceeds what you invested', wealthGained > totalInvested),
    ];

    const assumptions = [
      assumption(ei.asmRate ?? 'Expected return', percent(r.value)),
      assumption(ei.asmTiming ?? 'Instalment timing', ei.asmTimingVal ?? 'end of each month'),
      assumption(ei.asmCompounding ?? 'Compounding', ei.asmMonthly ?? 'monthly'),
      assumption(ei.asmLump ?? 'Starting lump sum', init.value > 0 ? money(init.value, currency) : (ei.none ?? 'none')),
    ];

    const decisions = [
      toolDecision('Check what this is worth after inflation', 'inflation-calculator'),
      toolDecision('Compare with a one-time lump sum', 'compound-interest-calculator'),
      toolDecision('Work backwards from a savings target', 'savings-goal-calculator'),
    ].map((d) => {
      const map: Record<string, string | undefined> = {
        'inflation-calculator': ei.decInflation,
        'compound-interest-calculator': ei.decCompound,
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
        ei.q1 ?? 'What monthly SIP do I need to reach a specific target?',
        ei.q2 ?? 'How much difference does starting five years earlier make?',
      ],
      explanation: ei.explanationTpl
        ? tpl(ei.explanationTpl, {
            monthly: money(m.value, currency),
            lumpClause: init.value > 0
              ? (ei.expLumpTpl ? tpl(ei.expLumpTpl, { lump: money(init.value, currency) }) : ` plus a ${money(init.value, currency)} lump sum`)
              : '',
            rate: percent(r.value),
            final: money(finalValue, currency),
            years,
            unit: yearWord,
            invested: money(totalInvested, currency),
            gain: money(Math.max(0, wealthGained), currency),
          })
        : `Investing ${money(m.value, currency)} every month${init.value > 0 ? ` plus a ${money(init.value, currency)} lump sum` : ''} at an expected ${percent(r.value)} annual return grows to ${money(finalValue, currency)} after ${years} ${yearWord}. You invest ${money(totalInvested, currency)} in total; growth adds ${money(Math.max(0, wealthGained), currency)}.`,
      visualization: lineSpec('balance', series.map((v, i) => ({ x: i, y: v })), { kind: 'area', title: ei.vizTitle ?? 'Investment value over time' }),
      meta: { years, finalValue, totalInvested },
    });
  },
};
