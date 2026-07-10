import { describe, it, expect } from 'vitest';
import { parseCron, cronMatches, nextRuns, runsPerDay, describeCron, type CronFields } from './cron';

function fields(expr: string): CronFields {
  const p = parseCron(expr);
  if (!p.ok) throw new Error(`expected "${expr}" to parse: ${p.error}`);
  return p.fields;
}

describe('parseCron field expansion', () => {
  it('expands a star to the full range', () => {
    expect(fields('* * * * *').minute).toHaveLength(60);
    expect(fields('* * * * *').hour).toHaveLength(24);
  });

  it('expands a step from the minimum', () => {
    expect(fields('*/15 * * * *').minute).toEqual([0, 15, 30, 45]);
  });

  it('expands a range', () => {
    expect(fields('0 9 * * 1-5').dow).toEqual([1, 2, 3, 4, 5]);
  });

  it('expands a stepped range', () => {
    expect(fields('0-30/10 * * * *').minute).toEqual([0, 10, 20, 30]);
  });

  it('accepts month and weekday names case-insensitively', () => {
    expect(fields('0 0 1 JAN mon').month).toEqual([1]);
    expect(fields('0 0 1 jan MON').dow).toEqual([1]);
  });

  it('folds Sunday-as-7 into 0', () => {
    expect(fields('0 0 * * 7').dow).toEqual([0]);
  });

  it('rejects the wrong number of fields', () => {
    expect(parseCron('* * * *').ok).toBe(false);
    expect(parseCron('* * * * * *').ok).toBe(false);
  });

  it('rejects out-of-range and malformed values', () => {
    expect(parseCron('60 * * * *').ok).toBe(false);
    expect(parseCron('* 24 * * *').ok).toBe(false);
    expect(parseCron('*/0 * * * *').ok).toBe(false);
    expect(parseCron('5-1 * * * *').ok).toBe(false);
  });
});

describe('runsPerDay', () => {
  it('multiplies minute and hour slots when days are unrestricted', () => {
    expect(runsPerDay(fields('*/15 * * * *'))).toBe(96);
    expect(runsPerDay(fields('0 * * * *'))).toBe(24);
    expect(runsPerDay(fields('0 0 * * *'))).toBe(1);
  });

  it('is null when a day field is restricted', () => {
    expect(runsPerDay(fields('0 0 * * 1'))).toBeNull();
    expect(runsPerDay(fields('0 0 1 * *'))).toBeNull();
  });
});

describe('cronMatches DOM/DOW rule', () => {
  it('uses OR when both day fields are restricted', () => {
    const f = fields('0 0 1 * 1'); // 1st of month OR any Monday
    // 2023-11-01 is a Wednesday: matches on day-of-month.
    expect(cronMatches(f, new Date('2023-11-01T00:00:00Z'))).toBe(true);
    // 2023-11-06 is a Monday: matches on day-of-week.
    expect(cronMatches(f, new Date('2023-11-06T00:00:00Z'))).toBe(true);
    // 2023-11-07 is a Tuesday and not the 1st: no match.
    expect(cronMatches(f, new Date('2023-11-07T00:00:00Z'))).toBe(false);
  });

  it('uses AND across field types (minute and hour still required)', () => {
    const f = fields('30 9 * * *');
    expect(cronMatches(f, new Date('2023-11-07T09:30:00Z'))).toBe(true);
    expect(cronMatches(f, new Date('2023-11-07T09:31:00Z'))).toBe(false);
    expect(cronMatches(f, new Date('2023-11-07T10:30:00Z'))).toBe(false);
  });
});

describe('nextRuns', () => {
  it('lists upcoming matches after the reference instant', () => {
    const runs = nextRuns(fields('*/15 * * * *'), new Date('2023-11-07T09:02:00Z'), 3);
    expect(runs.map((d) => d.toISOString())).toEqual([
      '2023-11-07T09:15:00.000Z',
      '2023-11-07T09:30:00.000Z',
      '2023-11-07T09:45:00.000Z',
    ]);
  });

  it('crosses into the next matching day', () => {
    const runs = nextRuns(fields('0 0 * * *'), new Date('2023-11-07T12:00:00Z'), 1);
    expect(runs[0].toISOString()).toBe('2023-11-08T00:00:00.000Z');
  });
});

describe('describeCron', () => {
  it('describes common shapes in plain English', () => {
    expect(describeCron(fields('* * * * *'))).toBe('Every minute');
    expect(describeCron(fields('*/15 * * * *'))).toBe('Every 15 minutes');
    expect(describeCron(fields('30 9 * * *'))).toBe('At 09:30');
    expect(describeCron(fields('0 9 * * 1-5'))).toContain('Monday');
  });
});
