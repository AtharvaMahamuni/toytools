// Fixed-rate loan. Price minus an optional down payment, a yearly rate split into
// monthly payments, and an optional extra that reduces principal. The extra is added
// on top of the installment. It is not subtracted from it.

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { TimelinePoint } from '@lib/results/types';
import { money, roundMoney } from '../format';
import { number, positive } from '../validation';
import { insight, milestone, assumption, toolDecision } from '../story';

/** Below this yearly percent, a typed value is easy to mistake for a monthly rate. */
const LOW_YEARLY_RATE = 3;
/** Above this yearly percent, the same field is easy to read as a monthly rate. */
const HIGH_YEARLY_RATE = 36;

function rateText(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const body = Number.isInteger(rounded) ? rounded.toFixed(0) : String(rounded);
  return `${body}%`;
}

function payoffLabel(months: number): string {
  const wholeYears = Math.floor(months / 12);
  const rest = months % 12;
  const yearPart = wholeYears > 0 ? `${wholeYears} ${wholeYears === 1 ? 'year' : 'years'}` : '';
  const monthPart = rest > 0 ? `${rest} ${rest === 1 ? 'month' : 'months'}` : '';
  return [yearPart, monthPart].filter(Boolean).join(' ') || '0 months';
}

/** The unit warning, or undefined when the yearly rate sits in the ordinary band. */
export function loanRateNote(rate: number): string | undefined {
  if (rate > 0 && rate < LOW_YEARLY_RATE) {
    return `${rateText(rate)} is a yearly rate. ${rateText(rate)} a month would be ${rateText(rate * 12)} a year, and that is not what this payment uses.`;
  }
  if (rate > HIGH_YEARLY_RATE) {
    return `${rateText(rate)} is a yearly rate, about ${rateText(rate / 12)} a month. The payment uses the yearly rate.`;
  }
  return undefined;
}

function scheduledPayment(principal: number, annualPct: number, months: number): number {
  if (months <= 0) return 0;
  const monthly = annualPct / 100 / 12;
  if (monthly === 0) return principal / months;
  const growth = Math.pow(1 + monthly, months);
  return (principal * monthly * growth) / (growth - 1);
}

interface Schedule {
  payment: number;
  months: number;
  interest: number;
  balance: number;
  timeline: TimelinePoint[];
}

function amortize(
  principal: number,
  annualPct: number,
  termMonths: number,
  extra: number,
  currency: string,
): Schedule {
  const monthly = annualPct / 100 / 12;
  const payment = scheduledPayment(principal, annualPct, termMonths);
  let balance = principal;
  let interest = 0;
  let months = 0;
  let yearPrincipal = 0;
  let yearInterest = 0;
  const timeline: TimelinePoint[] = [
    { year: 0, value: roundMoney(principal), display: money(roundMoney(principal), currency) },
  ];

  // Float dust is already zero. Half a cent is not: a $1 loan at 0% has an
  // installment under $0.005, and stopping there dropped the last month and
  // described it as an extra payment. A remainder under half a cent is zeroed
  // only after the term, once no further payment is scheduled.
  while (balance > 1e-8 && months < termMonths) {
    const monthInterest = balance * monthly;
    let due = payment + extra;
    const owed = balance + monthInterest;
    if (due > owed) due = owed;
    const principalPaid = due - monthInterest;
    balance = Math.max(0, balance - principalPaid);
    interest += monthInterest;
    yearInterest += monthInterest;
    yearPrincipal += principalPaid;
    months += 1;
    if (months % 12 === 0 || balance <= 1e-8) {
      timeline.push({
        year: months / 12,
        value: roundMoney(balance),
        display: money(roundMoney(balance), currency),
        parts: {
          principal: roundMoney(yearPrincipal),
          interest: roundMoney(yearInterest),
        },
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  if (balance < 0.005) balance = 0;

  return { payment, months, interest, balance, timeline };
}

export const loan: FinanceCalculator = {
  id: 'loan',
  family: 'interest',
  capabilities: { timeline: true, loadExample: true, undo: true, visualization: false },
  fields: [
    {
      id: 'price',
      label: 'Price or amount borrowed',
      type: 'currency',
      default: 100000,
      min: 0,
      presets: [{ value: 100000 }, { value: 500000 }, { value: 2000000 }],
    },
    {
      id: 'down',
      label: 'Down payment',
      type: 'currency',
      default: 0,
      min: 0,
      optional: true,
      help: 'Optional. Paid up front, so it is not borrowed.',
    },
    {
      id: 'rate',
      label: 'Yearly interest rate',
      type: 'percent',
      default: 12,
      min: 0,
      max: 100,
      step: 0.1,
      suffix: '%',
    },
    {
      id: 'years',
      label: 'Term',
      type: 'duration',
      default: 5,
      min: 1,
      max: 40,
      step: 1,
      suffix: 'years',
    },
    {
      id: 'extra',
      label: 'Extra monthly payment',
      type: 'currency',
      default: 0,
      min: 0,
      optional: true,
      help: 'Added on top of the payment and taken off the principal.',
    },
  ],
  scenarios: [
    { label: 'Personal loan', values: { price: 200000, down: 0, rate: 14, years: 5, extra: 0 } },
    { label: 'Home loan, 15 years', values: { price: 5000000, down: 1000000, rate: 8.5, years: 15, extra: 0 } },
    { label: 'Home loan, 20 years', values: { price: 5000000, down: 1000000, rate: 8.5, years: 20, extra: 0 } },
    { label: 'Home loan, 30 years', values: { price: 5000000, down: 1000000, rate: 8.5, years: 30, extra: 0 } },
  ],

  calculate(input, { currency }) {
    const price = positive(input, 'price', 'a price or amount borrowed');
    if (!price.ok) return price.result;
    const down = number(input, 'down', 'the down payment', { optional: true, min: 0 });
    if (!down.ok) return down.result;
    const rate = number(input, 'rate', 'a yearly interest rate', { min: 0, max: 100 });
    if (!rate.ok) return rate.result;
    const years = number(input, 'years', 'a term in years', { min: 1, max: 40 });
    if (!years.ok) return years.result;
    const extra = number(input, 'extra', 'the extra monthly payment', { optional: true, min: 0 });
    if (!extra.ok) return extra.result;

    const principal = roundMoney(price.value - down.value);
    if (principal <= 0) {
      return validationError('The down payment leaves nothing to borrow.');
    }

    const termMonths = Math.round(years.value * 12);
    const plain = amortize(principal, rate.value, termMonths, 0, currency);
    const schedule = extra.value > 0 ? amortize(principal, rate.value, termMonths, extra.value, currency) : plain;
    if (schedule.balance > 1) {
      return validationError(
        'This yearly rate and term never pay the balance down. Lower the rate, shorten the term, or add an extra payment.',
      );
    }

    const payment = roundMoney(schedule.payment);
    const interest = roundMoney(schedule.interest);
    const total = roundMoney(principal + interest);
    // Interest saved is the gap between two finished schedules. A plain schedule that
    // never pays the balance down is not a comparable total.
    const saved = plain.balance <= 1 ? roundMoney(plain.interest - schedule.interest) : 0;
    const note = loanRateNote(rate.value);

    const hero = card('payment', 'Monthly payment', money(payment, currency), {
      raw: payment,
      emphasis: 'hero',
      note,
    });

    const metrics = [
      card('borrowed', 'Amount borrowed', money(principal, currency), { raw: principal }),
      card('interest', 'Total interest', money(interest, currency), { raw: interest, emphasis: 'primary' }),
      card('total', 'Total paid', money(total, currency), { raw: total }),
      card('payoff', 'Payoff', payoffLabel(schedule.months), { raw: schedule.months }),
    ];
    if (extra.value > 0 && saved > 0) {
      metrics.push(card('saved', 'Interest saved', money(saved, currency), { raw: saved }));
    }

    const interestShare = total > 0 ? Math.round((interest / total) * 100) : 0;
    const insights = [];
    if (extra.value > 0 && saved > 0) {
      insights.push(
        insight(
          `An extra ${money(extra.value, currency)} a month clears the loan in ${payoffLabel(schedule.months)} and saves ${money(saved, currency)} of interest.`,
          'positive',
        ),
      );
    } else if (rate.value === 0) {
      insights.push(insight('A zero yearly rate splits the amount into equal months, so you pay no interest.'));
    } else if (interest > 0) {
      insights.push(insight(`Interest is ${interestShare}% of what you pay back.`));
    } else {
      insights.push(insight('The interest on this amount is under half a cent.'));
    }

    const milestones = [
      milestone('Paid off', schedule.balance <= 1, schedule.months / 12),
      milestone('Extra payment shortened the term', schedule.months < plain.months),
    ];

    const assumptions = [
      assumption('Yearly rate', rateText(rate.value)),
      assumption('Schedule', 'Monthly. The yearly rate is divided by 12.'),
      assumption('Down payment', down.value > 0 ? money(down.value, currency) : 'none'),
      assumption('Extra payment', extra.value > 0 ? `${money(extra.value, currency)} a month, off the principal` : 'none'),
    ];

    const shortened = extra.value > 0 && schedule.months < termMonths
      ? ` An extra ${money(extra.value, currency)} a month pays it off in ${payoffLabel(schedule.months)}.`
      : '';

    return successResult({
      hero,
      metrics,
      timeline: schedule.timeline,
      breakdown: [
        { id: 'principal', label: 'Principal', value: principal, display: money(principal, currency) },
        { id: 'interest', label: 'Interest', value: interest, display: money(interest, currency) },
      ],
      insights,
      milestones,
      assumptions,
      decisions: [
        toolDecision('See what the same monthly amount could grow to if invested', 'sip-calculator'),
        toolDecision('Project a lump sum at compound interest instead', 'compound-interest-calculator'),
      ],
      nextQuestions: [
        'How much sooner does an extra payment clear it?',
        'What would this monthly amount become if it were invested instead?',
      ],
      explanation: `Borrowing ${money(principal, currency)} at ${rateText(rate.value)} a year over ${payoffLabel(termMonths)} needs ${money(payment, currency)} a month. You pay ${money(interest, currency)} in interest.${shortened}`,
    });
  },
};
