import { describe, it, expect } from 'vitest';
import {
  addMonthsClamped, ageBetween, compareCivil, daysBetween, daysInMonth, nextBirthday, parseISODate, weekdayOf,
} from './models';

describe('parseISODate', () => {
  it('parses a plain date', () => {
    expect(parseISODate('2026-07-08')).toEqual({ y: 2026, m: 7, d: 8 });
  });
  it('takes the date part of a datetime-local value', () => {
    expect(parseISODate('2026-07-08T14:30')).toEqual({ y: 2026, m: 7, d: 8 });
  });
  it('rejects malformed, out-of-range, and non-existent dates', () => {
    expect(parseISODate('nope')).toBeNull();
    expect(parseISODate('2026-13-01')).toBeNull();
    expect(parseISODate('2026-02-30')).toBeNull();
    expect(parseISODate('2025-02-29')).toBeNull(); // 2025 is not a leap year
  });
  it('accepts a real leap day', () => {
    expect(parseISODate('2024-02-29')).toEqual({ y: 2024, m: 2, d: 29 });
  });
});

describe('daysInMonth', () => {
  it('knows month lengths and leap February', () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2025, 2)).toBe(28);
  });
});

describe('daysBetween', () => {
  it('counts whole days and spans a leap day', () => {
    expect(daysBetween({ y: 2026, m: 1, d: 1 }, { y: 2026, m: 1, d: 2 })).toBe(1);
    expect(daysBetween({ y: 2024, m: 2, d: 28 }, { y: 2024, m: 3, d: 1 })).toBe(2); // includes Feb 29
    expect(daysBetween({ y: 2023, m: 2, d: 28 }, { y: 2023, m: 3, d: 1 })).toBe(1);
  });
  it('is negative when the second date is earlier', () => {
    expect(daysBetween({ y: 2026, m: 1, d: 10 }, { y: 2026, m: 1, d: 1 })).toBe(-9);
  });
});

describe('ageBetween', () => {
  it('computes the standard borrow case', () => {
    expect(ageBetween({ y: 1990, m: 5, d: 15 }, { y: 2026, m: 7, d: 8 }))
      .toEqual({ years: 36, months: 1, days: 23 });
  });
  it('is all zeros on the exact birthday', () => {
    expect(ageBetween({ y: 2000, m: 2, d: 29 }, { y: 2024, m: 2, d: 29 }))
      .toEqual({ years: 24, months: 0, days: 0 });
  });
  it('borrows across a year boundary (Jan ref, Dec birth month)', () => {
    expect(ageBetween({ y: 2000, m: 12, d: 20 }, { y: 2026, m: 1, d: 10 }))
      .toEqual({ years: 25, months: 0, days: 21 }); // Dec has 31 days: 10 - 20 + 31 = 21
  });
});

describe('ageBetween: anchor-month clamping at month ends (bug log Phase B batch 2)', () => {
  const c = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return { y, m, d }; };
  it.each([
    ['2000-01-31', '2000-03-01', { years: 0, months: 1, days: 1 }], // anchor 29 Feb 2000 (leap)
    ['1990-03-31', '1990-05-01', { years: 0, months: 1, days: 1 }], // anchor 30 Apr
    ['2026-01-31', '2026-03-01', { years: 0, months: 1, days: 1 }], // anchor 28 Feb
    ['2026-03-31', '2026-05-01', { years: 0, months: 1, days: 1 }], // anchor 30 Apr
    ['1990-01-31', '1990-03-02', { years: 0, months: 1, days: 2 }],
    ['2001-01-30', '2001-03-01', { years: 0, months: 1, days: 1 }],
    ['2026-01-31', '2026-02-27', { years: 0, months: 0, days: 27 }],
    ['2026-01-31', '2026-02-28', { years: 0, months: 1, days: 0 }],
    ['2026-01-31', '2026-03-31', { years: 0, months: 2, days: 0 }], // measured from the anchor, no drift
    ['2000-02-29', '2027-02-28', { years: 27, months: 0, days: 0 }], // leap-day birthday clamps to 28 Feb
    ['2000-02-29', '2027-02-27', { years: 26, months: 11, days: 29 }], // anchor 29 Jan 2027
    ['2000-02-29', '2027-03-01', { years: 27, months: 0, days: 1 }],
    ['2000-02-29', '2028-02-29', { years: 28, months: 0, days: 0 }],
  ])('%s to %s', (a, b, want) => {
    expect(ageBetween(c(a), c(b))).toEqual(want);
  });

  it('never returns negative days over every pair in a two-year window', () => {
    for (let i = 0; i < 730; i += 3) {
      const a = { y: 2023 + Math.floor(i / 365), m: (Math.floor(i / 31) % 12) + 1, d: (i % 31) + 1 };
      if (a.d > 28) a.d = Math.min(a.d, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][a.m - 1]);
      for (let j = 0; j < 400; j += 7) {
        const b = { y: a.y + 1, m: ((a.m + Math.floor(j / 31)) % 12) + 1, d: (j % 28) + 1 };
        if (compareCivil(a, b) > 0) continue;
        const r = ageBetween(a, b);
        expect(r.days).toBeGreaterThanOrEqual(0);
        expect(r.months).toBeGreaterThanOrEqual(0);
        expect(r.months).toBeLessThan(12);
        // The y/m/d parts land exactly on the reference date.
        const anchor = addMonthsClamped(a, r.years * 12 + r.months);
        expect(daysBetween(anchor, b)).toBe(r.days);
        expect(r.days).toBeLessThan(31);
      }
    }
  });
});

describe('addMonthsClamped', () => {
  it('clamps to the last day of a shorter month', () => {
    expect(addMonthsClamped({ y: 2026, m: 1, d: 31 }, 1)).toEqual({ y: 2026, m: 2, d: 28 });
    expect(addMonthsClamped({ y: 2024, m: 1, d: 31 }, 1)).toEqual({ y: 2024, m: 2, d: 29 });
    expect(addMonthsClamped({ y: 2000, m: 2, d: 29 }, 12)).toEqual({ y: 2001, m: 2, d: 28 });
  });
  it('crosses year boundaries', () => {
    expect(addMonthsClamped({ y: 2025, m: 11, d: 15 }, 3)).toEqual({ y: 2026, m: 2, d: 15 });
  });
});

describe('nextBirthday', () => {
  it('returns this year when the birthday is still ahead', () => {
    expect(nextBirthday({ y: 1990, m: 12, d: 25 }, { y: 2026, m: 7, d: 8 }))
      .toEqual({ y: 2026, m: 12, d: 25 });
  });
  it('rolls to next year when the birthday has passed', () => {
    expect(nextBirthday({ y: 1990, m: 5, d: 15 }, { y: 2026, m: 7, d: 8 }))
      .toEqual({ y: 2027, m: 5, d: 15 });
  });
  it('clamps a Feb 29 birthday to Feb 28 in a non-leap year', () => {
    expect(nextBirthday({ y: 2000, m: 2, d: 29 }, { y: 2025, m: 6, d: 1 }))
      .toEqual({ y: 2026, m: 2, d: 28 });
  });
  it('is today on 28 Feb for a Feb 29 birthday in a non-leap year', () => {
    expect(nextBirthday({ y: 2000, m: 2, d: 29 }, { y: 2027, m: 2, d: 28 }))
      .toEqual({ y: 2027, m: 2, d: 28 });
  });
});

describe('weekdayOf', () => {
  it('knows real weekdays (0 = Sunday)', () => {
    expect(weekdayOf({ y: 2026, m: 7, d: 8 })).toBe(3); // Wednesday
    expect(weekdayOf({ y: 1990, m: 5, d: 15 })).toBe(2); // Tuesday
  });
});

describe('compareCivil', () => {
  it('orders dates', () => {
    expect(compareCivil({ y: 2026, m: 1, d: 1 }, { y: 2026, m: 1, d: 2 })).toBeLessThan(0);
    expect(compareCivil({ y: 2026, m: 2, d: 1 }, { y: 2026, m: 1, d: 1 })).toBeGreaterThan(0);
    expect(compareCivil({ y: 2026, m: 1, d: 1 }, { y: 2026, m: 1, d: 1 })).toBe(0);
  });
});
