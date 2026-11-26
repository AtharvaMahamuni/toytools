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
import { readClientI18n } from '@lib/i18n/client';

function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

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
function relativePhrase(ms: number, locale?: string, rightNowText = 'right now'): string {
  const diff = ms - Date.now();
  const absSec = Math.abs(diff) / 1000;
  if (absSec < 45) return rightNowText;
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'minute'], [3600, 'hour'], [86_400, 'day'],
    [604_800, 'week'], [2_629_800, 'month'], [31_557_600, 'year'],
  ];
  let value = absSec;
  let unit: Intl.RelativeTimeFormatUnit = 'second';
  for (const [secs, name] of units) {
    if (absSec < secs) break;
    value = absSec / secs;
    unit = name;
  }
  const signed = (diff >= 0 ? 1 : -1) * Math.round(value);
  if (locale && locale !== 'en' && typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    try {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(signed, unit);
    } catch {}
  }
  const n = Math.round(value);
  const label = `${n} ${unit}${n === 1 ? '' : 's'}`;
  return diff >= 0 ? `in ${label}` : `${label} ago`;
}

function localizedWeekday(instant: Date, utcWeekday: number, locale?: string): string {
  if (locale && locale !== 'en') {
    try {
      return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(instant);
    } catch {}
  }
  return weekdayName(utcWeekday);
}

function timestampToDate(
  input: Record<string, number | string>,
  loc: string,
  ei: Record<string, any>,
): InteractiveResult {
  const raw = input.timestamp;
  if (raw === undefined || raw === '' || raw === null) {
    return validationError(ei.errEnterTs ?? 'Enter a Unix timestamp to convert to a date.');
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return validationError(ei.errNotNumber ?? 'The timestamp must be a number.');
  }
  const unit = String(input.unit ?? 'seconds');
  const ms = unit === 'milliseconds' ? value : value * 1000;
  const instant = new Date(ms);
  if (Number.isNaN(instant.getTime())) {
    return validationError(ei.errOutOfRange ?? 'That timestamp is out of the supported range.');
  }

  const utcRead = partsInZone('UTC', instant);
  const zone = localZone();
  const localRead = partsInZone(zone, instant);

  const hero = card('moment', ei.heroUtc ?? 'UTC time', formatReading(utcRead), {
    raw: ms,
    emphasis: 'hero',
    note: instant.toISOString(),
  });

  const metrics: ResultCard[] = [
    card('local', ei.labelLocal ?? 'Your local time', formatReading(localRead), { note: zone }),
    card('iso', 'ISO 8601', instant.toISOString(), {}),
    card('weekday', ei.labelWeekday ?? 'Day of week', localizedWeekday(instant, utcRead.weekday, loc), { raw: utcRead.weekday }),
    card('milliseconds', ei.labelMillis ?? 'In milliseconds', String(ms), { raw: ms }),
  ];

  const digits = String(Math.trunc(Math.abs(value))).length;
  const looksMillis = unit !== 'milliseconds' && digits === 13;
  const asMillis = looksMillis ? new Date(value) : null;
  const rel = relativePhrase(ms, loc, ei.rightNow);
  const unitWord = unit === 'milliseconds' ? (ei.unitMillis ?? 'milliseconds') : (ei.unitSeconds ?? 'seconds');

  return successResult({
    hero,
    metrics,
    insights: [
      ...(asMillis && !Number.isNaN(asMillis.getTime())
        ? [insight(tpl(ei.insightMillis ?? '13 digits looks like milliseconds. As milliseconds it is {iso}. Set Timestamp unit to Milliseconds.', { iso: asMillis.toISOString() }))]
        : []),
      insight(tpl(ei.insightUtc ?? 'In UTC that is {time} on {date}.', {
        time: clock(utcRead),
        date: formatReading(utcRead).split(', ').slice(0, 2).join(', '),
      })),
      insight(tpl(ei.insightRel ?? 'That moment is {rel}.', { rel })),
    ],
    milestones: [
      milestone(ei.msAfterEpoch ?? 'After the Unix epoch (1970)', ms >= 0),
      milestone(ei.ms32Bit ?? 'Within 32-bit seconds range', Math.abs(ms / 1000) < 2_147_483_648),
    ],
    decisions: decisions([
      toolDecision('Convert this time to another timezone', 'timezone-converter'),
      toolDecision('Count the days between two dates', 'date-difference-calculator'),
    ]).map(d => {
      const ov = d.tool?.slug === 'timezone-converter' ? ei.decTimezone : d.tool?.slug === 'date-difference-calculator' ? ei.decDiff : undefined;
      return ov ? { ...d, label: ov } : d;
    }),
    nextQuestions: ei.nextQsToDate ?? [
      'What is this time in another timezone?',
      'What is today as a Unix timestamp?',
    ],
    explanation: tpl(
      ei.explToDate ?? 'A Unix timestamp counts the seconds since 1 January 1970 UTC (the epoch). {val} {unit} is {iso}, which is {utc} UTC.',
      { val: String(value), unit: unitWord, iso: instant.toISOString(), utc: formatReading(utcRead) },
    ),
    assumptions: [],
    meta: { ms, unit, iso: instant.toISOString() },
  });
}

function dateToTimestamp(
  input: Record<string, number | string>,
  loc: string,
  ei: Record<string, any>,
): InteractiveResult {
  const dt = datetimeField(input, 'datetime', ei.fieldDatetime ?? 'a date and time');
  if (!dt.ok) return dt.result;

  const epochMs = Date.UTC(dt.value.y, dt.value.m - 1, dt.value.d, dt.value.hour, dt.value.minute, dt.value.second);
  const seconds = Math.floor(epochMs / 1000);
  const instant = new Date(epochMs);
  const utcRead = partsInZone('UTC', instant);

  const hero = card('unix-seconds', ei.heroUnix ?? 'Unix timestamp', String(seconds), {
    raw: seconds,
    emphasis: 'hero',
    note: ei.heroUnixNote ?? 'Seconds since 1 Jan 1970 UTC',
  });

  const metrics: ResultCard[] = [
    card('milliseconds', ei.labelMillis ?? 'In milliseconds', String(epochMs), { raw: epochMs }),
    card('iso', 'ISO 8601', instant.toISOString(), {}),
    card('utc-echo', ei.labelInterpreted ?? 'Interpreted as', formatReading(utcRead), { note: ei.noteUtc ?? 'Entered time read as UTC' }),
    card('weekday', ei.labelWeekday ?? 'Day of week', localizedWeekday(instant, utcRead.weekday, loc), { raw: utcRead.weekday }),
  ];

  const rel = relativePhrase(epochMs, loc, ei.rightNow);

  return successResult({
    hero,
    metrics,
    insights: [
      insight(ei.insightUtcInput ?? 'The date and time you entered is read as UTC, so the timestamp is the same everywhere.'),
      insight(tpl(ei.insightRel ?? 'That moment is {rel}.', { rel })),
    ],
    milestones: [
      milestone(ei.msAfterEpoch ?? 'After the Unix epoch (1970)', epochMs >= 0),
      milestone(ei.ms32Bit ?? 'Within 32-bit seconds range', Math.abs(seconds) < 2_147_483_648),
    ],
    decisions: decisions([
      toolDecision('Convert this time to another timezone', 'timezone-converter'),
      toolDecision('Work out your exact age', 'age-calculator'),
    ]).map(d => {
      const ov = d.tool?.slug === 'timezone-converter' ? ei.decTimezone : d.tool?.slug === 'age-calculator' ? ei.decAge : undefined;
      return ov ? { ...d, label: ov } : d;
    }),
    nextQuestions: ei.nextQsToTs ?? [
      'What date does a Unix timestamp represent?',
      'What is this time in my local zone?',
    ],
    explanation: tpl(
      ei.explToTs ?? 'Read as UTC, {utc} is {sec} seconds since the Unix epoch of 1 January 1970, or {ms} milliseconds.',
      { utc: formatReading(utcRead), sec: String(seconds), ms: String(epochMs) },
    ),
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

  calculate(input, opts) {
    const loc = opts?.locale && opts.locale !== 'en' ? opts.locale : '';
    const ei = loc ? (readClientI18n().engine ?? {}) as Record<string, any> : {};
    const mode = String(input.mode ?? MODE_TO_DATE);
    return mode === MODE_TO_TIMESTAMP
      ? dateToTimestamp(input, loc, ei)
      : timestampToDate(input, loc, ei);
  },
};
