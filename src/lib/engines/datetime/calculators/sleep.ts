// Sleep cycle calculator. A typical cycle is 90 minutes. The minutes it takes to fall asleep sit
// outside those cycles: a list that starts the first cycle at lights-out wakes you in the middle
// of one. Bedtimes count backward from a wake time. Wake times count forward from getting into bed.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { assumption, decisions, insight, toolDecision } from '../story';

const CYCLES = [6, 5, 4, 3] as const;

/** Minutes from midnight, or null when the text is not a clock time. */
export function parseClock(raw: string): number | null {
  const s = raw.trim().toLowerCase().replace(/\./g, '');
  const match = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = match[2] === undefined ? 0 : Number(match[2]);
  const meridiem = match[3];
  if (!Number.isInteger(minute) || minute > 59) return null;
  if (meridiem) {
    if (hour < 1 || hour > 12) return null;
    if (meridiem === 'am') hour = hour === 12 ? 0 : hour;
    else hour = hour === 12 ? 12 : hour + 12;
  } else if (hour === 24 && minute === 0) {
    hour = 0;
  } else if (hour > 23) {
    return null;
  }
  return hour * 60 + minute;
}

export function formatClock(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const hour = Math.floor(wrapped / 60);
  const minute = wrapped % 60;
  const meridiem = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${meridiem}`;
}

function whole(input: Record<string, number | string>, key: string, label: string, min: number, max: number): number | string {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) return `Enter ${label}.`;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n) || !Number.isInteger(n)) return `${label} should be a whole number.`;
  if (n < min || n > max) return `${label} should be between ${min} and ${max}.`;
  return n;
}

function momentFor(direction: string, clock: number, latency: number, cycle: number, n: number): number {
  const span = n * cycle + latency;
  const raw = direction === 'sleep' ? clock + span : clock - span;
  return ((raw % 1440) + 1440) % 1440;
}

export const sleepCalculator: DateTimeTool = {
  id: 'sleep',
  family: 'sleep',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'direction',
      label: 'I know',
      type: 'segmented',
      default: 'wake',
      options: [
        { value: 'wake', label: 'When I wake' },
        { value: 'sleep', label: 'When I go to bed' },
      ],
    },
    {
      id: 'time',
      label: 'Clock time',
      type: 'text',
      default: '07:00',
      help: '7:00 am, 07:00, or 19:00. This is the wake time, or the time you get into bed.',
    },
    {
      id: 'latency',
      label: 'Minutes to fall asleep',
      type: 'integer',
      default: 15,
      min: 0,
      max: 180,
      step: 1,
      help: 'Most people need about 15. Zero means the list assumes you sleep at once.',
    },
    {
      id: 'cycle',
      label: 'Cycle length (minutes)',
      type: 'integer',
      default: 90,
      min: 60,
      max: 120,
      step: 1,
      help: 'A typical adult cycle is about 90 minutes.',
    },
  ],

  calculate(input) {
    const direction = String(input.direction ?? 'wake') === 'sleep' ? 'sleep' : 'wake';
    const clock = parseClock(String(input.time ?? ''));
    if (clock == null) return validationError('Enter a clock time like 7:00 am, 07:00, or 19:00.');
    const latency = whole(input, 'latency', 'Minutes to fall asleep', 0, 180);
    if (typeof latency === 'string') return validationError(latency);
    const cycle = whole(input, 'cycle', 'Cycle length', 60, 120);
    if (typeof cycle === 'string') return validationError(cycle);

    const times = CYCLES.map((n) => ({ n, at: momentFor(direction, clock, latency, cycle, n) }));
    const recommended = times.find((t) => t.n === 5)!;
    const waking = direction === 'wake';

    const hero = card('recommended', waking ? 'Go to bed' : 'Wake up', formatClock(recommended.at), {
      raw: recommended.at,
      emphasis: 'hero',
      note: latency === 0
        ? '5 cycles. This list assumes you fall asleep the moment you lie down.'
        : `5 cycles, after ${latency} minutes to fall asleep.`,
    });

    const metrics: ResultCard[] = times.map((t) => card(
      `cycle-${t.n}`,
      `${t.n} cycles`,
      formatClock(t.at),
      { raw: t.at, note: `${t.n} × ${cycle} min asleep` },
    ));

    const insights = [
      insight(
        waking
          ? `Wake at ${formatClock(clock)}. Each bedtime is ${latency} minutes to fall asleep, then 3 to 6 cycles of ${cycle} minutes.`
          : `Into bed at ${formatClock(clock)}. Each wake time is ${latency} minutes to fall asleep, then 3 to 6 cycles of ${cycle} minutes.`,
      ),
    ];
    if (latency === 0) {
      insights.push(insight(
        'These times assume instant sleep. Add the minutes it usually takes to fall asleep, or the alarm lands in the middle of a cycle.',
        'caution',
      ));
    }

    return successResult({
      hero,
      metrics,
      insights,
      assumptions: [
        assumption('Cycle length', `${cycle} minutes`),
        assumption('Time to fall asleep', latency === 0 ? 'none (instant sleep)' : `${latency} minutes`),
      ],
      decisions: decisions([toolDecision('Count the days between two dates', 'date-difference-calculator')]),
      explanation:
        `A cycle here is ${cycle} minutes of sleep, and the ${latency} minutes before sleep starts are not part of a cycle. `
        + `The four times are 6, 5, 4, and 3 whole cycles. Waking at the end of a cycle is the aim, not a medical prescription.`,
    });
  },
};
