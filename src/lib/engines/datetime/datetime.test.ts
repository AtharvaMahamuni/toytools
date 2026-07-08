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
