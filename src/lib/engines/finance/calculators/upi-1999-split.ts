// UPI 1999 Split. A meme calculator, not a payment tool.
// Threshold 2000 and chunk 1999 are locked. Whole rupees only, integer subtraction,
// so the chunks sum to the input with no paise and no rounding.

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { moneyWhole } from '../format';
import { insight, milestone, decision } from '../story';

export const UPI_THRESHOLD = 2000;
export const UPI_CHUNK = 1999;
export const UPI_CAP = 1_000_000;

const ONE_PAYMENT = 'One payment. Nothing to split.';

function fail(message: string): InteractiveResult {
  return validationError(message);
}

/** Whole rupees above the threshold: as many 1999s as fit, then the remainder. */
export function splitWholeRupees(amount: number): number[] {
  const chunks: number[] = [];
  let left = amount;
  while (left > UPI_CHUNK) {
    chunks.push(UPI_CHUNK);
    left -= UPI_CHUNK;
  }
  chunks.push(left);
  return chunks;
}

/** Identical 1999s collapse. "2 × ₹1,999, then ₹1,002". A clean divide is "2 × ₹1,999" only. */
export function groupedSplitLine(chunks: number[]): string {
  const full = chunks.filter((n) => n === UPI_CHUNK).length;
  const rest = chunks.find((n) => n !== UPI_CHUNK);
  const chunkLabel = moneyWhole(UPI_CHUNK, 'INR');
  if (rest === undefined) return `${full} × ${chunkLabel}`;
  return `${full} × ${chunkLabel}, then ${moneyWhole(rest, 'INR')}`;
}

export function paymentCountLabel(count: number): string {
  return count === 1 ? '1 payment' : `${count} payments`;
}

export function partsSumLine(amount: number): string {
  return `The parts sum to ${moneyWhole(amount, 'INR')}.`;
}

export function onePaymentLine(amount: number): string {
  return `One payment of ${moneyWhole(amount, 'INR')}. Nothing to split.`;
}

function readAmount(raw: unknown): { ok: true; value: number } | { ok: false; result: InteractiveResult } {
  if (raw === undefined || raw === null) return { ok: false, result: fail('Enter total rupees to pay.') };
  const text = typeof raw === 'number' ? String(raw) : String(raw).trim();
  if (text === '') return { ok: false, result: fail('Enter total rupees to pay.') };
  const n = Number(text.replace(/,/g, '').replace(/\s/g, ''));
  if (!Number.isFinite(n)) return { ok: false, result: fail('Total rupees must be a number.') };
  if (n <= 0) return { ok: false, result: fail('Total rupees must be greater than zero.') };
  if (!Number.isInteger(n)) return { ok: false, result: fail('Enter whole rupees only. No paise.') };
  if (n > UPI_CAP) {
    return { ok: false, result: fail('That is above the 10,00,000 cap, so this page will not split it.') };
  }
  return { ok: true, value: n };
}

const VPA_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}@[A-Za-z][A-Za-z0-9]{1,63}$/;

export const UPI_VPA_HINT = 'That does not look like a UPI ID. Use name@handle.';

export function looksLikeVpa(raw: string): boolean {
  return VPA_RE.test(String(raw ?? '').trim());
}

/** Whole-rupee payments this page can open. Null when the total is not a legal input. */
export function payableChunks(amount: number): number[] | null {
  if (!Number.isInteger(amount) || amount <= 0 || amount > UPI_CAP) return null;
  if (amount <= UPI_THRESHOLD) return [amount];
  return splitWholeRupees(amount);
}

export function paymentHeading(index: number, total: number, amount: number): string {
  return `Payment ${index + 1} of ${total} \u00b7 ${moneyWhole(amount, 'INR')}`;
}

/**
 * upi://pay with pa, am, cu, and a short tn only.
 * No payee name (pn) and no invented transaction id (tid, tr).
 */
export function upiPayHref(vpa: string, amount: number, index: number, total: number): string {
  const tn = `Payment ${index + 1} of ${total}`;
  const query = [
    ['pa', vpa.trim()],
    ['am', String(amount)],
    ['cu', 'INR'],
    ['tn', tn],
  ]
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return `upi://pay?${query}`;
}

export interface UpiNextPayView {
  index: number;
  total: number;
  amount: number;
  label: string;
  href: string | null;
  vpaMessage: string | null;
  allMarked: boolean;
  signature: string;
}

/** The one chunk on screen. Empty VPA means no link. A bad VPA means a message and no link. */
export function describeUpiNextPay(amount: number, vpaRaw: string, doneCount: number): UpiNextPayView | null {
  const chunks = payableChunks(amount);
  if (!chunks || chunks.length === 0) return null;
  const total = chunks.length;
  const done = Math.max(0, Math.min(Math.trunc(Number(doneCount)) || 0, total));
  const allMarked = done >= total;
  const index = allMarked ? total - 1 : done;
  const vpa = String(vpaRaw ?? '').trim();
  let vpaMessage: string | null = null;
  let href: string | null = null;
  if (vpa !== '' && !VPA_RE.test(vpa)) {
    vpaMessage = UPI_VPA_HINT;
  } else if (vpa !== '' && !allMarked) {
    href = upiPayHref(vpa, chunks[index], index, total);
  }
  return {
    index: index + 1,
    total,
    amount: chunks[index],
    label: paymentHeading(index, total, chunks[index]),
    href,
    vpaMessage,
    allMarked,
    signature: chunks.join(','),
  };
}

/** A tick unlocks the next chunk. An untick steps back one. */
export function stepUpiDone(done: number, total: number, checked: boolean): number {
  const safeTotal = Math.max(0, Math.trunc(Number(total)) || 0);
  const current = Math.max(0, Math.min(Math.trunc(Number(done)) || 0, safeTotal));
  if (checked) return Math.min(safeTotal, current + 1);
  return Math.max(0, current - 1);
}

export const upiNextPay = {
  describe: describeUpiNextPay,
  step: stepUpiDone,
};

export const upi1999Split: FinanceCalculator = {
  id: 'upi-1999-split',
  family: 'savings',
  fields: [
    {
      id: 'amount',
      label: 'Total rupees to pay',
      type: 'integer',
      default: 5000,
      step: 1,
      suffix: '₹',
      help: 'Whole rupees. 2000 and 1999 stay locked. Cap is 10,00,000.',
      presets: [
        { label: '2,000', value: 2000 },
        { label: '5,000', value: 5000 },
        { label: '10,000', value: 10000 },
      ],
    },
  ],

  calculate(input) {
    const amount = readAmount(input.amount);
    if (!amount.ok) return amount.result;

    if (amount.value <= UPI_THRESHOLD) {
      const hero = card('line', 'Nothing to split', onePaymentLine(amount.value), {
        raw: amount.value,
        emphasis: 'hero',
      });
      return successResult({
        hero,
        metrics: [hero],
        insights: [insight(ONE_PAYMENT)],
        milestones: [milestone('Nothing to split', true)],
        assumptions: [
          { id: 'threshold', label: 'Threshold', value: '2000, locked' },
          { id: 'chunk', label: 'Chunk', value: '1999, locked' },
        ],
        decisions: [
          decision('Open the tax calculator when you have a real rate', '/tool/number/tax-calculator/'),
        ],
      });
    }

    const chunks = splitWholeRupees(amount.value);
    const hero = card('line', paymentCountLabel(chunks.length), groupedSplitLine(chunks), {
      raw: chunks.length,
      emphasis: 'hero',
      note: partsSumLine(amount.value),
    });
    return successResult({
      hero,
      metrics: [hero],
      insights: [
        insight('A customer does not owe a 2000 rupee UPI tax.', 'caution'),
      ],
      milestones: [milestone('Parts sum to the typed total', true)],
      assumptions: [
        { id: 'threshold', label: 'Threshold', value: '2000, locked' },
        { id: 'chunk', label: 'Chunk', value: '1999, locked' },
      ],
      decisions: [
        decision('Open the tax calculator when you have a real rate', '/tool/number/tax-calculator/'),
      ],
    });
  },
};
