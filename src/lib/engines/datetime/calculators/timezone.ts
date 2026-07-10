// Timezone Converter. Takes a wall-clock date and time in one zone and reports the same instant in
// another, plus the UTC time, each zone's offset, and the exact difference between the two zones.
// Daylight saving is handled by the runtime's IANA database (see zones.ts), so offsets are correct
// for the specific date entered, not a fixed guess.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { weekdayName } from '../format';
import { datetimeField } from '../validation';
import { insight, milestone, toolDecision, decisions } from '../story';
import {
  ZONES, zoneLabel, partsInZone, zoneOffsetMs, zonedWallToUtc, offsetLabel, clock,
  type ZonedReading,
} from '../zones';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 'Wed, 8 Jul 2026, 22:30' — a compact, locale-stable rendering of a zoned reading. */
function formatReading(p: ZonedReading): string {
  return `${weekdayName(p.weekday).slice(0, 3)}, ${p.d} ${MONTHS_SHORT[p.m - 1]} ${p.y}, ${clock(p)}`;
}

/** 'is 13h 30m ahead of' / 'is 5h behind' / 'is the same time as'. */
function diffPhrase(diffMin: number): string {
  if (diffMin === 0) return 'is the same time as';
  const ahead = diffMin > 0;
  const total = Math.abs(diffMin);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const span = m === 0 ? `${h}h` : `${h}h ${m}m`;
  return `is ${span} ${ahead ? 'ahead of' : 'behind'}`;
}

const zoneOptions = ZONES.map((z) => ({ value: z.id, label: z.label }));

function isKnownZone(id: string): boolean {
  return ZONES.some((z) => z.id === id);
}

export const timezoneConverter: DateTimeTool = {
  id: 'timezone',
  family: 'timezone',
  capabilities: { loadExample: true },
  fields: [
    { id: 'datetime', label: 'Date and time', type: 'datetime', default: '' },
    { id: 'fromZone', label: 'From timezone', type: 'select', default: 'America/New_York', options: zoneOptions },
    { id: 'toZone', label: 'To timezone', type: 'select', default: 'Asia/Tokyo', options: zoneOptions },
  ],

  calculate(input, _opts) {
    const dt = datetimeField(input, 'datetime', 'a date and time');
    if (!dt.ok) return dt.result;

    const fromZone = String(input.fromZone ?? 'UTC');
    const toZone = String(input.toZone ?? 'UTC');
    if (!isKnownZone(fromZone) || !isKnownZone(toZone)) {
      return validationError('Pick a timezone from the list to convert between.');
    }

    // Treat the entered wall-clock time as local to fromZone, resolve the true instant, then read it
    // back in every zone we report.
    const utcMs = zonedWallToUtc(dt.value, fromZone);
    const instant = new Date(utcMs);

    const sourceRead = partsInZone(fromZone, instant);
    const targetRead = partsInZone(toZone, instant);
    const utcRead = partsInZone('UTC', instant);

    const fromOffset = zoneOffsetMs(fromZone, instant);
    const toOffset = zoneOffsetMs(toZone, instant);
    const diffMin = Math.round((toOffset - fromOffset) / 60_000);

    const fromName = zoneLabel(fromZone);
    const toName = zoneLabel(toZone);

    // How the calendar day shifts across the conversion (crossing midnight or the date line).
    const dayShift =
      Date.UTC(targetRead.y, targetRead.m - 1, targetRead.d) -
      Date.UTC(sourceRead.y, sourceRead.m - 1, sourceRead.d);
    const dayShiftDays = Math.round(dayShift / 86_400_000);

    const hero = card('converted', `Time in ${toName}`, clock(targetRead), {
      raw: utcMs,
      emphasis: 'hero',
      note: formatReading(targetRead),
    });

    const metrics: ResultCard[] = [
      card('source', `In ${fromName}`, clock(sourceRead), {
        emphasis: 'primary',
        note: `${formatReading(sourceRead)} (${offsetLabel(fromOffset)})`,
      }),
      card('utc', 'In UTC', clock(utcRead), { note: formatReading(utcRead) }),
      card('difference', 'Time difference', diffMin === 0 ? 'Same time' : offsetDiffLabel(diffMin), {
        raw: diffMin,
        note: `${toName} ${diffPhrase(diffMin)} ${fromName}`,
      }),
      card('target-offset', `${toName} offset`, offsetLabel(toOffset), { note: 'From UTC on this date' }),
    ];

    const insights = [
      insight(`${toName} ${diffPhrase(diffMin)} ${fromName}.`),
      dayShiftDays === 0
        ? insight(`Both zones are on the same calendar day for this time.`)
        : insight(
            dayShiftDays > 0
              ? `In ${toName} it is already the next day.`
              : `In ${toName} it is still the previous day.`,
            'info',
          ),
      insight(`Offsets are read for ${sourceRead.d} ${MONTHS_SHORT[sourceRead.m - 1]} ${sourceRead.y}, so daylight saving is accounted for.`),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone('Zones differ by a whole hour', diffMin % 60 === 0 && diffMin !== 0),
        milestone('Conversion crosses a calendar day', dayShiftDays !== 0),
      ],
      decisions: decisions([
        toolDecision('Turn a date into a Unix timestamp', 'unix-timestamp-converter'),
        toolDecision('Count the days between two dates', 'date-difference-calculator'),
      ]),
      nextQuestions: [
        'What is this time in UTC?',
        'How many hours ahead is one city from another?',
      ],
      explanation:
        `${clock(sourceRead)} in ${fromName} (${offsetLabel(fromOffset)}) is the same instant as `
        + `${clock(targetRead)} in ${toName} (${offsetLabel(toOffset)}), which is ${clock(utcRead)} UTC. `
        + `The two zones differ by ${offsetDiffLabel(diffMin)} on this date.`,
      assumptions: [],
      meta: {
        utcMs,
        fromZone,
        toZone,
        diffMin,
        fromOffsetMin: Math.round(fromOffset / 60_000),
        toOffsetMin: Math.round(toOffset / 60_000),
        dayShiftDays,
      },
    });
  },
};

/** '+13:30' / '-4:00' — a signed hh:mm gap between two zones. */
function offsetDiffLabel(diffMin: number): string {
  const sign = diffMin >= 0 ? '+' : '-';
  const total = Math.abs(diffMin);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${sign}${h}:${String(m).padStart(2, '0')}`;
}
