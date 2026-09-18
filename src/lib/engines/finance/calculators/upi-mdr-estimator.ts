// UPI MDR estimator. Rates come only from the PIB note of 15 Sep 2026:
// https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310586
// This is not a payment app. It does not say a charge will apply.

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { money, roundMoney } from '../format';
import { insight, milestone, assumption, decision } from '../story';

export const MDR_FLOOR = 2000;
export const MDR_PAGE_CAP = 100_000_000;
export const ORDINARY_RATE = 0.004;
export const ORDINARY_CAP_FROM = 75_000;
export const ORDINARY_CAP = 300;
export const ESSENTIAL_FLAT = 5;
export const CAPITAL_RATE = 0.0002;
export const CAPITAL_CAP = 300;

export const MDR_KINDS = ['ordinary', 'essential', 'capital', 'small'] as const;
export type MdrKind = (typeof MDR_KINDS)[number];

export const NOT_A_CUSTOMER_FEE =
  'This is an ecosystem charge on some merchant payments, not a fee the customer owes, and not a government tax.';

const KIND_LABEL: Record<MdrKind, string> = {
  ordinary: 'Ordinary merchant',
  essential: 'Essential sector',
  capital: 'Capital market',
  small: 'Small merchant',
};

export function roundPaise(n: number): number {
  return roundMoney(n);
}

export type MdrRule =
  | 'zero-at-or-under-2000'
  | 'small-merchant-what-if'
  | 'ordinary-0-4'
  | 'ordinary-cap-300'
  | 'essential-flat-5'
  | 'capital-0-02'
  | 'capital-cap-300';

export function estimateMdr(amount: number, kind: MdrKind): { mdr: number; rule: MdrRule } {
  if (amount <= MDR_FLOOR) return { mdr: 0, rule: 'zero-at-or-under-2000' };
  if (kind === 'small') return { mdr: 0, rule: 'small-merchant-what-if' };
  if (kind === 'essential') return { mdr: ESSENTIAL_FLAT, rule: 'essential-flat-5' };
  if (kind === 'capital') {
    const raw = roundPaise(amount * CAPITAL_RATE);
    if (raw >= CAPITAL_CAP) return { mdr: CAPITAL_CAP, rule: 'capital-cap-300' };
    return { mdr: raw, rule: 'capital-0-02' };
  }
  if (amount >= ORDINARY_CAP_FROM) return { mdr: ORDINARY_CAP, rule: 'ordinary-cap-300' };
  return { mdr: roundPaise(amount * ORDINARY_RATE), rule: 'ordinary-0-4' };
}

function fail(message: string): InteractiveResult {
  return validationError(message);
}

function readAmount(raw: unknown): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null) return { ok: false, result: fail('Enter an amount in whole rupees.') };
  const text = typeof raw === 'number' ? String(raw) : String(raw).trim();
  if (text === '') return { ok: false, result: fail('Enter an amount in whole rupees.') };
  const n = Number(text.replace(/,/g, '').replace(/\s/g, ''));
  if (!Number.isFinite(n)) return { ok: false, result: fail('Amount must be a number.') };
  if (n <= 0) return { ok: false, result: fail('Amount must be greater than zero.') };
  if (!Number.isInteger(n)) return { ok: false, result: fail('Enter whole rupees only. No paise.') };
  if (n > MDR_PAGE_CAP) {
    return { ok: false, result: fail('That is above the 10,00,00,000 page limit. The limit is on this page, not a rule from the press note.') };
  }
  return { ok: true, value: n };
}

function readKind(raw: unknown): { ok: true; value: MdrKind } | { ok: false; result: InteractiveResult } {
  const text = raw === undefined || raw === null || raw === '' ? 'ordinary' : String(raw);
  if (!(MDR_KINDS as readonly string[]).includes(text)) {
    return { ok: false, result: fail('Pick ordinary merchant, essential sector, capital market, or small merchant.') };
  }
  return { ok: true, value: text as MdrKind };
}

export const upiMdrEstimator: FinanceCalculator = {
  id: 'upi-mdr-estimator',
  family: 'estimator',
  fields: [
    {
      id: 'amount',
      label: 'Amount in whole rupees',
      type: 'integer',
      default: 5000,
      step: 1,
      min: 1,
      suffix: '₹',
      help: 'Whole rupees. 2000 and under is zero for every kind on this page.',
      presets: [
        { label: '2,000', value: 2000 },
        { label: '5,000', value: 5000 },
        { label: '75,000', value: 75000 },
      ],
    },
    {
      id: 'kind',
      label: 'Payment kind',
      type: 'select',
      default: 'ordinary',
      help: 'Small merchant is a what-if. Real status depends on the bank, not this toggle.',
      options: [
        { value: 'ordinary', label: 'Ordinary merchant' },
        { value: 'essential', label: 'Essential sector' },
        { value: 'capital', label: 'Capital market' },
        { value: 'small', label: 'Small merchant' },
      ],
    },
  ],

  calculate(input) {
    const amount = readAmount(input.amount);
    if (!amount.ok) return amount.result;
    const kind = readKind(input.kind);
    if (!kind.ok) return kind.result;

    const estimate = estimateMdr(amount.value, kind.value);
    return successResult({
      hero: card('mdr', 'MDR', money(estimate.mdr, 'INR'), {
        raw: estimate.mdr,
        emphasis: 'hero',
        note: NOT_A_CUSTOMER_FEE,
      }),
      metrics: [
        card('amount', 'Amount', money(amount.value, 'INR'), { raw: amount.value }),
        card('kind', 'Kind', KIND_LABEL[kind.value], { raw: amount.value }),
      ],
      milestones: [milestone('Not a customer charge', true)],
      insights: [
        insight(NOT_A_CUSTOMER_FEE, 'caution'),
        insight('Person-to-person UPI stays free at any amount. This page does not estimate that.', 'info'),
      ],
      assumptions: [
        assumption('Rule', estimate.rule),
        assumption('Kind', KIND_LABEL[kind.value]),
        kind.value === 'small'
          ? assumption('Small merchant', 'What-if only. Real status depends on the bank.')
          : assumption('Source', 'PIB note, 15 Sep 2026'),
      ],
      decisions: [
        decision('Open the meme split (not a fee tool)', '/tool/finance/upi-1999-split/'),
        decision('Open the tax calculator when you have a real rate', '/tool/number/tax-calculator/'),
      ],
      explanation: NOT_A_CUSTOMER_FEE + ' MDR is not a tax and not a customer charge. The rates on this page are the ones in the 15 Sep 2026 PIB note, and nothing else.',
      meta: { mdr: estimate.mdr, amount: amount.value },
    });
  },
};
