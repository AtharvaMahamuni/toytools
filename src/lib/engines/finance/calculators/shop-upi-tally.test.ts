import { describe, it, expect } from 'vitest';
import { runFinance } from '../registry';
import {
  monthKeyLocal,
  tallyMonth,
  parseShopStore,
  SHOP_BAND,
  SHOP_CAUTION,
  SHOP_STORE_KEY,
  type ShopEntry,
} from './shop-upi-tally';

const INR = { currency: 'INR' };

function entry(paise: number, at: Date, id: string): ShopEntry {
  return { id, paise, at: at.toISOString() };
}

describe('shop month roll', () => {
  const now = new Date(2026, 8, 18, 12, 0, 0);

  it('names the local calendar month', () => {
    expect(monthKeyLocal(now)).toBe('2026-09');
    expect(monthKeyLocal(new Date(2026, 7, 31, 23, 0, 0))).toBe('2026-08');
  });

  it('sums this month and ignores the previous month', () => {
    const entries = [
      entry(40000, new Date(2026, 8, 2, 10, 0, 0), 'a'),
      entry(25000, new Date(2026, 8, 18, 11, 0, 0), 'b'),
      entry(1_000_000, new Date(2026, 7, 28, 9, 0, 0), 'old'),
    ];
    const tally = tallyMonth(entries, now);
    expect(tally.monthKey).toBe('2026-09');
    expect(tally.monthLabel).toBe('September 2026');
    expect(tally.count).toBe(2);
    expect(tally.totalRupees).toBe(650);
    expect(tally.deltaRupees).toBe(650 - SHOP_BAND);
    expect(tally.receiptPaise.reduce((a, b) => a + b, 0)).toBe(65000);
    expect(tally.latestPaise).toEqual([25000, 40000]);
  });

  it('starts the next month at zero without deleting older receipts from the file', () => {
    const store = parseShopStore({
      v: 1,
      entries: [entry(50000, new Date(2026, 8, 4, 8, 0, 0), 'sep')],
    });
    expect(store.ok).toBe(true);
    if (!store.ok) return;
    const october = tallyMonth(store.store.entries, new Date(2026, 9, 1, 9, 0, 0));
    expect(october.totalRupees).toBe(0);
    expect(october.count).toBe(0);
    expect(store.store.entries).toHaveLength(1);
  });
});

describe('shop-upi-tally calculator', () => {
  it('places 650 rupees under the 1,00,000 line and keeps the caution', () => {
    const body = {
      v: 1,
      entries: [
        { id: 'a', paise: 40000, at: new Date(2026, 8, 2, 10).toISOString() },
        { id: 'b', rupees: 250, at: new Date(2026, 8, 18, 11).toISOString() },
        { id: 'old', amount: 10000, at: new Date(2026, 7, 20, 11).toISOString() },
      ],
    };
    const r = runFinance(
      'shop-upi-tally',
      { entries: JSON.stringify(body), now: new Date(2026, 8, 18, 12).toISOString() },
      INR,
    );
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(650);
    expect(r.hero?.note).toBe('September 2026');
    expect(r.metrics.find((m) => m.id === 'gap')?.raw).toBe(650 - 100000);
    expect(r.metrics.find((m) => m.id === 'gap')?.label).toBe('Under 1,00,000');
    expect(r.metrics.find((m) => m.id === 'count')?.raw).toBe(2);
    expect(r.meta?.latest).toBe('25000,40000');
    expect(r.insights?.[0]?.text).toBe(SHOP_CAUTION);
    expect(r.explanation).toContain('does not change your merchant status');
    expect(SHOP_STORE_KEY).toBe('toytools.shop-upi-tally.v1');
  });

  it('names the line when the month is over or exactly on the band', () => {
    const on = runFinance(
      'shop-upi-tally',
      {
        entries: JSON.stringify({
          v: 1,
          entries: [{ id: 'a', paise: 10_000_000, at: new Date(2026, 8, 1, 12).toISOString() }],
        }),
        now: new Date(2026, 8, 18).toISOString(),
      },
      INR,
    );
    expect(on.metrics.find((m) => m.id === 'gap')?.label).toBe('At 1,00,000');
    const over = runFinance(
      'shop-upi-tally',
      {
        entries: JSON.stringify({
          v: 1,
          entries: [{ id: 'a', paise: 10_000_100, at: new Date(2026, 8, 1, 12).toISOString() }],
        }),
        now: new Date(2026, 8, 18).toISOString(),
      },
      INR,
    );
    expect(over.metrics.find((m) => m.id === 'gap')?.label).toBe('Over 1,00,000');
    expect(over.metrics.find((m) => m.id === 'gap')?.raw).toBe(1);
  });

  it('rejects a broken file and an undated receipt', () => {
    expect(runFinance('shop-upi-tally', { entries: '{', now: '' }, INR).ok).toBe(false);
    expect(runFinance('shop-upi-tally', { entries: '{"v":2,"entries":[]}' }, INR).error).toMatch(/not a shop tally/);
    expect(
      runFinance(
        'shop-upi-tally',
        { entries: JSON.stringify({ v: 1, entries: [{ paise: 100 }] }) },
        INR,
      ).error,
    ).toMatch(/date/);
    expect(runFinance('shop-upi-tally', { entries: '[]', now: 'nope' }, INR).error).toMatch(/not a date/);
    expect(runFinance('shop-upi-tally', { entries: '[]' }, INR).ok).toBe(true);
    expect(parseShopStore('').ok).toBe(true);
    expect(parseShopStore(null).ok).toBe(false);
    expect(parseShopStore([{ paise: 100, at: new Date(2026, 8, 1).toISOString() }]).ok).toBe(true);
    expect(parseShopStore({ entries: 'nope' }).ok).toBe(false);
    expect(parseShopStore({ v: 1, entries: ['x'] }).error).toMatch(/not an object/);
    expect(parseShopStore({ v: 1, entries: [{ at: new Date().toISOString() }] }).error).toMatch(/positive amount/);
    expect(parseShopStore({ v: 1, entries: [{ paise: 0, at: new Date().toISOString() }] }).ok).toBe(false);
    expect(parseShopStore({ v: 1, entries: [{ paise: 1.5, at: new Date().toISOString() }] }).ok).toBe(false);
    expect(parseShopStore({ v: 1, entries: [{ rupees: 1.234, at: new Date().toISOString() }] }).ok).toBe(false);
    expect(parseShopStore({ v: 1, entries: [{ amount: 1.234, at: new Date().toISOString() }] }).ok).toBe(false);
    expect(
      parseShopStore({ v: 1, entries: [{ paise: 100_000_000 * 100 + 1, at: new Date().toISOString() }] }).error,
    ).toMatch(/page limit/);
    const assigned = parseShopStore({ v: 1, entries: [{ rupees: 12, at: '2026-09-02T00:00:00.000Z' }] });
    expect(assigned.ok).toBe(true);
    if (assigned.ok) expect(assigned.store.entries[0]?.id).toBe('e1');
    expect(parseShopStore({ v: 1, entries: [{ paise: 100, at: 5 }] }).error).toMatch(/date/);
  });
});
