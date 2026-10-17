import { describe, expect, it } from 'vitest';
import { cleanEntries, cleanGoal } from './model';
import { tracker, TRACKER_DEFS } from './registry';

describe('cleanEntries (restored backups, every tracker)', () => {
  it('refuses 99 h, -5 and "abc" on the sleep log and keeps the rest', () => {
    const max = TRACKER_DEFS['sleep-hours'].max;
    const res = cleanEntries(
      [
        { date: '2026-10-10', value: 7.5 },
        { date: '2026-10-11', value: 99 },
        { date: '2026-10-12', value: -5 },
        { date: '2026-10-13', value: 'abc' },
        { date: '2026-10-14', value: 16 },
      ],
      max,
    );
    expect(res.entries).toEqual([
      { date: '2026-10-10', value: 7.5 },
      { date: '2026-10-14', value: 16 },
    ]);
    expect(res.dropped).toBe(3);
    expect(res.entries.every((e) => Number.isFinite(e.value))).toBe(true);
  });

  it('refuses NaN, Infinity, numeric strings, bad dates and non-objects', () => {
    const res = cleanEntries([
      { date: '2026-10-10', value: NaN },
      { date: '2026-10-10', value: Infinity },
      { date: '2026-10-10', value: '7' },
      { date: '2026-02-30', value: 1 },
      { date: '10/10/2026', value: 1 },
      { value: 1 },
      null,
      5,
      'x',
    ]);
    expect(res.entries).toEqual([]);
    expect(res.dropped).toBe(9);
  });

  it('a tracker with no max still refuses a negative, and allows a large count', () => {
    const res = cleanEntries([{ date: '2026-10-10', value: 40 }, { date: '2026-10-11', value: -1 }]);
    expect(res.entries).toEqual([{ date: '2026-10-10', value: 40 }]);
    expect(res.dropped).toBe(1);
  });

  it('keeps one entry per day (the last) and sorts by date', () => {
    const res = cleanEntries([
      { date: '2026-10-12', value: 2 },
      { date: '2026-10-10', value: 1 },
      { date: '2026-10-12', value: 3 },
    ]);
    expect(res.entries).toEqual([{ date: '2026-10-10', value: 1 }, { date: '2026-10-12', value: 3 }]);
    expect(res.dropped).toBe(1);
  });

  it('a non-array is an empty log', () => {
    expect(cleanEntries({} as unknown)).toEqual({ entries: [], dropped: 0 });
  });

  it('is on the runtime facade every tracker widget uses', () => {
    expect(tracker.cleanEntries).toBe(cleanEntries);
    expect(tracker.cleanGoal).toBe(cleanGoal);
  });
});

describe('cleanGoal', () => {
  it('falls back on a bad goal', () => {
    expect(cleanGoal(8, 7)).toBe(8);
    expect(cleanGoal(-1, 7)).toBe(7);
    expect(cleanGoal(NaN, 7)).toBe(7);
    expect(cleanGoal('8', 7)).toBe(7);
    expect(cleanGoal(99, 7, 16)).toBe(7);
  });
});
