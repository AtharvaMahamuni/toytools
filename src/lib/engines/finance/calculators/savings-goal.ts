// Savings Goal calculator. Answers "how much should I save each month?" to reach a target by a date,
// given current savings and an expected annual return (a sinking-fund solve).

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { requiredMonthlyPayment } from '../models';
import { money, percent, roundMoney } from '../format';
import { number, positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export const savingsGoal: FinanceCalculator = {
  id: 'savings-goal',
  family: 'savings',
  capabilities: { loadExample: true, undo: true },
  fields: [
    { id: 'goal', label: 'Savings goal', type: 'currency', default: 50000, min: 0, presets: [
      { value: 10000 }, { value: 50000 }, { value: 100000 },
    ] },
    { id: 'current', label: 'Current savings', type: 'currency', default: 5000, min: 0, optional: true },
    { id: 'rate', label: 'Expected annual return', type: 'percent', default: 6, min: 0, max: 100, step: 0.1, suffix: '%' },
    { id: 'years', label: 'Years to save', type: 'duration', default: 5, min: 0, max: 100, step: 1, suffix: 'years' },
  ],
  scenarios: [
    { label: 'Home down payment', values: { goal: 60000, current: 10000, rate: 5, years: 5 } },
    { label: 'Wedding', values: { goal: 30000, current: 2000, rate: 4, years: 2 } },
    { label: 'New car', values: { goal: 25000, current: 3000, rate: 4, years: 3 } },
  ],

  calculate(input, { currency, locale }) {
    const loc = locale && locale !== 'en' ? locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const goal = positive(input, 'goal', 'a savings goal');
    if (!goal.ok) return goal.result;
    const current = number(input, 'current', 'current savings', { optional: true, min: 0 });
    if (!current.ok) return current.result;
    const r = number(input, 'rate', 'an expected return', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    const y = positive(input, 'years', 'a number of years', { max: 100 });
    if (!y.ok) return y.result;

    const months = Math.round(y.value * 12);
    if (months <= 0) return validationError(ei.errMinMonths ?? 'Enter at least a few months to save.');

    const monthly = roundMoney(requiredMonthlyPayment(goal.value, current.value, r.value / 100, months));
    const totalInvested = roundMoney(current.value + monthly * months);
    const interestEarned = roundMoney(goal.value - totalInvested);
    const alreadyMet = current.value >= goal.value;
    const yearWord = y.value === 1 ? (ei.yearOne ?? 'year') : (ei.yearMany ?? 'years');

    const hero = card('monthly', ei.heroLabel ?? 'Save each month', alreadyMet ? money(0, currency) : money(monthly, currency), {
      raw: alreadyMet ? 0 : monthly,
      emphasis: 'hero',
      note: ei.heroNoteTpl ? tpl(ei.heroNoteTpl, { months }) : `for ${months} months`,
    });
    const metrics: ResultCard[] = [
      card('invested', ei.cardInvested ?? 'Total you contribute', money(totalInvested, currency), { raw: totalInvested, emphasis: 'primary' }),
      card('interest', ei.cardInterest ?? 'Growth from returns', money(Math.max(0, interestEarned), currency), { raw: Math.max(0, interestEarned) }),
      card('goal', ei.cardGoal ?? 'Goal', money(goal.value, currency), { raw: roundMoney(goal.value) }),
    ];

    const insights = [];
    if (alreadyMet) {
      insights.push(insight(ei.insMet ?? 'Your current savings already meet this goal. Nice work.', 'positive'));
    } else {
      if (interestEarned > 0) {
        insights.push(insight(
          ei.insReturnsTpl
            ? tpl(ei.insReturnsTpl, { interest: money(interestEarned, currency) })
            : `Investment returns cover ${money(interestEarned, currency)} of the goal, so you contribute less than the full target.`,
          'positive',
        ));
      }
      insights.push(insight(ei.insEarlier ?? 'Saving earlier means returns do more of the work and your monthly amount drops.'));
    }

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone(ei.msMet ?? 'Goal already reached', alreadyMet),
        milestone(ei.msReturns ?? 'Returns cover part of the goal', interestEarned > 0),
      ],
      assumptions: [
        assumption(ei.asmRate ?? 'Expected return', percent(r.value)),
        assumption(ei.asmHorizon ?? 'Time horizon', `${y.value} ${yearWord}`),
        assumption(ei.asmStart ?? 'Starting balance', money(current.value, currency)),
      ],
      decisions: [
        toolDecision('See how the balance compounds over time', 'compound-interest-calculator'),
        toolDecision('Check the goal against inflation', 'inflation-calculator'),
        toolDecision('Make sure your emergency fund is set first', 'emergency-fund-calculator'),
      ].map((d) => {
        const map: Record<string, string | undefined> = {
          'compound-interest-calculator': ei.decCompound,
          'inflation-calculator': ei.decInflation,
          'emergency-fund-calculator': ei.decEmergency,
        };
        const label = d.tool?.slug ? map[d.tool.slug] : undefined;
        return label ? { ...d, label } : d;
      }),
      nextQuestions: [
        ei.q1 ?? 'What if my return is lower than expected?',
        ei.q2 ?? 'How does inflation change my goal?',
      ],
      explanation: alreadyMet
        ? (ei.expMetTpl
            ? tpl(ei.expMetTpl, { current: money(current.value, currency), goal: money(goal.value, currency) })
            : `With ${money(current.value, currency)} saved you have already reached the ${money(goal.value, currency)} goal.`)
        : (ei.explanationTpl
            ? tpl(ei.explanationTpl, {
                goal: money(goal.value, currency),
                years: y.value,
                unit: yearWord,
                current: money(current.value, currency),
                rate: percent(r.value),
                monthly: money(monthly, currency),
              })
            : `To reach ${money(goal.value, currency)} in ${y.value} ${yearWord} with ${money(current.value, currency)} saved and a ${percent(r.value)} return, set aside ${money(monthly, currency)} a month.`),
      meta: { months, monthly: alreadyMet ? 0 : monthly },
    });
  },
};
