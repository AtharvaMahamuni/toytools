import { describe, it, expect } from 'vitest';
import { runDateTime, DATETIME_TOOLS, dateTimeFields } from './registry';
import { DATETIME_EXAMPLES } from './examples';

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
