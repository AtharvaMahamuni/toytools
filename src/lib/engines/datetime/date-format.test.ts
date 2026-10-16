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

// ── PR #254 fix round ──────────────────────────────────────────────────────
const texts = (res: ReturnType<typeof run>) => (res.insights ?? []).map((i) => i.text).join(' / ');

describe('unreadable rows (M1)', () => {
  it('an all-unreadable paste says N of M could not be read and names the lines', () => {
    const res = run('31/04/2025\ngarbage');
    expect(res.ok).toBe(true);
    expect(res.hero?.label).toBe('could not be read');
    expect(res.hero?.value).toBe('2 of 2');
    expect(res.hero?.note).toBe('Lines 1 and 2 could not be read.');
    expect(texts(res)).toContain('Line 1, 31/04/2025: could not be read. That date does not exist.');
    expect(texts(res)).toContain('Line 2, garbage: could not be read. It does not look like a date');
    expect(res.insights?.every((i) => i.tone === 'caution')).toBe(true);
  });

  it('a readable column with one bad row leads with the bad row, not "two ways: 0"', () => {
    const res = run('2025-04-03\nfoo');
    expect(res.hero?.label).toBe('could not be read');
    expect(res.hero?.value).toBe('1 of 2');
    expect(res.hero?.note).toBe('Line 2 could not be read.');
  });

  it('two readings still lead, and the note adds the unreadable lines', () => {
    const res = run('03/04/2026\nnope');
    expect(res.hero?.value).toBe('1 of 2');
    expect(res.hero?.note).toBe('1 row can be read as two different days. Line 2 could not be read.');
  });

  it('lists at most 8 line numbers', () => {
    const res = run(Array.from({ length: 10 }, () => 'x').join('\n'));
    expect(res.hero?.note).toBe('Lines 1, 2, 3, 4, 5, 6, 7, 8 and 2 more could not be read.');
  });
});

describe('year first without zero padding (S1)', () => {
  for (const t of ['2025/4/3', '2025-4-3', '2025.4.3', '2025/04/3']) {
    it(t, () => {
      const res = run(t);
      expect(res.hero?.value).toBe('Each date has one reading');
      expect(res.explanation).toContain('3 April 2025 (year first)');
    });
  }
  it('a three-digit last part after a four-digit year is refused with a reason', () => {
    expect(texts(run('2025/04/123'))).toContain('After a four-digit year, the day must be one or two digits.');
  });
});

describe('the 200-line cap is in the visible note (S2)', () => {
  it('says where it stopped', () => {
    const res = run(Array.from({ length: 205 }, () => '2025-04-03').join('\n'));
    expect(res.hero?.note).toBe('Stopped at line 200. Line 201 onward was not read.');
    expect(res.metrics.find((c) => c.id === 'one-reading')?.raw).toBe(200);
  });
});

describe('edge cases (S3)', () => {
  it('pivots 69 to 2069 and 70 to 1970', () => {
    expect(run('13/01/69').explanation).toContain('13 January 2069');
    expect(run('13/01/70').explanation).toContain('13 January 1970');
    expect(run('13/01/00').explanation).toContain('13 January 2000');
  });
  it('refuses day 0 and month 0', () => {
    expect(texts(run('00/04/2025'))).toContain('That date does not exist');
    expect(texts(run('04/00/2025'))).toContain('That date does not exist');
    expect(run('04/00/2025').metrics.find((c) => c.id === 'unreadable')?.raw).toBe(1);
  });
  it('refuses hour 24', () => {
    expect(texts(run('2025-04-03T24:00'))).toContain('The time is out of range');
    expect(run('2025-04-03T23:59').hero?.value).toBe('Each date has one reading');
    expect(texts(run('03/04/2025 24:00'))).toContain('The time is out of range');
  });
  it('keeps the real line numbers after a blank line', () => {
    const res = run('\n03/04/2025\n\n13/04/2026');
    expect(texts(res)).toContain('Line 2, 03/04/2025');
    expect(res.explanation).toContain('Line 4, 13/04/2026');
  });
  it('reads Sept and a space separator', () => {
    expect(run('Sept 3, 2025').explanation).toContain('3 September 2025');
    expect(run('3 Sept 2025').explanation).toContain('3 September 2025');
    const spaced = run('03 04 2025');
    expect(spaced.hero?.value).toBe('1 of 1');
    expect(spaced.explanation).toContain('4 March 2025 (month first)');
  });
  it('reads a four-digit year with a two-digit day', () => {
    expect(run('2025/04/13').explanation).toContain('13 April 2025 (year first)');
  });
  it('refuses year 0', () => {
    for (const t of ['0000-04-03', '13/04/0000', '0000/4/3', '3 April 0000', 'April 3, 0000']) {
      expect(texts(run(t)), t).toContain('Year 0 is not a valid year.');
    }
  });
  it('explains a padded first part when the year is at the end', () => {
    expect(texts(run('0003/04/2025'))).toContain('The year is at the end, so the first part is a day or month');
    expect(texts(run('2025/04/2025'))).toContain('The year is at the end');
    expect(texts(run('2025/04/123'))).toContain('After a four-digit year, the day must be one or two digits.');
  });
});

describe('nits (N)', () => {
  it('refuses mixed separators', () => {
    expect(texts(run('03/04-2025'))).toContain('Mixed separators (/ and -) are not read.');
    expect(texts(run('03 04/2025'))).toContain('Mixed separators (a space and /)');
  });
  it('refuses a zone with no time', () => {
    for (const t of ['03/04/2025Z', '03/04/2025+05', '2025-04-03Z']) {
      expect(texts(run(t)), t).toContain('A time zone with no time is not read.');
    }
    expect(run('03/04/2025 10:00Z').metrics.find((c) => c.id === 'missing-zone')?.raw).toBe(0);
  });
  it('gives a reason for ordinals and YYYYMMDD', () => {
    expect(texts(run('3rd April 2025'))).toContain('Ordinals such as 3rd are not read.');
    expect(texts(run('20250403'))).toContain('Compact dates such as 20250403 are not read.');
  });
  it('names an unknown month word', () => {
    expect(texts(run('3 Foo 2025'))).toContain('"Foo" is not a month name this tool knows.');
  });
});

describe('warning order (r2)', () => {
  it('lists two-reading and unreadable rows by line number, whatever their kind', () => {
    const res = run('garbage\n03/04/2026\n13/04/2026\n31/02/2026\n05/06/2026');
    const lines = (res.insights ?? []).map((i) => Number(/^Line (\d+)/.exec(i.text)?.[1]));
    expect(lines).toEqual([1, 2, 4, 5]);
  });
  it('keeps the first 8 by line number', () => {
    const res = run(Array.from({ length: 10 }, (_, i) => (i % 2 ? '03/04/2026' : 'x')).join('\n'));
    const lines = (res.insights ?? []).map((i) => Number(/^Line (\d+)/.exec(i.text)?.[1]));
    expect(lines).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
