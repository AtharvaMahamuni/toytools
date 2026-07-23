// Pure-model tests for the tracker engine: date arithmetic, entry upsert/increment, day-series
// filling, and the streak logic (including the "today grace" rule and goal vs logged qualifiers).

import { describe, expect, it } from 'vitest';
import {
  dayNumber,
  isoFromDayNumber,
  todayIso,
  upsert,
  increment,
  valueOn,
  total,
  lastNDays,
  currentStreak,
  longestStreak,
  movingAverage,
  type Entry,
} from './model';

const geq = (goal: number) => (v: number) => v >= goal;
const always = () => true;

describe('date arithmetic', () => {
  it('round-trips a date through its day-number', () => {
    expect(isoFromDayNumber(dayNumber('2026-07-23'))).toBe('2026-07-23');
    // Consecutive days differ by exactly 1, across a month boundary.
    expect(dayNumber('2026-08-01') - dayNumber('2026-07-31')).toBe(1);
  });

  it('formats a local date without timezone drift', () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('entries', () => {
  it('upserts a day, replacing an existing value and staying sorted', () => {
    let e: Entry[] = [];
    e = upsert(e, '2026-07-22', 5);
    e = upsert(e, '2026-07-20', 3);
    e = upsert(e, '2026-07-22', 8); // replace
    expect(e.map((x) => x.date)).toEqual(['2026-07-20', '2026-07-22']);
    expect(valueOn(e, '2026-07-22')).toBe(8);
    expect(total(e)).toBe(11);
  });

  it('removes a day when its value drops to zero', () => {
    let e = upsert([], '2026-07-22', 5);
    e = upsert(e, '2026-07-22', 0);
    expect(e).toHaveLength(0);
  });

  it('increments and floors at zero', () => {
    let e = increment([], '2026-07-22', 1); // 0 -> 1
    e = increment(e, '2026-07-22', 1); // 1 -> 2
    expect(valueOn(e, '2026-07-22')).toBe(2);
    e = increment(e, '2026-07-22', -5); // floors at 0 (and removes)
    expect(valueOn(e, '2026-07-22')).toBe(0);
  });
});

describe('lastNDays', () => {
  it('returns a fixed-width series ending today, filling gaps with zero', () => {
    const e = [
      { date: '2026-07-21', value: 6 },
      { date: '2026-07-23', value: 8 },
    ];
    const series = lastNDays(e, '2026-07-23', 3);
    expect(series).toEqual([
      { date: '2026-07-21', value: 6 },
      { date: '2026-07-22', value: 0 },
      { date: '2026-07-23', value: 8 },
    ]);
  });
});

describe('currentStreak', () => {
  const full = [
    { date: '2026-07-20', value: 8 },
    { date: '2026-07-21', value: 8 },
    { date: '2026-07-22', value: 8 },
    { date: '2026-07-23', value: 8 },
  ];

  it('counts consecutive qualifying days including today', () => {
    expect(currentStreak(full, '2026-07-23', geq(8))).toBe(4);
  });

  it('gives today grace: a missing current day counts from yesterday', () => {
    const noToday = full.slice(0, 3); // 20,21,22
    expect(currentStreak(noToday, '2026-07-23', geq(8))).toBe(3);
  });

  it('breaks on a gap', () => {
    const gap = [
      { date: '2026-07-20', value: 8 },
      { date: '2026-07-21', value: 8 },
      { date: '2026-07-23', value: 8 }, // 22 missing
    ];
    expect(currentStreak(gap, '2026-07-23', geq(8))).toBe(1);
  });

  it('respects the goal: a day below goal does not qualify', () => {
    const below = [
      { date: '2026-07-22', value: 8 },
      { date: '2026-07-23', value: 5 }, // below goal 8
    ];
    // Today (5) fails goal; grace falls back to yesterday (8) -> streak 1.
    expect(currentStreak(below, '2026-07-23', geq(8))).toBe(1);
  });

  it('logged mode counts any entry regardless of value', () => {
    const logged = [
      { date: '2026-07-22', value: 70.2 },
      { date: '2026-07-23', value: 69.9 },
    ];
    expect(currentStreak(logged, '2026-07-23', always)).toBe(2);
  });
});

describe('longestStreak', () => {
  it('finds the longest consecutive qualifying run in history', () => {
    const e = [
      { date: '2026-07-01', value: 8 },
      { date: '2026-07-02', value: 8 },
      { date: '2026-07-03', value: 8 },
      { date: '2026-07-05', value: 8 },
      { date: '2026-07-06', value: 8 },
    ];
    expect(longestStreak(e, geq(8))).toBe(3);
  });
});

describe('movingAverage', () => {
  it('averages a trailing window, clamping at the start', () => {
    expect(movingAverage([1, 2, 3, 4], 2)).toEqual([1, 1.5, 2.5, 3.5]);
  });
});
