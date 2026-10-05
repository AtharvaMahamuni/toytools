import { describe, expect, it } from 'vitest';
import { freshUntil, isFresh, NEW_TAG_DAYS, newUntilIso } from './freshness';

const added = '2026-10-02';

describe('New badge window', () => {
  it('counts five whole UTC days, including the day the tool was added', () => {
    expect(NEW_TAG_DAYS).toBe(5);
    expect(isFresh(added, new Date('2026-10-02T00:00:00Z'))).toBe(true);
    expect(isFresh(added, new Date('2026-10-06T23:59:59.999Z'))).toBe(true);
    expect(isFresh(added, new Date('2026-10-07T00:00:00Z'))).toBe(false);
    expect(isFresh(added, new Date('2026-10-07T23:59:59Z'))).toBe(false);
  });

  it('starts exactly at UTC midnight of the added day', () => {
    expect(isFresh(added, new Date('2026-10-01T23:59:59.999Z'))).toBe(false);
    expect(isFresh(added, new Date('2026-10-02T00:00:00.000Z'))).toBe(true);
  });

  it('stays off before the added day and when the date is missing or impossible', () => {
    expect(isFresh(added, new Date('2026-10-01T23:00:00Z'))).toBe(false);
    expect(isFresh(undefined, new Date('2026-10-02T00:00:00Z'))).toBe(false);
    expect(isFresh('2026-02-31', new Date('2026-03-01T00:00:00Z'))).toBe(false);
  });

  it('names the instant the badge should leave the page', () => {
    expect(newUntilIso(added)).toBe('2026-10-07T00:00:00.000Z');
    expect(freshUntil(added, new Date('2026-10-06T12:00:00Z'))).toBe('2026-10-07T00:00:00.000Z');
    expect(freshUntil(added, new Date('2026-10-07T00:00:00Z'))).toBeUndefined();
  });

  it('agrees with isFresh one millisecond either side of newUntilIso', () => {
    for (const day of ['2026-10-02', '2026-12-29', '2028-02-28']) {
      const until = Date.parse(newUntilIso(day)!);
      expect(isFresh(day, new Date(until - 1))).toBe(true);
      expect(isFresh(day, new Date(until))).toBe(false);
      expect(Math.round((until - Date.parse(`${day}T00:00:00Z`)) / 86_400_000)).toBe(NEW_TAG_DAYS);
    }
  });
});
