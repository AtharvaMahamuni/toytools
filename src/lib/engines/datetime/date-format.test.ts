import { describe, expect, it } from 'vitest';
import { runDateTime } from './registry';

function run(dates: string) {
  return runDateTime('date-format', { dates }, {});
}

describe('date format detector', () => {
  it('shows both readings for 03/04/2026 and names them on the hero note', () => {
    const res = run('03/04/2026');
    expect(res.ok).toBe(true);
    expect(res.hero?.note).toBe('1 row can be read as two different days.');
    expect(res.hero?.raw).toBe(1);
    expect(res.insights?.map((item) => item.text).join(' ')).toContain('3 April 2026 (day first)');
    expect(res.insights?.map((item) => item.text).join(' ')).toContain('4 March 2026 (month first)');
  });

  it('reads 13/04/2026 and 04/13/2026 as 13 April, one way each', () => {
    const dayFirst = run('13/04/2026');
    expect(dayFirst.hero?.note).toBeUndefined();
    expect(dayFirst.explanation).toContain('13 April 2026 (day first)');
    expect(dayFirst.explanation).not.toContain(' or ');

    const monthFirst = run('04/13/2026');
    expect(monthFirst.hero?.note).toBeUndefined();
    expect(monthFirst.explanation).toContain('13 April 2026 (month first)');
    expect(monthFirst.explanation).not.toContain(' or ');
  });

  it('counts only the two-reading rows in a mixed column', () => {
    const res = run('03/04/2026\n2026-04-13\n13/04/2026');
    expect(res.metrics.find((card) => card.id === 'ambiguous')?.raw).toBe(1);
    expect(res.metrics.find((card) => card.id === 'one-reading')?.raw).toBe(2);
    expect(res.hero?.value).toBe('1 of 3');
    expect(res.hero?.note).toContain('1 row');
  });

  it('leaves the note unset when every ISO date has one reading', () => {
    const res = run('2026-04-03\n2026-04-13');
    expect(res.hero?.value).toBe('Each date has one reading');
    expect(res.hero?.note).toBeUndefined();
    expect(res.insights).toEqual([]);
  });

  it('flags a timestamp with no zone and stays quiet when the zone is Z', () => {
    const open = run('2026-04-03T18:00:00');
    expect(open.metrics.find((card) => card.id === 'missing-zone')?.raw).toBe(1);
    expect(open.explanation).toContain('No time zone');
    expect(open.hero?.note).toBeUndefined();

    const zoned = run('2026-04-03T18:00:00Z');
    expect(zoned.metrics.find((card) => card.id === 'missing-zone')?.raw).toBe(0);
    expect(zoned.explanation).not.toContain('No time zone');
  });

  it('pivots a two-digit year and states the pivot', () => {
    const res = run('03/04/26');
    expect(res.hero?.note).toBe('1 row can be read as two different days.');
    expect(res.explanation).toContain('3 April 2026');
    expect(res.explanation).toContain('4 March 2026');
    expect(res.explanation).toContain('Two-digit year');
    const pivot = res.assumptions?.find((item) => item.label === 'Two-digit years')?.value ?? '';
    expect(pivot).toContain('2000');
    expect(pivot).toContain('1970');
  });

  it('skips blank lines, quotes an unreadable line, and stops before line 201', () => {
    const blanks = run('\n\n2026-04-03\n\n');
    expect(blanks.metrics.find((card) => card.id === 'one-reading')?.raw).toBe(1);
    expect(blanks.metrics.find((card) => card.id === 'unreadable')?.raw).toBe(0);

    const junk = run('not a date');
    expect(junk.metrics.find((card) => card.id === 'unreadable')?.raw).toBe(1);
    expect(junk.explanation).toContain('not a date: could not be read');

    const lines = Array.from({ length: 201 }, (_, index) => (index < 200 ? '2026-04-03' : '03/04/2026'));
    const cut = run(lines.join('\n'));
    expect(cut.metrics.find((card) => card.id === 'ambiguous')?.raw).toBe(0);
    expect(cut.explanation).toContain('Line 201');
  });

  it('does not call one calendar day two different days', () => {
    const res = run('05/05/2026');
    expect(res.hero?.value).toBe('Each date has one reading');
    expect(res.hero?.note).toBeUndefined();
    expect(res.metrics.find((card) => card.id === 'ambiguous')?.raw).toBe(0);
    expect(res.metrics.find((card) => card.id === 'one-reading')?.raw).toBe(1);
    expect(res.explanation).toContain('5 May 2026 (day first and month first)');
    expect(res.insights).toEqual([]);

    const mixed = run('05/05/2026\n03/04/2026');
    expect(mixed.hero?.value).toBe('1 of 2');
    expect(mixed.hero?.note).toBe('1 row can be read as two different days.');
  });

  it('does not attach a year or zone flag to an impossible day', () => {
    const year = run('31/04/26');
    expect(year.metrics.find((card) => card.id === 'unreadable')?.raw).toBe(1);
    expect(year.metrics.find((card) => card.id === 'two-digit-year')?.raw).toBe(0);
    expect(year.explanation).toContain('could not be read');
    expect(year.explanation).not.toContain('Two-digit year');

    const zone = run('31/04/2026 18:00:00');
    expect(zone.metrics.find((card) => card.id === 'unreadable')?.raw).toBe(1);
    expect(zone.metrics.find((card) => card.id === 'missing-zone')?.raw).toBe(0);
    expect(zone.explanation).not.toContain('No time zone');
  });

  it('ignores a trailing newline when deciding the 200 line cap', () => {
    const padded = `${Array.from({ length: 200 }, () => '2026-04-03').join('\n')}\n`;
    const res = run(padded);
    expect(res.metrics.find((card) => card.id === 'one-reading')?.raw).toBe(200);
    expect(res.explanation).not.toContain('Line 201');
  });

  it('reads a named month one way', () => {
    const res = run('4 March 2026\nMarch 4, 2026');
    expect(res.hero?.value).toBe('Each date has one reading');
    expect(res.explanation).toContain('4 March 2026 (named month)');
    expect(res.explanation).toContain('4 March 2026 (named month)');
  });
});
