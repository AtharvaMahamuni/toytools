// Ovulation date and fertile window. Ovulation is one cycle length minus the luteal phase
// after the first day of the last period. A 14 day luteal phase is the usual count. A shorter
// phase moves ovulation later by the same number of days, which a page that hides the
// assumption would mark early. The fertile window is the five days before ovulation through
// the ovulation day. The next period follows the cycle length and does not move with the
// luteal phase.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { addDays, compareCivil, daysBetween, type CivilDate } from '../models';
import { formatCivil, plural } from '../format';
import { dateField, optionalDateField } from '../validation';
import { assumption, decisions, insight, milestone, toolDecision } from '../story';

const STANDARD_LUTEAL = 14;
const FERTILE_DAYS_BEFORE = 5;
/** Past this, rolling the cycle forward is guesswork: ask for a recent period instead. */
const MAX_ROLL_DAYS = 366;
/** Said with every result: the page is a calendar, not a contraceptive or a test. */
export const OVULATION_CAVEAT =
  'This is a calendar estimate, not a form of birth control, and it is not reliable for avoiding pregnancy. Ovulation timing varies from cycle to cycle.';

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

/** Names the day shift when the luteal phase is not 14. Absent at 14, so the usual case stays quiet. */
export function lutealShiftNote(luteal: number): string | undefined {
  const shift = STANDARD_LUTEAL - luteal;
  if (shift === 0) return undefined;
  const days = Math.abs(shift);
  const dir = shift > 0 ? 'later' : 'earlier';
  return `A ${luteal} day luteal phase moves ovulation ${plural(days, 'day')} ${dir} than a 14 day luteal phase. The page used ${luteal}.`;
}

export const ovulationCalculator: DateTimeTool = {
  id: 'ovulation',
  family: 'fertile-window',
  capabilities: { loadExample: true },
  fields: [
    { id: 'lmp', label: 'First day of last period', type: 'date', default: '' },
    {
      id: 'cycle',
      label: 'Cycle length (days)',
      type: 'integer',
      default: 28,
      min: 21,
      max: 45,
      step: 1,
      help: 'Days from one period start to the next. This sets the next period date.',
    },
    {
      id: 'luteal',
      label: 'Luteal phase (days)',
      type: 'integer',
      default: STANDARD_LUTEAL,
      min: 10,
      max: 16,
      step: 1,
      help: 'A 14 day luteal phase is the usual count. A shorter phase moves ovulation later by the same number of days.',
    },
    {
      id: 'asOf',
      label: 'Count on',
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
    const luteal = whole(input, 'luteal', 'Luteal phase', 10, 16);
    if (typeof luteal === 'string') return validationError(luteal);

    const ref = asOf.value ?? todayCivil();
    if (compareCivil(lmp.value, ref) > 0) {
      return validationError('The last period is after the date you are measuring from. Check the dates.');
    }

    const sinceLmp = daysBetween(lmp.value, ref);
    if (sinceLmp > MAX_ROLL_DAYS) {
      return validationError('That last period is more than a year before the date you are counting from. Enter the most recent period.');
    }
    // An old last period rolls forward whole cycles to the one the count date falls in, and the
    // result says so. Without this, every date it shows would already be past.
    const rolled = Math.floor(sinceLmp / cycle);
    const start = addDays(lmp.value, rolled * cycle);
    const ovulation = addDays(start, cycle - luteal);
    const windowStart = addDays(ovulation, -FERTILE_DAYS_BEFORE);
    const nextPeriod = addDays(start, cycle);
    const note = lutealShiftNote(luteal);

    let statusLabel = 'This date';
    let statusValue = 'Inside the fertile window';
    let statusRaw = 0;
    if (compareCivil(ref, windowStart) < 0) {
      const days = daysBetween(ref, windowStart);
      statusLabel = 'Before the window';
      statusValue = plural(days, 'day');
      statusRaw = -days;
    } else if (compareCivil(ref, ovulation) > 0) {
      const days = daysBetween(ovulation, ref);
      statusLabel = 'After the window';
      statusValue = plural(days, 'day');
      statusRaw = days;
    }

    const hero = card('ovulation', 'Ovulation date', formatCivil(ovulation), {
      raw: stamp(ovulation),
      emphasis: 'hero',
      ...(note ? { note } : {}),
    });

    // After rolling forward, the count date is always before the next period.
    const nextLabel = 'Next period';

    const metrics: ResultCard[] = [
      card('fertile-window', 'Fertile window', `${formatCivil(windowStart)} to ${formatCivil(ovulation)}`, {
        raw: stamp(windowStart),
        note: 'Five days before ovulation through the day of ovulation.',
      }),
      card('next-period', nextLabel, formatCivil(nextPeriod), {
        raw: stamp(nextPeriod),
        note: rolled > 0
          ? 'One cycle length after the projected period start. The luteal phase does not move it.'
          : 'One cycle length after the last period. The luteal phase does not move it.',
      }),
      card('window-status', statusLabel, statusValue, { raw: statusRaw }),
    ];

    const insights = [
      ...(rolled > 0
        ? [insight(
          `The last period you entered was ${plural(sinceLmp, 'day')} before ${formatCivil(ref)}, so these dates project ${plural(rolled, 'cycle')} forward, to a period starting ${formatCivil(start)}. Enter your latest period for a better estimate.`,
          'caution',
        )]
        : []),
      insight(OVULATION_CAVEAT, 'caution'),
      insight(
        `Ovulation is ${cycle - luteal} days after ${formatCivil(start)}. The fertile window runs from ${formatCivil(windowStart)} to ${formatCivil(ovulation)}. The next period is ${formatCivil(nextPeriod)}. The luteal phase does not move it.`,
      ),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      assumptions: [
        assumption('Last period', formatCivil(lmp.value)),
        ...(rolled > 0 ? [assumption('Projected period start', formatCivil(start))] : []),
        assumption('Cycle length', `${cycle} days`),
        assumption('Luteal phase', `${luteal} days`),
        assumption('Counted on', formatCivil(ref)),
      ],
      milestones: [
        milestone(`Fertile window ${formatCivil(windowStart)}`, compareCivil(ref, windowStart) >= 0),
        milestone(`Ovulation ${formatCivil(ovulation)}`, compareCivil(ref, ovulation) >= 0),
        milestone(`Next period ${formatCivil(nextPeriod)}`, compareCivil(ref, nextPeriod) >= 0),
      ],
      decisions: decisions([
        toolDecision('Project a due date from the same last period', 'pregnancy-due-date-calculator'),
        toolDecision('Count the days between two dates', 'date-difference-calculator'),
      ]),
      explanation:
        `Ovulation is ${formatCivil(ovulation)}, ${cycle - luteal} days after ${formatCivil(start)}, `
        + `because the cycle is ${cycle} days and the luteal phase is ${luteal} days. `
        + `The fertile window is ${formatCivil(windowStart)} to ${formatCivil(ovulation)}. `
        + `The next period is ${formatCivil(nextPeriod)}. `
        + `This is date arithmetic. It is not an ovulation test and it does not predict a pregnancy. `
        + `${OVULATION_CAVEAT} With irregular cycles or PCOS the dates can be off by a week or more.`,
    });
  },
};
