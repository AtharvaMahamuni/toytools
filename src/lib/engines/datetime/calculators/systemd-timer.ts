// Cron to systemd Timer Converter. Translates a crontab line into an OnCalendar expression, emits a
// ready-to-save .timer unit, and checks the translation by evaluating BOTH day rules over the next
// year: cron fires when day-of-month OR day-of-week matches, systemd only when both do.
//
// Times are computed and shown in UTC so the answer does not depend on the viewer's machine. The
// real timer runs in the system timezone of the host, which is stated as an assumption rather than
// guessed at, because it is one of the two ways a correct-looking translation goes wrong.

import type { DateTimeTool } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { insight, milestone, toolDecision, decisions } from '../story';
import { partsInZone, formatReading } from '../zones';
import { parseCron, describeCron, nextRuns } from '../cron';
import { firstDivergence, resolveShorthand, systemdNextRuns, timerUnit, toOnCalendar } from '../systemd';

function formatRun(d: Date): string {
  return `${formatReading(partsInZone('UTC', d))} UTC`;
}

export const systemdTimerConverter: DateTimeTool = {
  id: 'systemd-timer',
  family: 'schedule',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'expression',
      label: 'Crontab line',
      type: 'text',
      default: '',
      help: 'Five fields, or a shorthand like @daily.',
    },
    {
      id: 'unit',
      label: 'Timer name',
      type: 'text',
      default: 'my-job',
      help: 'Used for the Description line in the generated unit.',
    },
  ],

  calculate(input, _opts) {
    const raw = input.expression;
    if (raw === undefined || raw === '' || raw === null) {
      return validationError('Enter a crontab line to translate.');
    }
    const text = String(raw).trim();

    // @reboot is not a calendar event at all, so failing to parse it would send someone hunting for
    // a syntax error instead of telling them the directive they actually need.
    const shorthand = resolveShorthand(text);
    if (shorthand.kind === 'reboot') {
      return validationError(
        '@reboot has no OnCalendar equivalent. Use OnBootSec= in the [Timer] section instead.',
      );
    }

    const toParse = shorthand.kind === 'expanded' ? shorthand.expression : text;
    const parsed = parseCron(toParse);
    if (!parsed.ok) return validationError(parsed.error);

    const f = parsed.fields;
    const { expression: onCalendar, caveats } = toOnCalendar(f);
    const now = new Date();
    const divergence = firstDivergence(f, now);

    const cronUpcoming = nextRuns(f, now, 3);
    const timerUpcoming = systemdNextRuns(f, now, 3);
    const unitText = timerUnit(onCalendar, String(input.unit ?? 'my-job'));

    const hero = card('oncalendar', 'OnCalendar', onCalendar, {
      emphasis: 'hero',
      note: describeCron(f),
    });

    const metrics: ResultCard[] = [
      card('timer-next', 'Timer fires next', timerUpcoming[0] ? formatRun(timerUpcoming[0]) : 'Never', {}),
      card('cron-next', 'cron would fire next', cronUpcoming[0] ? formatRun(cronUpcoming[0]) : 'Never', {
        note: divergence.diverges ? 'The two schedules do not agree' : 'Same instant as the timer',
      }),
      card(
        'day-rule',
        'Day rule',
        f.domStar || f.dowStar ? 'Identical' : 'cron OR, systemd AND',
        { note: f.domStar || f.dowStar ? 'Only one day field is restricted' : 'Both day fields are restricted' },
      ),
      card('shorthand', 'Source', shorthand.kind === 'expanded' ? `${shorthand.from} expanded` : '5-field crontab', {}),
    ];

    const insights = [
      insight(`In plain English: ${describeCron(f).toLowerCase()}.`),
      divergence.diverges
        ? insight(
            `These do not translate exactly. cron fires on ${formatRun(divergence.cronOnly!)} and the timer does not.`,
            'warning',
          )
        : insight(`The timer and the crontab line fire at the same moments for the next ${divergence.horizonDays} days.`),
      ...caveats.map((c) => insight(c, 'info')),
    ];

    return successResult({
      hero,
      metrics,
      insights,
      milestones: [
        milestone('Translates to a calendar event', true),
        milestone('Fires on the same days as cron', !divergence.diverges),
      ],
      decisions: decisions([
        toolDecision('Read the original crontab line in plain English', 'cron-expression-parser'),
        toolDecision('Convert a run time to another timezone', 'timezone-converter'),
      ]),
      nextQuestions: [
        'What is the systemd OnCalendar equivalent of this cron expression?',
        'Will the timer fire on the same days as the crontab line?',
      ],
      explanation: `Save this as a .timer unit beside its .service:\n\n${unitText}`,
      assumptions: [
        'Run times are calculated in UTC; the real timer uses the host system timezone.',
        `Agreement is checked over the next ${divergence.horizonDays} days.`,
      ],
      meta: {
        onCalendar,
        unit: unitText,
        diverges: divergence.diverges,
        divergesAt: divergence.cronOnly?.toISOString() ?? null,
        horizonDays: divergence.horizonDays,
        bothDayFields: !f.domStar && !f.dowStar,
      },
    });
  },
};
