// Pregnancy due date. Naegele's count is 280 days from the first day of the last period when the
// cycle is 28 days. Each day the cycle differs from 28 moves only the due date. Weeks pregnant
// and the trimester boundaries stay anchored to the last period, which is the count a longer
// cycle would silently drop if the page only printed one shifted date.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { addDays, compareCivil, daysBetween, type CivilDate } from '../models';
import { formatCivil, plural } from '../format';
import { dateField, optionalDateField } from '../validation';
import { assumption, decisions, insight, milestone, toolDecision } from '../story';

const STANDARD_CYCLE = 28;
const NAEGELE_DAYS = 280;
const SECOND_TRIMESTER_DAY = 14 * 7;
const THIRD_TRIMESTER_DAY = 28 * 7;

function whole(input: Record<string, number | string>, key: string, label: string, min: number, max: number): number | string {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) return `Enter ${label}.`;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n) || !Number.isInteger(n)) return `${label} should be a whole number.`;
  if (n < min || n > max) return `${label} should be between ${min} and ${max}.`;
  return n;
}

function todayCivil(): CivilDate {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

function stamp(c: CivilDate): number {
  return c.y * 10000 + c.m * 100 + c.d;
}

function weeksPhrase(days: number): string {
  const weeks = Math.floor(days / 7);
  const rest = days % 7;
  if (weeks === 0) return plural(rest, 'day');
  if (rest === 0) return plural(weeks, 'week');
  return `${plural(weeks, 'week')}, ${plural(rest, 'day')}`;
}

function trimesterOf(days: number): { n: 1 | 2 | 3; name: string } {
  if (days < SECOND_TRIMESTER_DAY) return { n: 1, name: 'First' };
  if (days < THIRD_TRIMESTER_DAY) return { n: 2, name: 'Second' };
  return { n: 3, name: 'Third' };
}

/** Names the day shift when the cycle is not 28. Absent at 28, so the usual case stays quiet. */
export function cycleShiftNote(cycle: number): string | undefined {
  const shift = cycle - STANDARD_CYCLE;
  if (shift === 0) return undefined;
  const days = Math.abs(shift);
  const dir = shift > 0 ? 'later' : 'earlier';
  return `A ${cycle} day cycle moves this due date ${plural(days, 'day')} ${dir} than a 28 day cycle. The page used ${cycle}.`;
}

export const pregnancyCalculator: DateTimeTool = {
  id: 'pregnancy',
  family: 'due-date',
  capabilities: { loadExample: true },
  fields: [
    { id: 'lmp', label: 'First day of last period', type: 'date', default: '' },
    {
      id: 'cycle',
      label: 'Cycle length (days)',
      type: 'integer',
      default: STANDARD_CYCLE,
      min: 21,
      max: 45,
      step: 1,
      help: 'A 28 day cycle is the usual count. A longer cycle moves the due date later by the same number of days.',
    },
    {
      id: 'asOf',
      label: 'Weeks pregnant on',
      type: 'date',
      default: '',
      optional: true,
      help: 'Leave blank to use today.',
    },
  ],

  calculate(input) {
    const lmp = dateField(input, 'lmp', 'the first day of the last period');
    if (!lmp.ok) return lmp.result;
    const asOf = optionalDateField(input, 'asOf', 'the date to count from');
    if (!asOf.ok) return asOf.result;
    const cycle = whole(input, 'cycle', 'Cycle length', 21, 45);
    if (typeof cycle === 'string') return validationError(cycle);

    const ref = asOf.value ?? todayCivil();
    if (compareCivil(lmp.value, ref) > 0) {
      return validationError('The last period is after the date you are measuring from. Check the dates.');
    }

    const dueDays = NAEGELE_DAYS + (cycle - STANDARD_CYCLE);
    const due = addDays(lmp.value, dueDays);
    const gestDays = daysBetween(lmp.value, ref);
    const left = daysBetween(ref, due);
    const trimester = trimesterOf(gestDays);
    const second = addDays(lmp.value, SECOND_TRIMESTER_DAY);
    const third = addDays(lmp.value, THIRD_TRIMESTER_DAY);
    const conception = addDays(lmp.value, cycle - 14);
    const note = cycleShiftNote(cycle);

    const hero = card('due', 'Due date', formatCivil(due), {
      raw: stamp(due),
      emphasis: 'hero',
      ...(note ? { note } : {}),
    });

    const countdownLabel = left < 0 ? 'Days past due' : left === 0 ? 'Due' : 'Days until due';
    const countdownValue = left === 0 ? 'Today' : plural(Math.abs(left), 'day');

    const metrics: ResultCard[] = [
      card('gestational-age', 'Weeks pregnant', weeksPhrase(gestDays), { raw: gestDays }),
      card('trimester', 'Trimester', trimester.name, {
        raw: trimester.n,
        note: `Second trimester starts ${formatCivil(second)}. Third starts ${formatCivil(third)}.`,
      }),
      card('countdown', countdownLabel, countdownValue, { raw: left }),
      card('conception', 'Estimated conception', formatCivil(conception), {
        raw: stamp(conception),
        note: 'Cycle length minus 14 days after the last period.',
      }),
    ];

    const insights = [
      insight(
        `The due date is ${dueDays} days after ${formatCivil(lmp.value)}. Weeks pregnant still count from that first day.`,
      ),
    ];
    if (note) insights.push(insight(note, 'caution'));

    return successResult({
      hero,
      metrics,
      insights,
      assumptions: [
        assumption('Last period', formatCivil(lmp.value)),
        assumption('Cycle length', `${cycle} days`),
        assumption('Counted on', formatCivil(ref)),
        assumption('Due date rule', `${dueDays} days after the last period`),
      ],
      milestones: [
        milestone(`Second trimester ${formatCivil(second)}`, compareCivil(ref, second) >= 0),
        milestone(`Third trimester ${formatCivil(third)}`, compareCivil(ref, third) >= 0),
        milestone(`Due date ${formatCivil(due)}`, compareCivil(ref, due) >= 0),
      ],
      decisions: decisions([
        toolDecision('Count the days between two dates', 'date-difference-calculator'),
        toolDecision('Work out an exact age from a birth date', 'age-calculator'),
      ]),
      explanation:
        `The due date is ${formatCivil(due)}, ${dueDays} days after ${formatCivil(lmp.value)}. `
        + `On ${formatCivil(ref)} that is ${weeksPhrase(gestDays)} pregnant, in the ${trimester.name.toLowerCase()} trimester. `
        + `The second trimester starts ${formatCivil(second)} and the third starts ${formatCivil(third)}, both counted from the last period. `
        + `This is date arithmetic for planning. It is not a scan and it is not a diagnosis.`,
    });
  },
};
