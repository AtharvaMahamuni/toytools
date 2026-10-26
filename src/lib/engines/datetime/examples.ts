// Date and Time worked examples — the engine's data for the platform example registry. One source of
// truth for guides, the widget Load Example action, and tests (datetime.test.ts re-runs each and
// asserts `expect`). Examples that assert on results pin BOTH dates so the outcome is deterministic.

import { buildExampleRegistry, examplesForRef, type WorkedExample } from '@lib/examples/types';
import type { DateTimeInput } from './types';

export const DATETIME_EXAMPLES: WorkedExample<DateTimeInput>[] = [
  {
    id: 'sleep-wake-7am',
    engine: 'datetime',
    ref: 'sleep',
    title: 'Wake at 7:00 am',
    inputs: { direction: 'wake', time: '07:00', latency: 15, cycle: 90 },
    expect: { recommended: 23 * 60 + 15, 'cycle-6': 21 * 60 + 45, 'cycle-4': 45, 'cycle-3': 2 * 60 + 15 },
    narrative: 'Waking at 7:00 with 15 minutes to fall asleep and 90 minute cycles puts a 5-cycle bedtime at 11:15 pm.',
  },
  {
    id: 'sleep-bed-1030',
    engine: 'datetime',
    ref: 'sleep',
    title: 'Into bed at 10:30 pm',
    inputs: { direction: 'sleep', time: '10:30 pm', latency: 15, cycle: 90 },
    expect: { recommended: 6 * 60 + 15 },
    narrative: 'Getting into bed at 10:30 pm, then 15 minutes to fall asleep and five 90 minute cycles, wakes you at 6:15 am.',
  },
  {
    id: 'pregnancy-28-day',
    engine: 'datetime',
    ref: 'pregnancy',
    title: '28 day cycle, 1 January 2026',
    inputs: { lmp: '2026-01-01', cycle: 28, asOf: '2026-03-01' },
    expect: { due: 20261008, 'gestational-age': 59, trimester: 1, countdown: 221, conception: 20260115 },
    narrative: 'A last period on 1 January 2026 and a 28 day cycle give a due date of 8 October 2026. On 1 March that is 8 weeks and 3 days, still the first trimester.',
  },
  {
    id: 'pregnancy-32-day',
    engine: 'datetime',
    ref: 'pregnancy',
    title: '32 day cycle, same dates',
    inputs: { lmp: '2026-01-01', cycle: 32, asOf: '2026-03-01' },
    expect: { due: 20261012, 'gestational-age': 59, trimester: 1, countdown: 225, conception: 20260119 },
    narrative: 'The same last period with a 32 day cycle moves the due date to 12 October 2026, four days later. The week count stays 8 weeks and 3 days.',
  },
  {
    id: 'ovulation-14-day',
    engine: 'datetime',
    ref: 'ovulation',
    title: '14 day luteal phase, 1 January 2026',
    inputs: { lmp: '2026-01-01', cycle: 28, luteal: 14, asOf: '2026-01-10' },
    expect: { ovulation: 20260115, 'fertile-window': 20260110, 'next-period': 20260129, 'window-status': 0 },
    narrative: 'A last period on 1 January 2026, a 28 day cycle, and a 14 day luteal phase put ovulation on 15 January. The fertile window is 10 January to 15 January, and 10 January is inside it. The next period is 29 January.',
  },
  {
    id: 'ovulation-12-day',
    engine: 'datetime',
    ref: 'ovulation',
    title: '12 day luteal phase, same period',
    inputs: { lmp: '2026-01-01', cycle: 28, luteal: 12, asOf: '2026-01-10' },
    expect: { ovulation: 20260117, 'fertile-window': 20260112, 'next-period': 20260129, 'window-status': -2 },
    narrative: 'A 12 day luteal phase moves ovulation to 17 January 2026, two days later than a 14 day phase. The next period stays 29 January. 10 January is two days before the window.',
  },
  {
    id: 'age-basic',
    engine: 'datetime',
    ref: 'age',
    title: 'Age on a fixed date',
    inputs: { birthDate: '1990-05-15', asOf: '2026-07-08' },
    // Keys are result-card ids (hero 'age' + metric cards), matched against each card's `raw`.
    expect: { 'age': 36, 'total-months': 433, 'total-weeks': 1886, 'total-days': 13203 },
    narrative: 'Someone born on 15 May 1990 is 36 years, 1 month, and 23 days old on 8 July 2026.',
  },
  {
    id: 'age-today',
    engine: 'datetime',
    ref: 'age',
    title: 'Age today from a birth date',
    inputs: { birthDate: '2000-01-01', asOf: '' },
    narrative: 'Leave the second date blank to measure age as of today.',
  },
  {
    id: 'diff-project',
    engine: 'datetime',
    ref: 'date-difference',
    title: 'Days between two project dates',
    inputs: { startDate: '2026-01-01', endDate: '2026-07-08' },
    expect: { 'total-days': 188, 'total-weeks': 26, 'business-days': 134 },
    narrative: 'From 1 January to 8 July 2026 is 6 months and 7 days, or 188 days (134 weekdays).',
  },
  {
    id: 'tz-ny-tokyo',
    engine: 'datetime',
    ref: 'timezone',
    title: 'New York to Tokyo',
    inputs: { datetime: '2026-07-08T09:00', fromZone: 'America/New_York', toZone: 'Asia/Tokyo' },
    // 'difference' card raw is the offset gap in minutes: Tokyo (UTC+9) minus New York (UTC-4 in July).
    expect: { 'difference': 780 },
    narrative: '09:00 in New York on 8 July 2026 is 22:00 the same day in Tokyo, 13 hours ahead.',
  },
  {
    id: 'ts-to-date',
    engine: 'datetime',
    ref: 'unix-timestamp',
    title: 'Timestamp to a date',
    inputs: { mode: 'to-date', timestamp: 1700000000, unit: 'seconds' },
    // 'milliseconds' card raw is the epoch in ms for the entered seconds timestamp.
    expect: { 'milliseconds': 1_700_000_000_000, 'weekday': 2 },
    narrative: '1700000000 seconds is 22:13:20 UTC on Tuesday 14 November 2023.',
  },
  {
    id: 'ts-from-date',
    engine: 'datetime',
    ref: 'unix-timestamp',
    title: 'Date to a timestamp',
    inputs: { mode: 'to-timestamp', datetime: '2023-11-14T22:13:20' },
    // Entered time is read as UTC, so the timestamp is deterministic.
    expect: { 'unix-seconds': 1_700_000_000, 'milliseconds': 1_700_000_000_000 },
    narrative: '14 November 2023 at 22:13:20 UTC is the Unix timestamp 1700000000.',
  },
  {
    id: 'cron-every-15',
    engine: 'datetime',
    ref: 'cron',
    title: 'Every 15 minutes',
    inputs: { expression: '*/15 * * * *' },
    // 'per-day' card raw: 4 minute slots x 24 hours.
    expect: { 'per-day': 96 },
    narrative: '*/15 * * * * runs every 15 minutes, which is 96 times a day.',
  },
  {
    id: 'systemd-weekdays',
    engine: 'datetime',
    ref: 'systemd-timer',
    title: 'Weekday mornings',
    inputs: { expression: '0 9 * * 1-5', unit: 'morning-report' },
    narrative: '0 9 * * 1-5 becomes OnCalendar=Mon..Fri *-*-* 09:00:00, which fires on exactly the same days.',
  },
  {
    // The example worth loading: both day fields are restricted, so the two grammars disagree.
    id: 'systemd-friday-13th',
    engine: 'datetime',
    ref: 'systemd-timer',
    title: 'Where cron and systemd disagree',
    inputs: { expression: '0 0 13 * 5', unit: 'audit' },
    narrative:
      '0 0 13 * 5 runs on the 13th OR any Friday under cron, and only on a Friday the 13th as a systemd timer.',
  },
  {
    id: 'date-format-mixed',
    engine: 'datetime',
    ref: 'date-format',
    title: 'A short column that decides its own order',
    inputs: { dates: '03/04/2026\n2026-04-13\n13/04/2026' },
    expect: { summary: 0, resolved: 1, ambiguous: 0, 'one-reading': 2, 'missing-zone': 0, 'two-digit-year': 0, unreadable: 0 },
    narrative: '13/04/2026 only works day first, so the column is day first and 03/04/2026 is read as 3 April 2026.',
  },
];

export const DATETIME_EXAMPLE_MAP = buildExampleRegistry(DATETIME_EXAMPLES);

export function dateTimeExamplesFor(ref: string): WorkedExample<DateTimeInput>[] {
  return examplesForRef(DATETIME_EXAMPLES, 'datetime', ref);
}
