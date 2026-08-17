import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'date-difference-calculator',
  name: 'Date Difference Calculator',
  seoTitle: 'Date Difference Calculator — Days Between Two Dates',
  description: 'Count the exact time between two dates in years, months, and days, plus totals in days, weeks, and months and the number of weekdays (business days).',
  tagline: 'Exact time between two dates, including weekdays only.',
  categorySlug: 'date-time',
  tags: ['date difference calculator', 'days between two dates', 'how many days between dates', 'business days calculator', 'weeks between dates', 'duration between dates', 'date duration', 'days calculator'],
  updatedAt: '2026-07-10',
  isNew: true,
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-calculate',
  family: 'duration',
  processorId: 'date-difference',
  relatedTools: ['age-calculator'],
  guide: {
    slug: 'date-difference-calculator',
    categorySlug: 'datetime',
    title: 'How to Count the Days Between Two Dates',
    description: 'Learn how the duration between two dates is measured in years, months, and days, how total days and weeks are counted, and how business days differ.',
    readMinutes: 4,
    updatedAt: '2026-07-10',
  },
};
