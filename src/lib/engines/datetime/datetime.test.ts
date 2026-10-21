import { describe, it, expect } from 'vitest';
import { runDateTime, DATETIME_TOOLS, dateTimeFields } from './registry';
import { DATETIME_EXAMPLES } from './examples';
import { addDays, parseISODate } from './models';

const NO_OPTS = {};

describe('runDateTime resolver', () => {
  it('returns a calculation-error for an unknown id', () => {
    const r = runDateTime('nope', {}, NO_OPTS);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('calculation-error');
    expect(r.error).toBe('Unknown tool');
  });
});

describe('worked-example registry drives the tests (no duplicate fixtures)', () => {
  it.each(DATETIME_EXAMPLES.filter((e) => e.expect).map((e) => [e.id, e] as const))(
    '%s matches its expected card values',
    (_id, ex) => {
      const r = runDateTime(ex.ref, ex.inputs, NO_OPTS);
      expect(r.ok).toBe(true);
      const byId = new Map([r.hero, ...r.metrics].filter(Boolean).map((c) => [c!.id, c!.raw]));
      for (const [key, value] of Object.entries(ex.expect!)) {
        expect(byId.get(key), key).toBeCloseTo(value, 1);
      }
    },
  );
});

describe('age calculator', () => {
  it('registers with a calculate() and fields', () => {
    expect(typeof DATETIME_TOOLS['age'].calculate).toBe('function');
    expect(dateTimeFields('age').length).toBeGreaterThan(0);
  });

  it('produces a hero, metrics, insights, and milestones on a valid date', () => {
    const r = runDateTime('age', { birthDate: '1990-05-15', asOf: '2026-07-08' }, NO_OPTS);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(36);
    expect(r.metrics.length).toBeGreaterThan(0);
    expect(r.insights?.length).toBeGreaterThan(0);
    expect(r.milestones?.length).toBeGreaterThan(0);
    expect(r.explanation).toContain('13,203 days');
  });

  it('reports the correct weekday of birth', () => {
    const r = runDateTime('age', { birthDate: '1990-05-15', asOf: '2026-07-08' }, NO_OPTS);
    expect(r.insights?.some((i) => i.text.includes('Tuesday'))).toBe(true);
  });

  it('requires a date of birth', () => {
    const r = runDateTime('age', { birthDate: '', asOf: '' }, NO_OPTS);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('validation-error');
  });

  it('rejects an unparseable date', () => {
    const r = runDateTime('age', { birthDate: 'not-a-date', asOf: '' }, NO_OPTS);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('validation-error');
  });

  it('rejects a birth date after the reference date', () => {
    const r = runDateTime('age', { birthDate: '2030-01-01', asOf: '2026-07-08' }, NO_OPTS);
    expect(r.ok).toBe(false);
    expect(r.uiState).toBe('validation-error');
  });

  it('flags the birthday when the reference date is the birthday', () => {
    const r = runDateTime('age', { birthDate: '2000-07-08', asOf: '2026-07-08' }, NO_OPTS);
    expect(r.ok).toBe(true);
    expect(r.metrics.find((m) => m.id === 'next-birthday')?.raw).toBe(0);
    expect(r.insights?.some((i) => i.tone === 'positive')).toBe(true);
  });
});

describe('age and date difference share one y/m/d breakdown (Phase B PR 2)', () => {
  const MONTH_END: Array<[string, string]> = [
    ['2000-01-31', '2000-03-01'],
    ['1990-03-31', '1990-05-01'],
    ['2026-01-31', '2026-03-01'],
    ['2026-03-31', '2026-05-01'],
  ];

  it.each(MONTH_END)('age %s to %s reads 1 month, 1 day', (birthDate, asOf) => {
    const r = runDateTime('age', { birthDate, asOf }, NO_OPTS);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(0);
    expect(r.hero?.note).toBe('1 month, 1 day');
    expect(r.meta).toMatchObject({ years: 0, months: 1, days: 1 });
  });

  it.each(MONTH_END)('date difference %s to %s reads 1 month, 1 day', (startDate, endDate) => {
    const r = runDateTime('date-difference', { startDate, endDate }, NO_OPTS);
    expect(r.ok).toBe(true);
    expect(r.hero?.value).toBe('1 month, 1 day');
    expect(r.meta).toMatchObject({ years: 0, months: 1, days: 1 });
  });

  it('leaves the totals as they were (days, weeks)', () => {
    const totals = (s: string, e: string) => {
      const r = runDateTime('date-difference', { startDate: s, endDate: e }, NO_OPTS);
      const by = new Map(r.metrics.map((m) => [m.id, m.raw]));
      return [by.get('total-days'), by.get('total-weeks'), by.get('business-days')];
    };
    expect(totals('2000-01-31', '2000-03-01')).toEqual([30, 4, 22]);
    expect(totals('2026-03-31', '2026-05-01')).toEqual([31, 4, 23]);
    expect(totals('2000-02-29', '2026-10-06')).toEqual([9716, 1388, 6940]);
  });

  it('age of a 29 Feb birthday on 28 Feb 2027 is 27 years 0 months 0 days, with the birthday banner', () => {
    const r = runDateTime('age', { birthDate: '2000-02-29', asOf: '2027-02-28' }, NO_OPTS);
    expect(r.ok).toBe(true);
    expect(r.hero?.raw).toBe(27);
    expect(r.hero?.note).toBe('0 months, 0 days');
    expect(r.meta).toMatchObject({ years: 27, months: 0, days: 0, daysToBirthday: 0 });
    expect(r.metrics.find((m) => m.id === 'next-birthday')?.value).toBe('Today');
    expect(r.insights?.some((i) => i.text === 'Happy birthday!')).toBe(true);
  });

  it('the day before, a 29 Feb birthday is still 26, and not a birthday', () => {
    const r = runDateTime('age', { birthDate: '2000-02-29', asOf: '2027-02-27' }, NO_OPTS);
    expect(r.hero?.raw).toBe(26);
    expect(r.meta).toMatchObject({ years: 26, months: 11, days: 29, daysToBirthday: 1 });
    expect(r.insights?.some((i) => i.text === 'Happy birthday!')).toBe(false);
  });
});

describe('pregnancy due date', () => {
  const base = { lmp: '2026-01-01', cycle: 28, asOf: '2026-03-01' };

  it('pins 1 January 2026 plus 280 days at 8 October, and a leap-year January at 7 October', () => {
    expect(addDays(parseISODate('2026-01-01')!, 280)).toEqual({ y: 2026, m: 10, d: 8 });
    expect(addDays(parseISODate('2024-01-01')!, 280)).toEqual({ y: 2024, m: 10, d: 7 });
    const leap = runDateTime('pregnancy', { lmp: '2024-01-01', cycle: 28, asOf: '2024-01-01' }, NO_OPTS);
    expect(leap.hero?.value).toBe('7 October 2024');
    expect(leap.hero?.note).toBeUndefined();
  });

  it('keeps weeks on the last period when a 32 day cycle moves the due date', () => {
    const shifted = runDateTime('pregnancy', { ...base, cycle: 32 }, NO_OPTS);
    expect(shifted.hero?.value).toBe('12 October 2026');
    expect(shifted.hero?.note).toBe('A 32 day cycle moves this due date 4 days later than a 28 day cycle. The page used 32.');
    expect(shifted.metrics.find((m) => m.id === 'gestational-age')?.value).toBe('8 weeks, 3 days');
    expect(shifted.metrics.find((m) => m.id === 'trimester')?.note).toContain('9 April 2026');
    expect(shifted.metrics.find((m) => m.id === 'trimester')?.note).toContain('16 July 2026');
  });

  it('names an earlier due date for a 21 day cycle and stays quiet at 28', () => {
    const standard = runDateTime('pregnancy', base, NO_OPTS);
    expect(standard.hero?.note).toBeUndefined();
    const early = runDateTime('pregnancy', { ...base, cycle: 21 }, NO_OPTS);
    expect(early.hero?.value).toBe('1 October 2026');
    expect(early.hero?.note).toContain('7 days earlier');
  });

  it('counts days past a due date that has already arrived', () => {
    const r = runDateTime('pregnancy', { lmp: '2026-01-01', cycle: 28, asOf: '2026-10-10' }, NO_OPTS);
    expect(r.metrics.find((m) => m.id === 'countdown')).toMatchObject({ value: '2 days', raw: -2 });
    expect(r.metrics.find((m) => m.id === 'trimester')?.raw).toBe(3);
    expect(r.metrics.find((m) => m.id === 'gestational-age')?.value).toBe('40 weeks, 2 days');
  });

  it('rejects a last period after the count date, a fractional cycle, and a missing date', () => {
    expect(runDateTime('pregnancy', { lmp: '2026-03-02', cycle: 28, asOf: '2026-03-01' }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('pregnancy', { ...base, cycle: 28.5 }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('pregnancy', { ...base, cycle: 20 }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('pregnancy', { ...base, cycle: 46 }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('pregnancy', { lmp: '', cycle: 28, asOf: '2026-03-01' }, NO_OPTS).uiState).toBe('validation-error');
    expect(runDateTime('pregnancy', { lmp: '2026-02-31', cycle: 28, asOf: '2026-03-01' }, NO_OPTS).ok).toBe(false);
  });
});

describe('ovulation date', () => {
  const base = { lmp: '2026-01-01', cycle: 28, luteal: 14, asOf: '2026-01-10' };

  it('puts a 28 day cycle and a 14 day luteal phase on 15 January, inside the window on the 10th', () => {
    const r = runDateTime('ovulation', base, NO_OPTS);
    expect(r.hero?.value).toBe('15 January 2026');
    expect(r.hero?.note).toBeUndefined();
    expect(r.metrics.find((m) => m.id === 'fertile-window')?.value).toBe('10 January 2026 to 15 January 2026');
    expect(r.metrics.find((m) => m.id === 'next-period')?.value).toBe('29 January 2026');
    expect(r.metrics.find((m) => m.id === 'window-status')).toMatchObject({
      value: 'Inside the fertile window',
      raw: 0,
    });
  });

  it('moves ovulation later for a 12 day luteal phase and leaves the next period in place', () => {
    const r = runDateTime('ovulation', { ...base, luteal: 12 }, NO_OPTS);
    expect(r.hero?.value).toBe('17 January 2026');
    expect(r.hero?.note).toBe('A 12 day luteal phase moves ovulation 2 days later than a 14 day luteal phase. The page used 12.');
    expect(r.metrics.find((m) => m.id === 'fertile-window')?.value).toBe('12 January 2026 to 17 January 2026');
    expect(r.metrics.find((m) => m.id === 'next-period')?.value).toBe('29 January 2026');
    expect(r.metrics.find((m) => m.id === 'window-status')).toMatchObject({ value: '2 days', raw: -2 });
  });

  it('names an earlier ovulation for a 16 day luteal phase and stays quiet at 14', () => {
    const standard = runDateTime('ovulation', base, NO_OPTS);
    expect(standard.hero?.note).toBeUndefined();
    const early = runDateTime('ovulation', { ...base, luteal: 16 }, NO_OPTS);
    expect(early.hero?.value).toBe('13 January 2026');
    expect(early.hero?.note).toContain('2 days earlier');
    expect(early.metrics.find((m) => m.id === 'fertile-window')?.value).toBe('8 January 2026 to 13 January 2026');
  });

  it('counts days after the window and matches a 32 day cycle to 19 January', () => {
    const after = runDateTime('ovulation', { ...base, asOf: '2026-01-16' }, NO_OPTS);
    expect(after.metrics.find((m) => m.id === 'window-status')).toMatchObject({ value: '1 day', raw: 1 });
    const longer = runDateTime('ovulation', { ...base, cycle: 32 }, NO_OPTS);
    expect(longer.hero?.value).toBe('19 January 2026');
    expect(longer.hero?.note).toBeUndefined();
    expect(longer.metrics.find((m) => m.id === 'next-period')?.value).toBe('2 February 2026');
  });

  it('rejects a last period after the count date, a luteal phase outside 10 to 16, and a missing date', () => {
    expect(runDateTime('ovulation', { ...base, lmp: '2026-01-11' }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('ovulation', { ...base, luteal: 9 }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('ovulation', { ...base, luteal: 17 }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('ovulation', { ...base, luteal: 14.5 }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('ovulation', { ...base, cycle: 20 }, NO_OPTS).ok).toBe(false);
    expect(runDateTime('ovulation', { lmp: '', cycle: 28, luteal: 14, asOf: '2026-01-10' }, NO_OPTS).uiState).toBe('validation-error');
  });
});
