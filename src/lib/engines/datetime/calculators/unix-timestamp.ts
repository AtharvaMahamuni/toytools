// Unix Timestamp Converter. Two directions in one tool: a Unix timestamp (seconds or milliseconds) to
// a human date, and a date and time back to a Unix timestamp. The date-to-timestamp direction treats
// the entered wall-clock time as UTC so the result is unambiguous and deterministic; the guide states
// this. Relative phrasing ("5 years ago") reads the device clock and appears only in insights, never
// in an asserted metric, so worked examples stay reproducible.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard, InteractiveResult } from '@lib/results/types';
import { weekdayName } from '../format';
import { datetimeField } from '../validation';
import { insight, milestone, toolDecision, decisions } from '../story';
import { partsInZone, formatReading, clock } from '../zones';

const MODE_TO_DATE = 'to-date';
const MODE_TO_TIMESTAMP = 'to-timestamp';

/** Local IANA zone name, or 'UTC' if the runtime cannot report one. */
function localZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** 'in 3 days' / '5 years ago' / 'right now' — relative to the device clock. */
function relativePhrase(ms: number): string {
  const diff = ms - Date.now();
  const absSec = Math.abs(diff) / 1000;
  if (absSec < 45) return 'right now';
  const units: [number, string][] = [
    [60, 'minute'], [3600, 'hour'], [86_400, 'day'],
    [604_800, 'week'], [2_629_800, 'month'], [31_557_600, 'year'],
  ];
  let value = absSec;
  let unit = 'second';
  for (const [secs, name] of units) {
    if (absSec < secs) break;
    value = absSec / secs;
    unit = name;
  }
  const n = Math.round(value);
  const label = `${n} ${unit}${n === 1 ? '' : 's'}`;
  return diff >= 0 ? `in ${label}` : `${label} ago`;
}

function timestampToDate(input: Record<string, number | string>): InteractiveResult {
  const raw = input.timestamp;
  if (raw === undefined || raw === '' || raw === null) {
    return validationError('Enter a Unix timestamp to convert to a date.');
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return validationError('The timestamp must be a number.');
  }
  const unit = String(input.unit ?? 'seconds');
  const ms = unit === 'milliseconds' ? value : value * 1000;
  const instant = new Date(ms);
  if (Number.isNaN(instant.getTime())) {
    return validationError('That timestamp is out of the supported range.');
  }

  const utcRead = partsInZone('UTC', instant);
  const zone = localZone();
  const localRead = partsInZone(zone, instant);

  const hero = card('moment', 'UTC time', formatReading(utcRead), {
    raw: ms,
    emphasis: 'hero',
    note: instant.toISOString(),
  });

  const metrics: ResultCard[] = [
    card('local', 'Your local time', formatReading(localRead), { note: zone }),
    card('iso', 'ISO 8601', instant.toISOString(), {}),
    card('weekday', 'Day of week', weekdayName(utcRead.weekday), { raw: utcRead.weekday }),
    card('milliseconds', 'In milliseconds', String(ms), { raw: ms }),
  ];

  return successResult({
    hero,
    metrics,
    insights: [
      insight(`In UTC that is ${clock(utcRead)} on ${formatReading(utcRead).split(', ').slice(0, 2).join(', ')}.`),
      insight(`That moment is ${relativePhrase(ms)}.`),
    ],
    milestones: [
      milestone('After the Unix epoch (1970)', ms >= 0),
      milestone('Within 32-bit seconds range', Math.abs(ms / 1000) < 2_147_483_648),
    ],
    decisions: decisions([
      toolDecision('Convert this time to another timezone', 'timezone-converter'),
      toolDecision('Count the days between two dates', 'date-difference-calculator'),
    ]),
    nextQuestions: [
      'What is this time in another timezone?',
      'What is today as a Unix timestamp?',
    ],
    explanation:
      `A Unix timestamp counts the seconds since 1 January 1970 UTC (the epoch). ${String(value)} `
      + `${unit === 'milliseconds' ? 'milliseconds' : 'seconds'} is ${instant.toISOString()}, which is `
      + `${formatReading(utcRead)} UTC.`,
    assumptions: [],
    meta: { ms, unit, iso: instant.toISOString() },
  });
}

function dateToTimestamp(input: Record<string, number | string>): InteractiveResult {
  const dt = datetimeField(input, 'datetime', 'a date and time');
  if (!dt.ok) return dt.result;

  const epochMs = Date.UTC(dt.value.y, dt.value.m - 1, dt.value.d, dt.value.hour, dt.value.minute, dt.value.second);
  const seconds = Math.floor(epochMs / 1000);
  const instant = new Date(epochMs);
  const utcRead = partsInZone('UTC', instant);

  const hero = card('unix-seconds', 'Unix timestamp', String(seconds), {
    raw: seconds,
    emphasis: 'hero',
    note: 'Seconds since 1 Jan 1970 UTC',
  });

  const metrics: ResultCard[] = [
    card('milliseconds', 'In milliseconds', String(epochMs), { raw: epochMs }),
    card('iso', 'ISO 8601', instant.toISOString(), {}),
    card('utc-echo', 'Interpreted as', formatReading(utcRead), { note: 'Entered time read as UTC' }),
    card('weekday', 'Day of week', weekdayName(utcRead.weekday), { raw: utcRead.weekday }),
  ];

  return successResult({
    hero,
    metrics,
    insights: [
      insight('The date and time you entered is read as UTC, so the timestamp is the same everywhere.'),
      insight(`That moment is ${relativePhrase(epochMs)}.`),
    ],
    milestones: [
      milestone('After the Unix epoch (1970)', epochMs >= 0),
      milestone('Within 32-bit seconds range', Math.abs(seconds) < 2_147_483_648),
    ],
    decisions: decisions([
      toolDecision('Convert this time to another timezone', 'timezone-converter'),
      toolDecision('Work out your exact age', 'age-calculator'),
    ]),
    nextQuestions: [
      'What date does a Unix timestamp represent?',
      'What is this time in my local zone?',
    ],
    explanation:
      `Read as UTC, ${formatReading(utcRead)} is ${seconds} seconds since the Unix epoch of `
      + `1 January 1970, or ${epochMs} milliseconds.`,
    assumptions: [],
    meta: { seconds, epochMs, iso: instant.toISOString() },
  });
}

export const unixTimestampConverter: DateTimeTool = {
  id: 'unix-timestamp',
  family: 'timestamp',
  capabilities: { loadExample: true },
  fields: [
    { id: 'mode', label: 'Direction', type: 'select', default: MODE_TO_DATE, options: [
      { value: MODE_TO_DATE, label: 'Timestamp to date' },
      { value: MODE_TO_TIMESTAMP, label: 'Date to timestamp' },
    ] },
    { id: 'timestamp', label: 'Unix timestamp', type: 'number', default: '', optional: true,
      help: 'Used for "Timestamp to date".' },
    { id: 'unit', label: 'Timestamp unit', type: 'select', default: 'seconds', options: [
      { value: 'seconds', label: 'Seconds' },
      { value: 'milliseconds', label: 'Milliseconds' },
    ] },
    { id: 'datetime', label: 'Date and time (UTC)', type: 'datetime', default: '', optional: true,
      help: 'Used for "Date to timestamp"; read as UTC.' },
  ],

  calculate(input, _opts) {
    const mode = String(input.mode ?? MODE_TO_DATE);
    return mode === MODE_TO_TIMESTAMP ? dateToTimestamp(input) : timestampToDate(input);
  },
};
