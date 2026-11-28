// Timezone Converter. Takes a wall-clock date and time in one zone and reports the same instant in
// another, plus the UTC time, each zone's offset, and the exact difference between the two zones.
// Daylight saving is handled by the runtime's IANA database (see zones.ts), so offsets are correct
// for the specific date entered, not a fixed guess.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { datetimeField } from '../validation';
import { insight, milestone, toolDecision, decisions } from '../story';
import { readClientI18n } from '@lib/i18n/client';
import {
  ZONES, zoneLabel, partsInZone, zoneOffsetMs, zonedWallToUtc, wallTimeStatus, offsetLabel, clock,
  formatReading, monthShort,
} from '../zones';

function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** 'is 13h 30m ahead of' / 'is 5h behind' / 'is the same time as'. */
function diffPhrase(diffMin: number, ei: Record<string, any>): string {
  if (diffMin === 0) return ei.sameTimePhrase ?? 'is the same time as';
  const ahead = diffMin > 0;
  const total = Math.abs(diffMin);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const span = m === 0 ? `${h}h` : `${h}h ${m}m`;
  if (ahead && ei.aheadTpl) return tpl(ei.aheadTpl, { span });
  if (!ahead && ei.behindTpl) return tpl(ei.behindTpl, { span });
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
    const ei = (readClientI18n().engine ?? {}) as Record<string, any>;
    const dt = datetimeField(input, 'datetime', ei.vLabel_datetime ?? 'a date and time');
    if (!dt.ok) return dt.result;

    const fromZone = String(input.fromZone ?? 'UTC');
    const toZone = String(input.toZone ?? 'UTC');
    if (!isKnownZone(fromZone) || !isKnownZone(toZone)) {
      return validationError(ei.errBadZone ?? 'Pick a timezone from the list to convert between.');
    }

    // Treat the entered wall-clock time as local to fromZone, resolve the true instant, then read it
    // back in every zone we report.
    const utcMs = zonedWallToUtc(dt.value, fromZone);
    const instant = new Date(utcMs);
    const wallStatus = wallTimeStatus(dt.value, fromZone);

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

    const hero = card('converted', ei.timeInTpl ? tpl(ei.timeInTpl, { zone: toName }) : `Time in ${toName}`, clock(targetRead), {
      raw: utcMs,
      emphasis: 'hero',
      note: formatReading(targetRead),
    });

    const phrase = diffPhrase(diffMin, ei);
    const metrics: ResultCard[] = [
      card('source', ei.inZoneTpl ? tpl(ei.inZoneTpl, { zone: fromName }) : `In ${fromName}`, clock(sourceRead), {
        emphasis: 'primary',
        note: `${formatReading(sourceRead)} (${offsetLabel(fromOffset)})`,
      }),
      card('utc', ei.inUtc ?? 'In UTC', clock(utcRead), { note: formatReading(utcRead) }),
      card('difference', ei.diffLabel ?? 'Time difference', diffMin === 0 ? (ei.sameTime ?? 'Same time') : offsetDiffLabel(diffMin), {
        raw: diffMin,
        note: `${toName} ${phrase} ${fromName}`,
      }),
      card('target-offset', ei.offsetTpl ? tpl(ei.offsetTpl, { zone: toName }) : `${toName} offset`, offsetLabel(toOffset), { note: ei.fromUtcNote ?? 'From UTC on this date' }),
    ];

    const insights = [
      insight(`${toName} ${phrase} ${fromName}.`),
      dayShiftDays === 0
        ? insight(ei.sameDay ?? 'Both zones are on the same calendar day for this time.')
        : insight(
            dayShiftDays > 0
              ? (ei.nextDayTpl ? tpl(ei.nextDayTpl, { zone: toName }) : `In ${toName} it is already the next day.`)
              : (ei.prevDayTpl ? tpl(ei.prevDayTpl, { zone: toName }) : `In ${toName} it is still the previous day.`),
            'info',
          ),
      ...(wallStatus === 'nonexistent'
        ? [insight(
            ei.dstMissingTpl
              ? tpl(ei.dstMissingTpl, { time: clock(dt.value), zone: fromName, after: clock(sourceRead) })
              : `${clock(dt.value)} does not exist in ${fromName} on this date: the clocks jump forward over it for daylight saving. The result uses the time just after the jump, ${clock(sourceRead)}.`,
            'warning',
          )]
        : wallStatus === 'ambiguous'
          ? [insight(
              ei.dstAmbigTpl
                ? tpl(ei.dstAmbigTpl, { time: clock(dt.value), zone: fromName, offset: offsetLabel(fromOffset) })
                : `${clock(dt.value)} happens twice in ${fromName} on this date because the clocks fall back an hour. The result uses the first of the two (${offsetLabel(fromOffset)}); the second is an hour later.`,
              'warning',
            )]
          : []),
      insight(
        ei.dstReadTpl
          ? tpl(ei.dstReadTpl, { date: `${sourceRead.d} ${monthShort(sourceRead.m)} ${sourceRead.y}` })
          : `Offsets are read for ${sourceRead.d} ${monthShort(sourceRead.m)} ${sourceRead.y}, so daylight saving is accounted for.`,
      ),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone(ei.msWholeHour ?? 'Zones differ by a whole hour', diffMin % 60 === 0 && diffMin !== 0),
        milestone(ei.msCrossDay ?? 'Conversion crosses a calendar day', dayShiftDays !== 0),
      ],
      decisions: decisions([
        toolDecision('Turn a date into a Unix timestamp', 'unix-timestamp-converter'),
        toolDecision('Count the days between two dates', 'date-difference-calculator'),
      ]).map((d) => {
        const map: Record<string, string | undefined> = {
          'unix-timestamp-converter': ei.decUnix,
          'date-difference-calculator': ei.decDateDiff,
        };
        const label = d.tool?.slug ? map[d.tool.slug] : undefined;
        return label ? { ...d, label } : d;
      }),
      nextQuestions: [
        ei.q1 ?? 'What is this time in UTC?',
        ei.q2 ?? 'How many hours ahead is one city from another?',
      ],
      explanation: ei.explanationTpl
        ? tpl(ei.explanationTpl, {
            srcTime: clock(sourceRead),
            srcZone: fromName,
            srcOffset: offsetLabel(fromOffset),
            dstTime: clock(targetRead),
            dstZone: toName,
            dstOffset: offsetLabel(toOffset),
            utcTime: clock(utcRead),
            diff: offsetDiffLabel(diffMin),
          })
        : (`${clock(sourceRead)} in ${fromName} (${offsetLabel(fromOffset)}) is the same instant as `
          + `${clock(targetRead)} in ${toName} (${offsetLabel(toOffset)}), which is ${clock(utcRead)} UTC. `
          + `The two zones differ by ${offsetDiffLabel(diffMin)} on this date.`),
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
