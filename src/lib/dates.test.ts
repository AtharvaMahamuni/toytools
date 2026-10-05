import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { formatMonthYear, indiaDay, isIsoDate } from './dates';

// These two functions carry the guide date contract: isIsoDate is what validate-registry fails the
// build on, and formatMonthYear is what a visitor reads. They shipped without tests, which is how a
// date bug got into 102 guides in the first place.

describe('isIsoDate', () => {
  it('accepts a well-formed date', () => {
    expect(isIsoDate('2026-08-17')).toBe(true);
    expect(isIsoDate('2026-01-01')).toBe(true);
    expect(isIsoDate('2024-02-29')).toBe(true); // a real leap day
  });

  it('rejects the display string this contract replaced', () => {
    expect(isIsoDate('Jul 2026')).toBe(false);
    expect(isIsoDate('July 2026')).toBe(false);
  });

  it('rejects loose shapes that a regex alone would let through', () => {
    expect(isIsoDate('2026-8-17')).toBe(false);   // unpadded month
    expect(isIsoDate('2026/08/17')).toBe(false);  // wrong separator
    expect(isIsoDate('17-08-2026')).toBe(false);  // reversed
    expect(isIsoDate('2026-08-17T00:00:00Z')).toBe(false); // a datetime, not a date
    expect(isIsoDate('')).toBe(false);
  });

  it('rejects month and day numbers outside the calendar', () => {
    expect(isIsoDate('2026-13-01')).toBe(false);
    expect(isIsoDate('2026-00-10')).toBe(false);
    expect(isIsoDate('2026-08-32')).toBe(false);
    expect(isIsoDate('2026-08-00')).toBe(false);
  });

  it('rejects dates that pass a regex but do not exist', () => {
    // The reason the check parses rather than only matching: 31 February is well-formed and wrong.
    expect(isIsoDate('2026-02-31')).toBe(false);
    expect(isIsoDate('2026-04-31')).toBe(false);
    expect(isIsoDate('2025-02-29')).toBe(false); // 2025 is not a leap year
  });
});

describe('formatMonthYear', () => {
  it('renders the form the site has always shown', () => {
    expect(formatMonthYear('2026-06-02')).toBe('Jun 2026');
    expect(formatMonthYear('2026-01-31')).toBe('Jan 2026');
    expect(formatMonthYear('2026-12-01')).toBe('Dec 2026');
  });

  it('is stable at both ends of the year regardless of the build timezone', () => {
    // Parsed by hand rather than through Date, so a UTC-midnight value rendered in a negative
    // offset cannot slip to the previous day and drag January into the year before.
    expect(formatMonthYear('2026-01-01')).toBe('Jan 2026');
    expect(formatMonthYear('2026-12-31')).toBe('Dec 2026');
  });

  it('returns anything unparseable unchanged, so a bad value is visible rather than masked', () => {
    expect(formatMonthYear('Jul 2026')).toBe('Jul 2026');
    expect(formatMonthYear('not a date')).toBe('not a date');
    expect(formatMonthYear('')).toBe('');
  });

  it('does not invent a month for an out-of-range number', () => {
    expect(formatMonthYear('2026-13-01')).toBe('2026-13-01');
    expect(formatMonthYear('2026-00-01')).toBe('2026-00-01');
  });
});

describe('indiaDay', () => {
  it('rolls over at 05:30 IST, which is 00:00 IST, not at UTC midnight', () => {
    expect(indiaDay(new Date('2026-10-04T18:29:59.999Z'))).toBe('2026-10-04'); // 23:59:59 IST
    expect(indiaDay(new Date('2026-10-04T18:30:00.000Z'))).toBe('2026-10-05'); // 00:00 IST
  });

  it('is already the next day while UTC is still on the previous one (00:00 to 05:30 IST)', () => {
    const early = new Date('2026-10-04T23:59:00Z'); // 05:29 IST on Oct 5
    expect(early.toISOString().slice(0, 10)).toBe('2026-10-04');
    expect(indiaDay(early)).toBe('2026-10-05');
  });

  it('crosses month and year ends on the India day', () => {
    expect(indiaDay(new Date('2026-12-31T18:30:00Z'))).toBe('2027-01-01');
    expect(indiaDay(new Date('2026-02-28T18:45:00Z'))).toBe('2026-03-01');
  });

  it('always returns a stored-contract ISO date', () => {
    expect(isIsoDate(indiaDay())).toBe(true);
  });

  it('is what the add-tool scaffold dates new tools and guides with', () => {
    const src = readFileSync(new URL('../../scripts/scaffold-tool.ts', import.meta.url), 'utf8');
    expect(src).toMatch(/const today = indiaDay\(\);/);
    expect(src).not.toMatch(/toISOString\(\)\.slice\(0, 10\)/);
  });
});
