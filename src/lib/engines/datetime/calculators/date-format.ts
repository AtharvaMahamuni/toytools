// Date Format Detector. A pasted column is checked line by line. A numeric date whose two
// fields are both 12 or under is shown as day-first and as month-first. The tool never picks
// one, never invents a time zone, and never rewrites the paste.
//
// The open result is the count plus at most a short list of two-reading rows. The full reading
// list is the explanation, which the ledger keeps inside "How this was worked out", so a long
// column does not push the textarea down the phone.

import type { DateTimeTool } from '../types';
import { successResult, validationError, card } from '@lib/results/index';
import type { Insight } from '@lib/results/types';
import { daysInMonth, type CivilDate } from '../models';
import { formatCivil } from '../format';
import { assumption, decisions, insight, toolDecision } from '../story';

const LINE_CAP = 200;
const INSIGHT_CAP = 8;
const EXPLAIN_CAP = 20;

const MONTHS: Record<string, number> = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

const ISO = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?(Z|[+-]\d{2}(?::?\d{2})?)?$/i;
const NAMED_DAY_FIRST = /^(\d{1,2})[ .]+([A-Za-z]+),?[ ]+(\d{2}|\d{4})$/;
const NAMED_MONTH_FIRST = /^([A-Za-z]+)[ .]+(\d{1,2}),?[ ]+(\d{2}|\d{4})$/;
// Both separators are captured so a mix (03/04-2025) can be refused; the zone only follows a time.
const NUMERIC = /^(\d{1,4})([/. -])(\d{1,2})([/. -])(\d{1,4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}(?::?\d{2})?)?)?$/i;
const ZONE_NO_TIME = /^\d{1,4}[/. -]\d{1,2}[/. -]\d{1,4}(Z|[+-]\d{2}(?::?\d{2})?)$/i;
const ORDINAL = /\b\d{1,2}(st|nd|rd|th)\b/i;
const COMPACT = /^\d{8}$/;

type Order = 'day-first' | 'month-first' | 'year-first' | 'named';

interface Reading {
  date: CivilDate;
  order: Order;
}

interface Row {
  line: number;
  raw: string;
  readings: Reading[];
  zoneless: boolean;
  twoDigitYear: boolean;
  /** Why the row could not be read, set only when `readings` is empty. */
  reason?: string;
}

function civil(y: number, m: number, d: number): CivilDate | null {
  if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
  return { y, m, d };
}

/** 00-69 → 2000-2069, 70-99 → 1970-1999. Four-digit years are used as written. */
function resolveYear(token: string): { year: number; twoDigit: boolean } | null {
  if (/^\d{4}$/.test(token)) {
    const year = Number(token);
    if (year < 1) return null;
    return { year, twoDigit: false };
  }
  if (/^\d{2}$/.test(token)) {
    const yy = Number(token);
    return { year: yy <= 69 ? 2000 + yy : 1900 + yy, twoDigit: true };
  }
  return null;
}

function clock(
  hour: string | undefined,
  minute: string | undefined,
  second: string | undefined,
  zone: string | undefined,
): { ok: true; zoneless: boolean } | { ok: false } {
  if (hour === undefined) return { ok: true, zoneless: false };
  const h = Number(hour);
  const mi = Number(minute);
  const s = second === undefined ? 0 : Number(second);
  if (h > 23 || mi > 59 || s > 59) return { ok: false };
  return { ok: true, zoneless: zone === undefined };
}

function orderLabel(order: Order): string {
  if (order === 'day-first') return 'day first';
  if (order === 'month-first') return 'month first';
  if (order === 'year-first') return 'year first';
  return 'named month';
}

function sameCivil(a: CivilDate, b: CivilDate): boolean {
  return a.y === b.y && a.m === b.m && a.d === b.d;
}

/** Two labels for one calendar day, such as 05/05/2026, are not two different days. */
function swapsDay(row: Row): boolean {
  return row.readings.length === 2 && !sameCivil(row.readings[0].date, row.readings[1].date);
}

function rowSentence(row: Row): string {
  if (row.readings.length === 0) return `Line ${row.line}, ${row.raw}: could not be read. ${row.reason ?? NO_PATTERN}`;
  const sameDay = row.readings.length === 2 && !swapsDay(row);
  const dates = sameDay
    ? `${formatCivil(row.readings[0].date)} (day first and month first)`
    : row.readings.map((r) => `${formatCivil(r.date)} (${orderLabel(r.order)})`).join(' or ');
  let text = `Line ${row.line}, ${row.raw}: ${dates}.`;
  if (row.twoDigitYear) text += ' Two-digit year.';
  if (row.zoneless) text += ' No time zone, so the civil day can move.';
  return text;
}

function numericReadings(dayOrMonth: number, monthOrDay: number, year: number): Reading[] {
  const out: Reading[] = [];
  const dayFirst = () => civil(year, monthOrDay, dayOrMonth);
  const monthFirst = () => civil(year, dayOrMonth, monthOrDay);
  if (dayOrMonth > 12 && monthOrDay > 12) return out;
  if (dayOrMonth > 12) {
    const date = dayFirst();
    if (date) out.push({ date, order: 'day-first' });
    return out;
  }
  if (monthOrDay > 12) {
    const date = monthFirst();
    if (date) out.push({ date, order: 'month-first' });
    return out;
  }
  const asDayFirst = dayFirst();
  const asMonthFirst = monthFirst();
  if (asDayFirst) out.push({ date: asDayFirst, order: 'day-first' });
  if (asMonthFirst) out.push({ date: asMonthFirst, order: 'month-first' });
  return out;
}

const NO_PATTERN = 'It does not look like a date this tool reads.';
const NO_SUCH_DAY = 'That date does not exist. Check the day and the month.';
const ZONE_NO_TIME_REASON = 'A time zone with no time is not read. Add the time, or drop the zone.';
const YEAR_ZERO = 'Year 0 is not a valid year. Years start at 1.';
const BAD_TIME = 'The time is out of range (hours 00 to 23, minutes and seconds 00 to 59).';

/** The reason a line that matched no date pattern was refused, for the warning on its row. */
function unmatchedReason(raw: string): string {
  if (COMPACT.test(raw)) return 'Compact dates such as 20250403 are not read. Add separators, as in 2025-04-03.';
  if (ORDINAL.test(raw)) return 'Ordinals such as 3rd are not read. Write 3 April 2025 instead.';
  if (ZONE_NO_TIME.test(raw)) return ZONE_NO_TIME_REASON;
  return NO_PATTERN;
}

function parseBody(raw: string): Omit<Row, 'line'> {
  const empty = { readings: [] as Reading[], zoneless: false, twoDigitYear: false };
  const refuse = (reason: string) => ({ ...empty, raw, reason });

  const iso = ISO.exec(raw);
  if (iso) {
    if (iso[7] !== undefined && iso[4] === undefined) return refuse(ZONE_NO_TIME_REASON);
    const when = clock(iso[4], iso[5], iso[6], iso[7]);
    if (!when.ok) return refuse(BAD_TIME);
    if (Number(iso[1]) === 0) return refuse(YEAR_ZERO);
    const date = civil(Number(iso[1]), Number(iso[2]), Number(iso[3]));
    if (!date) return refuse(NO_SUCH_DAY);
    return {
      raw,
      readings: [{ date, order: 'year-first' }],
      zoneless: when.zoneless,
      twoDigitYear: false,
    };
  }

  const namedDay = NAMED_DAY_FIRST.exec(raw);
  if (namedDay) {
    const month = MONTHS[namedDay[2].toLowerCase()];
    if (!month) return refuse(`"${namedDay[2]}" is not a month name this tool knows.`);
    if (/^0000$/.test(namedDay[3])) return refuse(YEAR_ZERO);
    const year = resolveYear(namedDay[3]);
    if (!year) return refuse(NO_PATTERN);
    const date = civil(year.year, month, Number(namedDay[1]));
    if (!date) return refuse(NO_SUCH_DAY);
    return { raw, readings: [{ date, order: 'named' }], zoneless: false, twoDigitYear: year.twoDigit };
  }

  const namedMonth = NAMED_MONTH_FIRST.exec(raw);
  if (namedMonth) {
    const month = MONTHS[namedMonth[1].toLowerCase()];
    if (!month) return refuse(`"${namedMonth[1]}" is not a month name this tool knows.`);
    if (/^0000$/.test(namedMonth[3])) return refuse(YEAR_ZERO);
    const year = resolveYear(namedMonth[3]);
    if (!year) return refuse(NO_PATTERN);
    const date = civil(year.year, month, Number(namedMonth[2]));
    if (!date) return refuse(NO_SUCH_DAY);
    return { raw, readings: [{ date, order: 'named' }], zoneless: false, twoDigitYear: year.twoDigit };
  }

  const num = NUMERIC.exec(raw);
  if (!num) return refuse(unmatchedReason(raw));
  if (num[2] !== num[4]) return refuse(`Mixed separators (${num[2] === ' ' ? 'a space' : num[2]} and ${num[4] === ' ' ? 'a space' : num[4]}) are not read. Use one separator throughout.`);
  const when = clock(num[6], num[7], num[8], num[9]);
  if (!when.ok) return refuse(BAD_TIME);

  const head = num[1];
  const middle = num[3];
  const last = num[5];
  if (head.length === 4) {
    // Year first: the month and day may be written without zero padding (2025/4/3).
    if (last.length === 4) {
      // 0003/04/2025: the year is at the end, so the first part is a padded day or month.
      if (Number(head) <= 31) {
        return refuse('The year is at the end, so the first part is a day or month and has one or two digits, as in 03/04/2025.');
      }
      // 2025/04/2025: both ends look like a year.
      return refuse('Both the first and last parts have four digits. Only one of them can be the year.');
    }
    if (last.length > 2) return refuse('After a four-digit year, the day must be one or two digits.');
    if (Number(head) === 0) return refuse(YEAR_ZERO);
    const date = civil(Number(head), Number(middle), Number(last));
    if (!date) return refuse(NO_SUCH_DAY);
    return {
      raw,
      readings: [{ date, order: 'year-first' }],
      zoneless: when.zoneless,
      twoDigitYear: false,
    };
  }
  if (head.length === 3) return refuse(NO_PATTERN);

  if (last.length === 4 && Number(last) === 0) return refuse(YEAR_ZERO);
  const year = resolveYear(last);
  if (!year) return refuse('The year must have two or four digits.');
  const readings = numericReadings(Number(head), Number(middle), year.year);
  if (readings.length === 0) return refuse(NO_SUCH_DAY);
  return {
    raw,
    readings,
    zoneless: when.zoneless,
    twoDigitYear: year.twoDigit,
  };
}

/** "Line 4", "Lines 2 and 5", "Lines 1, 3 and 9", listing at most `cap` then "and N more". */
function lineList(rows: Row[], cap = 8): string {
  const nums = rows.slice(0, cap).map((r) => String(r.line));
  const more = rows.length - nums.length;
  if (more > 0) return `Lines ${nums.join(', ')} and ${more} more`;
  if (nums.length === 1) return `Line ${nums[0]}`;
  return `Lines ${nums.slice(0, -1).join(', ')} and ${nums[nums.length - 1]}`;
}

export const dateFormatDetector: DateTimeTool = {
  id: 'date-format',
  family: 'parse',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'dates',
      label: 'Dates',
      type: 'text',
      multiline: true,
      default: '',
      help: 'One date per line. A row where both numbers are 12 or under is shown both ways.',
    },
  ],

  calculate(input) {
    const text = String(input.dates ?? '');
    if (text.trim() === '') return validationError('Paste at least one date, one per line.');

    const source = text.split(/\r?\n/);
    while (source.length > 0 && source[source.length - 1].trim() === '') source.pop();
    const truncated = source.length > LINE_CAP;
    const slice = truncated ? source.slice(0, LINE_CAP) : source;
    const rows: Row[] = [];
    slice.forEach((line, index) => {
      const raw = line.trim();
      if (raw === '') return;
      rows.push({ line: index + 1, ...parseBody(raw) });
    });

    if (rows.length === 0) {
      const tail = truncated ? ' Stopped at line 200. Line 201 onward was not read.' : '';
      return validationError(`Paste at least one date, one per line.${tail}`);
    }

    const ambiguous = rows.filter(swapsDay);
    const one = rows.filter((row) => row.readings.length > 0 && !swapsDay(row));
    const unreadable = rows.filter((row) => row.readings.length === 0);
    const zoneless = rows.filter((row) => row.zoneless);
    const twoDigit = rows.filter((row) => row.twoDigitYear);

    const TRUNCATED = 'Stopped at line 200. Line 201 onward was not read.';
    const unreadNote = unreadable.length === 0
      ? ''
      : `${lineList(unreadable)} could not be read.`;
    const twoWayNote = ambiguous.length === 0
      ? ''
      : ambiguous.length === 1
        ? '1 row can be read as two different days.'
        : `${ambiguous.length} rows can be read as two different days.`;
    const note = [twoWayNote, unreadNote, truncated ? TRUNCATED : ''].filter(Boolean).join(' ') || undefined;

    // Two readings is the headline whenever any row has them. Otherwise unreadable rows are, and a
    // column where every row reads one way is quiet.
    const hero = ambiguous.length > 0
      ? card('summary', 'can be read two ways', `${ambiguous.length} of ${rows.length}`, { raw: ambiguous.length, emphasis: 'hero', ...(note ? { note } : {}) })
      : unreadable.length > 0
        ? card('summary', 'could not be read', `${unreadable.length} of ${rows.length}`, { raw: 0, emphasis: 'hero', ...(note ? { note } : {}) })
        : card('summary', 'Dates', 'Each date has one reading', { raw: 0, emphasis: 'hero', ...(note ? { note } : {}) });

    const metrics = [
      card('ambiguous', 'Two readings', String(ambiguous.length), { raw: ambiguous.length, emphasis: 'primary' }),
      card('one-reading', 'One reading', String(one.length), { raw: one.length }),
      card('missing-zone', 'Missing zone', String(zoneless.length), { raw: zoneless.length }),
      card('two-digit-year', 'Two-digit year', String(twoDigit.length), { raw: twoDigit.length }),
      card('unreadable', 'Unreadable', String(unreadable.length), { raw: unreadable.length }),
    ];

    const insights: Insight[] = [...ambiguous, ...unreadable]
      .sort((a, b) => a.line - b.line)
      .slice(0, INSIGHT_CAP)
      .map((row) => insight(rowSentence(row), 'caution'));

    const listed = rows.slice(0, EXPLAIN_CAP).map(rowSentence);
    if (rows.length > EXPLAIN_CAP) {
      listed.push(`${rows.length - EXPLAIN_CAP} more rows are not listed.`);
    }
    if (truncated) listed.push(TRUNCATED);

    return successResult({
      hero,
      metrics,
      insights,
      explanation: listed.join(' '),
      assumptions: [
        assumption('Two-digit years', '00 to 69 are read as 2000 to 2069. 70 to 99 are read as 1970 to 1999.'),
        assumption('Time zone', 'No zone is invented. A time with no offset can fall on the previous or next civil day once a zone is applied.'),
      ],
      decisions: decisions([
        toolDecision('Give a zone to a timestamp that has none', 'timezone-converter'),
        toolDecision('Count the days between two dates once each reading is pinned down', 'date-difference-calculator'),
        toolDecision('Turn one of these dates into a Unix timestamp', 'unix-timestamp-converter'),
      ]),
    });
  },
};
