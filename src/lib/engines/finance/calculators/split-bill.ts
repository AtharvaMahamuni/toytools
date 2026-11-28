// Friends dinner split. Equal shares, with the last person taking leftover paise
// so the shares sum to the total. Not a UPI fee tool. No accounts.

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { money } from '../format';
import { insight, milestone, assumption, toolDecision } from '../story';
import { parseAmount } from '../validation';
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

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

function readBill(raw: unknown, ei: Record<string, any> = {}): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null) return { ok: false, result: fail(ei.errBillEmpty ?? 'Enter the bill total.') };
  const text = typeof raw === 'number' ? String(raw) : String(raw).trim();
  if (text === '') return { ok: false, result: fail(ei.errBillEmpty ?? 'Enter the bill total.') };
  const n = parseAmount(text);
  if (!Number.isFinite(n)) return { ok: false, result: fail(ei.errBillNaN ?? 'Bill total must be a number.') };
  if (n <= 0) return { ok: false, result: fail(ei.errBillPos ?? 'Bill total must be greater than zero.') };
  if (!atMostTwoDecimals(n)) return { ok: false, result: fail(ei.errBillDec ?? 'Enter rupees with at most two decimal places.') };
  if (n > BILL_PAGE_CAP) return { ok: false, result: fail(ei.errBillCap ?? 'That bill is above the 10,00,00,000 page limit.') };
  return { ok: true, value: n };
}

function readPeople(raw: unknown, ei: Record<string, any> = {}): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null || raw === '') return { ok: false, result: fail(ei.errPeopleEmpty ?? 'Enter how many people, from 2 to 30.') };
  const n = parseAmount(raw);
  if (!Number.isFinite(n)) return { ok: false, result: fail(ei.errPeopleNaN ?? 'People must be a number.') };
  if (!Number.isInteger(n)) return { ok: false, result: fail(ei.errPeopleInt ?? 'People must be a whole number.') };
  if (n < PEOPLE_MIN || n > PEOPLE_MAX) return { ok: false, result: fail(ei.errPeopleRange ?? 'People must be from 2 to 30.') };
  return { ok: true, value: n };
}

function readTip(raw: unknown, ei: Record<string, any> = {}): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null || raw === '') return { ok: true, value: 0 };
  const n = parseAmount(raw);
  if (!Number.isFinite(n)) return { ok: false, result: fail(ei.errTipNaN ?? 'Tip percent must be a number.') };
  if (n < 0 || n > TIP_MAX) return { ok: false, result: fail(ei.errTipRange ?? 'Tip percent must be from 0 to 30.') };
  if (!Number.isInteger(n)) return { ok: false, result: fail(ei.errTipInt ?? 'Tip percent must be a whole number.') };
  return { ok: true, value: n };
}

export const splitBillCalc: FinanceCalculator = {
  id: 'split-bill',
  family: 'bill',
  fixedCurrency: 'INR',
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

  calculate(input, opts) {
    const loc = opts?.locale && opts.locale !== 'en' ? opts.locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};

    const bill = readBill(input.bill, ei);
    if (!bill.ok) return bill.result;
    const people = readPeople(input.people, ei);
    if (!people.ok) return people.result;
    const tip = readTip(input.tip, ei);
    if (!tip.ok) return tip.result;

    const split = splitBillFair(bill.value, people.value, tip.value);
    const total = rupeesFromPaise(split.totalPaise);
    const each = rupeesFromPaise(split.sharesPaise[0]);
    const last = rupeesFromPaise(split.sharesPaise[split.sharesPaise.length - 1]);
    const even = split.remainderPaise === 0;
    const eachLine = ei.eachLineTpl
      ? tpl(ei.eachLineTpl, { each: money(each, 'INR') })
      : `Each person pays ${money(each, 'INR')}.`;
    const note = even
      ? (ei.noteEvenTpl ? tpl(ei.noteEvenTpl, { n: people.value, eachLine }) : `${people.value} people. ${eachLine}`)
      : (ei.noteOddTpl ? tpl(ei.noteOddTpl, { n: people.value, eachLine, last: money(last, 'INR') }) : `${people.value} people. ${eachLine} The last person pays ${money(last, 'INR')}.`);

    const hero = card('total', ei.heroLabel ?? 'Total with tip', money(total, 'INR'), {
      raw: total,
      emphasis: 'hero',
      note,
    });
    return successResult({
      hero,
      metrics: [hero],
      insights: [
        even
          ? insight(ei.insEven ?? 'Each share is the same.')
          : insight(ei.insOdd ?? 'The last person takes the leftover paise.', 'info'),
      ],
      milestones: [milestone(ei.msSum ?? 'Shares sum to the total', true)],
      assumptions: [
        assumption(ei.asmTip ?? 'Tip', tip.value === 0 ? (ei.noTip ?? 'No tip') : `${tip.value}%`),
        assumption(ei.asmPeople ?? 'People', String(people.value)),
        assumption(ei.asmRem ?? 'Remainder paise', String(split.remainderPaise)),
      ],
      decisions: [
        toolDecision('Work out a tip percent on the tip calculator', 'tip-calculator'),
      ].map((d) => (d.tool?.slug === 'tip-calculator' && ei.decTip ? { ...d, label: ei.decTip } : d)),
      meta: { total, remainderPaise: split.remainderPaise, people: people.value, each, last },
    });
  },
};
