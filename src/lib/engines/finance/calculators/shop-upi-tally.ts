// Local monthly tally of UPI receipts for a small shop.
// The band of 1,00,000 is a reference line, not a status change.
// Storage key, owned by the widget: toytools.shop-upi-tally.v1

import type { FinanceCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { money } from '../format';
import { insight, milestone, assumption, decision } from '../story';

export const SHOP_BAND = 100_000;
export const SHOP_STORE_KEY = 'toytools.shop-upi-tally.v1';
export const SHOP_PAGE_CAP_PAISE = 100_000_000 * 100;

export const SHOP_CAUTION =
  'This is your own tally, not your bank or NPCI category. Crossing or staying under 1,00,000 rupees here does not change your merchant status. Clearing site data deletes it.';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface ShopEntry {
  id: string;
  paise: number;
  at: string;
}

export interface ShopStore {
  v: 1;
  entries: ShopEntry[];
}

export function monthKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function monthLabelLocal(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export interface MonthTally {
  monthKey: string;
  monthLabel: string;
  totalRupees: number;
  deltaRupees: number;
  count: number;
  receiptPaise: number[];
  /** Newest first, at most three, this month only. */
  latestPaise: number[];
}

export function tallyMonth(entries: ShopEntry[], now: Date): MonthTally {
  const key = monthKeyLocal(now);
  const receiptPaise: number[] = [];
  for (const entry of entries) {
    const at = new Date(entry.at);
    if (Number.isNaN(at.getTime())) continue;
    if (monthKeyLocal(at) !== key) continue;
    receiptPaise.push(entry.paise);
  }
  const totalPaise = receiptPaise.reduce((sum, n) => sum + n, 0);
  const totalRupees = totalPaise / 100;
  return {
    monthKey: key,
    monthLabel: monthLabelLocal(now),
    totalRupees,
    deltaRupees: totalRupees - SHOP_BAND,
    count: receiptPaise.length,
    receiptPaise,
    latestPaise: receiptPaise.slice(-3).reverse(),
  };
}

function fail(message: string): { ok: false; error: string } {
  return { ok: false, error: message };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readPaise(raw: Record<string, unknown>): number | null {
  if (typeof raw.paise === 'number' && Number.isInteger(raw.paise)) return raw.paise;
  if (typeof raw.rupees === 'number' && Number.isFinite(raw.rupees)) {
    const paise = Math.round(raw.rupees * 100);
    if (Math.abs(raw.rupees * 100 - paise) < 1e-6) return paise;
  }
  if (typeof raw.amount === 'number' && Number.isFinite(raw.amount)) {
    const paise = Math.round(raw.amount * 100);
    if (Math.abs(raw.amount * 100 - paise) < 1e-6) return paise;
  }
  return null;
}

export function parseShopStore(raw: unknown): { ok: true; store: ShopStore } | { ok: false; error: string } {
  let value = raw;
  if (typeof value === 'string') {
    const text = value.trim();
    if (text === '' || text === '[]') return { ok: true, store: { v: 1, entries: [] } };
    try {
      value = JSON.parse(text);
    } catch {
      return fail('That is not JSON.');
    }
  }
  if (Array.isArray(value)) value = { v: 1, entries: value };
  const rec = asRecord(value);
  if (!rec) return fail('This file is not a shop tally export.');
  if (rec.v !== undefined && rec.v !== 1) return fail('This file is not a shop tally export.');
  if (!Array.isArray(rec.entries)) return fail('This file is not a shop tally export.');
  const entries: ShopEntry[] = [];
  for (const item of rec.entries) {
    const row = asRecord(item);
    if (!row) return fail('One receipt in this file is not an object.');
    const paise = readPaise(row);
    if (paise === null || paise <= 0) return fail('Each receipt needs a positive amount.');
    if (paise > SHOP_PAGE_CAP_PAISE) return fail('One receipt is above the 10,00,00,000 page limit.');
    const at = typeof row.at === 'string' ? row.at : '';
    const when = new Date(at);
    if (!at || Number.isNaN(when.getTime())) return fail('Each receipt needs a date.');
    const id = typeof row.id === 'string' && row.id.trim() ? row.id.trim() : `e${entries.length + 1}`;
    entries.push({ id, paise, at: when.toISOString() });
  }
  return { ok: true, store: { v: 1, entries } };
}

function gapCard(delta: number) {
  const abs = Math.abs(delta);
  if (delta < 0) {
    return card('gap', 'Under 1,00,000', money(abs, 'INR'), { raw: delta });
  }
  if (delta > 0) {
    return card('gap', 'Over 1,00,000', money(abs, 'INR'), { raw: delta });
  }
  return card('gap', 'At 1,00,000', money(0, 'INR'), { raw: 0 });
}

export const shopUpiTally: FinanceCalculator = {
  id: 'shop-upi-tally',
  family: 'tally',
  fields: [
    {
      id: 'entries',
      label: 'Receipts JSON',
      type: 'text',
      default: '[]',
      multiline: true,
      help: 'The page keeps this on your device under toytools.shop-upi-tally.v1.',
    },
    {
      id: 'now',
      label: 'As of',
      type: 'text',
      default: '',
      optional: true,
      help: 'Leave blank to use this device clock. The month is the local calendar month.',
    },
  ],

  calculate(input): InteractiveResult {
    const parsed = parseShopStore(input.entries ?? '[]');
    if (!parsed.ok) return validationError(parsed.error);
    const nowRaw = input.now;
    let now = new Date();
    if (typeof nowRaw === 'string' && nowRaw.trim()) {
      now = new Date(nowRaw);
      if (Number.isNaN(now.getTime())) return validationError('The as-of date is not a date.');
    }
    const tally = tallyMonth(parsed.store.entries, now);
    return successResult({
      hero: card('total', 'This month', money(tally.totalRupees, 'INR'), {
        raw: tally.totalRupees,
        emphasis: 'hero',
        note: tally.monthLabel,
      }),
      metrics: [
        gapCard(tally.deltaRupees),
        card('count', 'Receipts this month', String(tally.count), { raw: tally.count }),
      ],
      insights: [insight(SHOP_CAUTION, 'caution')],
      milestones: [milestone('Merchant status unchanged on this page', true)],
      assumptions: [
        assumption('Month', tally.monthLabel),
        assumption('Band', '1,00,000 rupees, a reference line only'),
      ],
      decisions: [
        decision('Estimate a merchant MDR on a different page', '/tool/finance/upi-mdr-estimator/'),
      ],
      explanation: SHOP_CAUTION,
      meta: {
        total: tally.totalRupees,
        delta: tally.deltaRupees,
        count: tally.count,
        normalized: JSON.stringify(parsed.store),
        latest: tally.latestPaise.join(','),
      },
    });
  },
};
