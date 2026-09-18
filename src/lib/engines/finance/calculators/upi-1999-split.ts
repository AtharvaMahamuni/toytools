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

export function chunkSumLine(chunks: number[], amount: number): string {
  if (chunks.length > 12) {
    return `${chunks.length} chunks sum to ${amount}.`;
  }
  return `${chunks.join(' + ')} = ${amount}`;
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
    return { ok: false, result: fail('That is above the 10,00,000 cap, so this page will not list the chunks.') };
  }
  return { ok: true, value: n };
}

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
      return successResult({
        hero: card('count', ONE_PAYMENT, '1', { raw: 1, emphasis: 'hero' }),
        metrics: [
          card('p1', 'Payment 1', moneyWhole(amount.value, 'INR'), { raw: amount.value }),
        ],
        insights: [insight(ONE_PAYMENT)],
        milestones: [milestone('Nothing to split', true)],
        assumptions: [
          { id: 'threshold', label: 'Threshold', value: '2000, locked' },
          { id: 'chunk', label: 'Chunk', value: '1999, locked' },
        ],
        decisions: [
          decision('Open the tax calculator when you have a real rate', '/tool/number/tax-calculator/'),
        ],
        explanation: 'The total is 2000 rupees or less, so the page does not split it. This is a meme calculator. It does not send a payment.',
      });
    }

    const chunks = splitWholeRupees(amount.value);
    const line = chunkSumLine(chunks, amount.value);
    return successResult({
      hero: card('count', 'payments', String(chunks.length), {
        raw: chunks.length,
        emphasis: 'hero',
        note: line,
      }),
      metrics: chunks.map((value, i) =>
        card(`p${i + 1}`, `Payment ${i + 1}`, moneyWhole(value, 'INR'), { raw: value }),
      ),
      insights: [
        insight(line, 'info'),
        insight(
          'A customer does not owe a 2000 rupee UPI tax. Splitting does not hide the total from the person you paid.',
          'caution',
        ),
      ],
      milestones: [milestone('Sum matches the typed total', true)],
      assumptions: [
        { id: 'threshold', label: 'Threshold', value: '2000, locked' },
        { id: 'chunk', label: 'Chunk', value: '1999, locked' },
      ],
      decisions: [
        decision('Open the tax calculator when you have a real rate', '/tool/number/tax-calculator/'),
      ],
      explanation: 'Whole rupees only. Take 1999 as many times as it fits, then the remainder. The chunks add up to the same total. This page does not pay anyone.',
    });
  },
};
