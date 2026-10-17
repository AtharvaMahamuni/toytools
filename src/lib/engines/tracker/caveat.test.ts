import { describe, expect, it } from 'vitest';
import { trackerCaveat } from './caveat';
import { getTrackerDef } from './registry';

describe('trackerCaveat', () => {
  it('says nothing for trackers other than sleep, and for a night of 9 hours or less', () => {
    expect(trackerCaveat('body-weight', 80)).toBeNull();
    expect(trackerCaveat('sleep-hours', 0)).toBeNull();
    expect(trackerCaveat('sleep-hours', 7.5)).toBeNull();
    expect(trackerCaveat('sleep-hours', 9)).toBeNull();
  });

  it('names time in bed once the logged night is longer than 9 hours', () => {
    expect(trackerCaveat('sleep-hours', 9.5)).toContain('9.5 h');
    expect(trackerCaveat('sleep-hours', 11)).toContain('time awake in bed');
  });
});

describe('sleep-hours def', () => {
  it('logs one number of hours on a seven-day line, and refuses a clock time', () => {
    const def = getTrackerDef('sleep-hours');
    expect(def?.inputMode).toBe('value');
    expect(def?.chart).toBe('line');
    expect(def?.unit).toBe('h');
    expect(def?.windowDays).toBe(7);
    expect(def?.max).toBe(16);
    expect(def?.placeholder).toBe('e.g. 7.5');
    expect(def?.streakMode).toBe('logged');
  });
});
