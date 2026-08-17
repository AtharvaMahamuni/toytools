import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'systemd-timer-converter',
  name: 'Cron to systemd Timer Converter',
  seoTitle: 'Cron to systemd Timer Converter - crontab to OnCalendar',
  description:
    'Convert a crontab line to a systemd timer OnCalendar expression, get the .timer unit, and check the schedule fires on the same days as cron.',
  tagline: 'Translate a crontab line, then check it fires when cron did.',
  categorySlug: 'date-time',
  tags: [
    'cron to systemd timer',
    'crontab to oncalendar',
    'systemd oncalendar syntax',
    'systemd timer generator',
    'oncalendar expression',
    'convert crontab to systemd',
    'systemd timer unit file',
    'cron vs systemd timer',
  ],
  isNew: true,
  updatedAt: '2026-08-16',
  engine: 'datetime',
  pattern: 'datetime-schedule',
  family: 'schedule',
  processorId: 'systemd-timer',
  relatedTools: ['cron-expression-parser', 'timezone-converter', 'unix-timestamp-converter'],

  // The translation is the easy half and the part people already do. The half nobody can do by
  // reading is whether the result fires on the same days.
  craft: {
    id: 'systemd-divergence',
    kind: 'verification',
    solves:
      'When a crontab line restricts both the day of the month and the day of the week, cron fires when either matches and systemd fires only when both do, so a translated timer loads cleanly and quietly runs on a different set of days.',
  },

  guide: {
    slug: 'systemd-timer-converter',
    categorySlug: 'date-time',
    title: 'Converting crontab Lines to systemd OnCalendar',
    description:
      'How the OnCalendar grammar maps onto cron fields, and the one day rule that changes meaning in translation.',
    readMinutes: 6,
    updatedAt: '2026-08-16',
  },
};
