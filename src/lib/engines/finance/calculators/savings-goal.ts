// Savings Goal calculator. Answers "how much should I save each month?" to reach a target by a date,
// given current savings and an expected annual return (a sinking-fund solve).

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { requiredMonthlyPayment } from '../models';
import { money, percent, roundMoney } from '../format';
import { number, positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

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

  calculate(input, { currency }) {
    const goal = positive(input, 'goal', 'a savings goal');
    if (!goal.ok) return goal.result;
    const current = number(input, 'current', 'current savings', { optional: true, min: 0 });
    if (!current.ok) return current.result;
    const r = number(input, 'rate', 'an expected return', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    const y = positive(input, 'years', 'a number of years');
    if (!y.ok) return y.result;

    const months = Math.round(y.value * 12);
    if (months <= 0) return validationError('Enter at least a few months to save.');

    const monthly = roundMoney(requiredMonthlyPayment(goal.value, current.value, r.value / 100, months));
    const totalInvested = roundMoney(current.value + monthly * months);
    const interestEarned = roundMoney(goal.value - totalInvested);
    const alreadyMet = current.value >= goal.value;

    const hero = card('monthly', 'Save each month', alreadyMet ? money(0, currency) : money(monthly, currency), {
      raw: alreadyMet ? 0 : monthly, emphasis: 'hero', note: `for ${months} months`,
    });
    const metrics: ResultCard[] = [
      card('invested', 'Total you contribute', money(totalInvested, currency), { raw: totalInvested, emphasis: 'primary' }),
      card('interest', 'Growth from returns', money(Math.max(0, interestEarned), currency), { raw: Math.max(0, interestEarned) }),
      card('goal', 'Goal', money(goal.value, currency), { raw: roundMoney(goal.value) }),
    ];

    const insights = [];
    if (alreadyMet) {
      insights.push(insight('Your current savings already meet this goal. Nice work.', 'positive'));
    } else {
      if (interestEarned > 0) insights.push(insight(`Investment returns cover ${money(interestEarned, currency)} of the goal, so you contribute less than the full target.`, 'positive'));
      insights.push(insight('Saving earlier means returns do more of the work and your monthly amount drops.'));
    }

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone('Goal already reached', alreadyMet),
        milestone('Returns cover part of the goal', interestEarned > 0),
      ],
      assumptions: [
        assumption('Expected return', percent(r.value)),
        assumption('Time horizon', `${y.value} ${y.value === 1 ? 'year' : 'years'}`),
        assumption('Starting balance', money(current.value, currency)),
      ],
      decisions: [
        toolDecision('See how the balance compounds over time', 'compound-interest-calculator'),
        toolDecision('Check the goal against inflation', 'inflation-calculator'),
        toolDecision('Make sure your emergency fund is set first', 'emergency-fund-calculator'),
      ],
      nextQuestions: ['What if my return is lower than expected?', 'How does inflation change my goal?'],
      explanation: alreadyMet
        ? `With ${money(current.value, currency)} saved you have already reached the ${money(goal.value, currency)} goal.`
        : `To reach ${money(goal.value, currency)} in ${y.value} ${y.value === 1 ? 'year' : 'years'} with ${money(current.value, currency)} saved and a ${percent(r.value)} return, set aside ${money(monthly, currency)} a month.`,
      meta: { months, monthly: alreadyMet ? 0 : monthly },
    });
  },
};
