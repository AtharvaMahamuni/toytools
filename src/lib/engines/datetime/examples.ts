// Date & Time worked examples — the engine's data for the platform example registry. One source of
// truth for guides, the widget Load Example action, and tests (datetime.test.ts re-runs each and
// asserts `expect`). Examples that assert on results pin BOTH dates so the outcome is deterministic.

import { buildExampleRegistry, examplesForRef, type WorkedExample } from '@lib/examples/types';
import type { DateTimeInput } from './types';

export const DATETIME_EXAMPLES: WorkedExample<DateTimeInput>[] = [
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
];

export const DATETIME_EXAMPLE_MAP = buildExampleRegistry(DATETIME_EXAMPLES);

export function dateTimeExamplesFor(ref: string): WorkedExample<DateTimeInput>[] {
  return examplesForRef(DATETIME_EXAMPLES, 'datetime', ref);
}
