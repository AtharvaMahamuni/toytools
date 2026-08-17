import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'cron-expression-parser',
  name: 'Cron Expression Parser',
  seoTitle: 'Cron Expression Parser — Explain Cron, Next Run Times',
  description: 'Turn a cron expression into human readable English: crontab explained, how often the schedule runs, and next run times. Lists, ranges and steps.',
  tagline: 'Read a cron expression in plain English, with its next run times.',
  categorySlug: 'date-time',
  tags: ['cron expression parser', 'cron expression explained', 'crontab generator', 'cron schedule', 'cron next run time', 'what does this cron mean', 'cron to english', 'cron parser'],
  updatedAt: '2026-07-10',
  isNew: true,
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-schedule',
  family: 'schedule',
  processorId: 'cron',
  relatedTools: ['timezone-converter', 'unix-timestamp-converter'],
  guide: {
    slug: 'cron-expression-parser',
    categorySlug: 'datetime',
    title: 'How to Read a Cron Expression',
    description: 'Learn what each of the five cron fields means, how stars, ranges, lists, and steps work, and how to read the schedule and next run times of any crontab line.',
    readMinutes: 5,
    updatedAt: '2026-07-10',
  },
};
