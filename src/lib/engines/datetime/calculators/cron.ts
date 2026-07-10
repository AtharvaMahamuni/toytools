// Cron Expression Parser. Reads a standard 5-field cron expression, describes it in plain English,
// counts how often it runs, and lists the next scheduled run times. Times are computed and shown in
// UTC so the answer does not depend on the viewer's zone; the guide states this. The next-run list
// reads the device clock (insight/metric text only, never an asserted example value).

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { insight, milestone, toolDecision, decisions } from '../story';
import { partsInZone, formatReading } from '../zones';
import { parseCron, describeCron, nextRuns, runsPerDay } from '../cron';

function formatRun(d: Date): string {
  return `${formatReading(partsInZone('UTC', d))} UTC`;
}

export const cronExpressionParser: DateTimeTool = {
  id: 'cron',
  family: 'schedule',
  capabilities: { loadExample: true },
  fields: [
    { id: 'expression', label: 'Cron expression', type: 'text', default: '',
      help: 'Five fields: minute hour day-of-month month day-of-week.' },
  ],

  calculate(input, _opts) {
    const raw = input.expression;
    if (raw === undefined || raw === '' || raw === null) {
      return validationError('Enter a cron expression to parse.');
    }
    const parsed = parseCron(String(raw));
    if (!parsed.ok) return validationError(parsed.error);

    const f = parsed.fields;
    const description = describeCron(f);
    const perDay = runsPerDay(f);
    const upcoming = nextRuns(f, new Date(), 5);

    const hero = card('schedule', 'Schedule', description, {
      raw: perDay ?? undefined,
      emphasis: 'hero',
      note: perDay !== null ? `${perDay} times per day` : 'Frequency varies by day',
    });

    const metrics: ResultCard[] = [
      card('per-day', 'Runs per day', perDay !== null ? String(perDay) : 'Varies', {
        raw: perDay ?? undefined,
        note: perDay === null ? 'Day-of-week or day-of-month is restricted' : 'On unrestricted days',
      }),
      card('next-run', 'Next run', upcoming[0] ? formatRun(upcoming[0]) : 'None within 4 years', {}),
      card('after-that', 'Then', upcoming[1] ? formatRun(upcoming[1]) : '—', {}),
      card('minutes-hours', 'Minutes / hours', `${f.minute.length} / ${f.hour.length}`, {
        note: 'Distinct values matched',
      }),
    ];

    const insights = [
      insight(`In plain English: ${description.toLowerCase()}.`),
      upcoming.length > 0
        ? insight(`The next run is ${formatRun(upcoming[0])}.`)
        : insight('No run time falls within the next four years.', 'warning'),
      !f.dowStar && !f.domStar
        ? insight('Both day-of-month and day-of-week are set, so a day matches when either does.', 'info')
        : insight('All times are shown in UTC.'),
    ];

    const runList = upcoming.map((d, i) => `${i + 1}. ${formatRun(d)}`);

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone('Runs at least once a day', perDay === null || perDay >= 1),
        milestone('Runs more than hourly', perDay !== null && perDay > 24),
      ],
      decisions: decisions([
        toolDecision('Convert a run time to another timezone', 'timezone-converter'),
        toolDecision('Turn a run time into a Unix timestamp', 'unix-timestamp-converter'),
      ]),
      nextQuestions: [
        'When does this cron job run next?',
        'How many times a day does this schedule fire?',
      ],
      explanation:
        `The expression "${String(raw).trim()}" means: ${description}. `
        + (runList.length ? `The next runs (UTC) are:\n${runList.join('\n')}` : 'No upcoming runs were found within four years.'),
      assumptions: ['Run times are calculated in UTC.'],
      meta: {
        minute: f.minute,
        hour: f.hour,
        dom: f.dom,
        month: f.month,
        dow: f.dow,
        perDay,
        nextRunISO: upcoming[0]?.toISOString() ?? null,
      },
    });
  },
};
