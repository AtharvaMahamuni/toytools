// Contract tests for the tracker registry + runtime facade: every def is well-formed, and the facade
// wires the pure model correctly (goal vs logged streak qualifiers, chart dispatch).

import { describe, expect, it } from 'vitest';
import { TRACKER_DEFS, getTrackerDef, tracker } from './registry';

describe('tracker defs', () => {
  it('every def is internally consistent', () => {
    for (const [id, def] of Object.entries(TRACKER_DEFS)) {
      expect(def.id).toBe(id);
      expect(['increment', 'value']).toContain(def.inputMode);
      expect(['bars', 'line']).toContain(def.chart);
      expect(['goal', 'logged']).toContain(def.streakMode);
      expect(def.windowDays).toBeGreaterThan(0);
      // A 'goal' streak needs a goal to measure against.
      if (def.streakMode === 'goal') expect(def.defaultGoal).toBeGreaterThan(0);
    }
  });

  it('resolves known ids and returns undefined for unknown ones', () => {
    expect(getTrackerDef('water-intake')?.chart).toBe('bars');
    expect(getTrackerDef('body-weight')?.chart).toBe('line');
    expect(getTrackerDef('move-today')?.addLabel).toBe('I moved today');
    expect(getTrackerDef('nope')).toBeUndefined();
  });

  it('treats the move-today habit as a goal-1 increment streak', () => {
    const def = getTrackerDef('move-today')!;
    expect(def.inputMode).toBe('increment');
    expect(def.streakMode).toBe('goal');
    expect(def.defaultGoal).toBe(1);
    // One logged session meets the daily goal.
    const entries = [{ date: '2026-07-23', value: 1 }];
    expect(tracker.currentStreak(entries, '2026-07-23', def.defaultGoal!, def.streakMode)).toBe(1);
  });
});

describe('tracker facade', () => {
  const entries = [
    { date: '2026-07-21', value: 8 },
    { date: '2026-07-22', value: 8 },
    { date: '2026-07-23', value: 5 },
  ];

  it('goal mode counts only days that reach the goal', () => {
    // Today (5) misses goal 8; grace falls to the 22nd, so the streak is 2 (21, 22).
    expect(tracker.currentStreak(entries, '2026-07-23', 8, 'goal')).toBe(2);
  });

  it('logged mode counts any day with an entry', () => {
    expect(tracker.currentStreak(entries, '2026-07-23', 0, 'logged')).toBe(3);
  });

  it('exposes chart builders that return SVG strings', () => {
    expect(tracker.barsSvg([{ label: 'M', value: 3 }])).toContain('<svg');
    expect(tracker.lineSvg([{ label: '1', value: 70 }])).toContain('<svg');
    expect(tracker.progressRingSvg(4, 8)).toContain('>50%<');
  });
});
