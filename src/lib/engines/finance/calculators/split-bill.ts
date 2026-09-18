// Friends dinner split. Equal shares, with the last person taking leftover paise
// so the shares sum to the total. Not a UPI fee tool. No accounts.

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { money } from '../format';
import { insight, milestone, assumption, decision } from '../story';

export const PEOPLE_MIN = 2;
export const PEOPLE_MAX = 30;
export const TIP_MAX = 30;
export const BILL_PAGE_CAP = 100_000_000;

export interface BillSplit {
  billPaise: number;
  tipPaise: number;
  totalPaise: number;
  sharesPaise: number[];
  remainderPaise: number;
}

export function rupeesFromPaise(paise: number): number {
  return paise / 100;
}

/** Tip percent is a whole number of percent points, 0 to 30. Paise stay integers. */
export function splitBillFair(billRupees: number, people: number, tipPercent: number): BillSplit {
  const billPaise = Math.round(billRupees * 100);
  const tipPaise = Math.round((billPaise * tipPercent) / 100);
  const totalPaise = billPaise + tipPaise;
  const base = Math.floor(totalPaise / people);
  const remainderPaise = totalPaise - base * people;
  const sharesPaise = Array.from({ length: people }, (_, i) =>
    i === people - 1 ? base + remainderPaise : base,
  );
  return { billPaise, tipPaise, totalPaise, sharesPaise, remainderPaise };
}

function fail(message: string): InteractiveResult {
  return validationError(message);
}

function atMostTwoDecimals(n: number): boolean {
  return Math.abs(n * 100 - Math.round(n * 100)) < 1e-6;
}

function readBill(raw: unknown): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null) return { ok: false, result: fail('Enter the bill total.') };
  const text = typeof raw === 'number' ? String(raw) : String(raw).trim();
  if (text === '') return { ok: false, result: fail('Enter the bill total.') };
  const n = Number(text.replace(/,/g, '').replace(/\s/g, ''));
  if (!Number.isFinite(n)) return { ok: false, result: fail('Bill total must be a number.') };
  if (n <= 0) return { ok: false, result: fail('Bill total must be greater than zero.') };
  if (!atMostTwoDecimals(n)) return { ok: false, result: fail('Enter rupees with at most two decimal places.') };
  if (n > BILL_PAGE_CAP) return { ok: false, result: fail('That bill is above the 10,00,00,000 page limit.') };
  return { ok: true, value: n };
}

function readPeople(raw: unknown): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null || raw === '') return { ok: false, result: fail('Enter how many people, from 2 to 30.') };
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n)) return { ok: false, result: fail('People must be a number.') };
  if (!Number.isInteger(n)) return { ok: false, result: fail('People must be a whole number.') };
  if (n < PEOPLE_MIN || n > PEOPLE_MAX) return { ok: false, result: fail('People must be from 2 to 30.') };
  return { ok: true, value: n };
}

function readTip(raw: unknown): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null || raw === '') return { ok: true, value: 0 };
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n)) return { ok: false, result: fail('Tip percent must be a number.') };
  if (n < 0 || n > TIP_MAX) return { ok: false, result: fail('Tip percent must be from 0 to 30.') };
  if (!Number.isInteger(n)) return { ok: false, result: fail('Tip percent must be a whole number.') };
  return { ok: true, value: n };
}

export const splitBillCalc: FinanceCalculator = {
  id: 'split-bill',
  family: 'bill',
  fields: [
    {
      id: 'bill',
      label: 'Bill total',
      type: 'number',
      default: 1000,
      step: 0.01,
      min: 0,
      suffix: '₹',
      help: 'Rupees. Paise are fine. This is a dinner split, not a payment fee.',
      presets: [
        { label: '500', value: 500 },
        { label: '1,000', value: 1000 },
        { label: '2,480', value: 2480 },
      ],
    },
    {
      id: 'people',
      label: 'People',
      type: 'integer',
      default: 3,
      step: 1,
      min: 2,
      max: 30,
      suffix: 'people',
      help: 'From 2 to 30. Everyone pays the same share, except the last person takes leftover paise.',
    },
    {
      id: 'tip',
      label: 'Tip percent',
      type: 'percent',
      default: 10,
      step: 1,
      min: 0,
      max: 30,
      optional: true,
      suffix: '%',
      help: 'Optional. 0 to 30. Blank means no tip.',
    },
  ],

  calculate(input) {
    const bill = readBill(input.bill);
    if (!bill.ok) return bill.result;
    const people = readPeople(input.people);
    if (!people.ok) return people.result;
    const tip = readTip(input.tip);
    if (!tip.ok) return tip.result;

    const split = splitBillFair(bill.value, people.value, tip.value);
    const total = rupeesFromPaise(split.totalPaise);
    const each = rupeesFromPaise(split.sharesPaise[0]);
    const last = rupeesFromPaise(split.sharesPaise[split.sharesPaise.length - 1]);
    const even = split.remainderPaise === 0;
    const eachLine = `Each person pays ${money(each, 'INR')}.`;
    const note = even
      ? `${people.value} people. ${eachLine}`
      : `${people.value} people. ${eachLine} The last person pays ${money(last, 'INR')}.`;

    const hero = card('total', 'Total with tip', money(total, 'INR'), {
      raw: total,
      emphasis: 'hero',
      note,
    });
    return successResult({
      hero,
      metrics: [hero],
      insights: [
        even
          ? insight('Each share is the same.')
          : insight('The last person takes the leftover paise.', 'info'),
      ],
      milestones: [milestone('Shares sum to the total', true)],
      assumptions: [
        assumption('Tip', tip.value === 0 ? 'No tip' : `${tip.value}%`),
        assumption('People', String(people.value)),
        assumption('Remainder paise', String(split.remainderPaise)),
      ],
      decisions: [
        decision('Work out a tip percent on the tip calculator', '/tool/number/tip-calculator/'),
      ],
      meta: { total, remainderPaise: split.remainderPaise, people: people.value, each, last },
    });
  },
};
