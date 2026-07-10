import { describe, it, expect } from 'vitest';
import {
  ageBetween, compareCivil, daysBetween, daysInMonth, nextBirthday, parseISODate, weekdayOf,
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
