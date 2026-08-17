import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'age-calculator',
  name: 'Age Calculator',
  seoTitle: 'Age Calculator — Exact Age in Years, Months, Days',
  description: 'How old am I? Calculate your age from a birthdate in years, months and days from that date of birth, plus a countdown to your next birthday.',
  tagline: 'Your exact age in years, months and days, plus a birthday countdown.',
  categorySlug: 'date-time',
  tags: ['age calculator', 'calculate age from date of birth', 'how old am i', 'exact age', 'age in months', 'age in days', 'days until birthday', 'chronological age'],
  updatedAt: '2026-07-08',
  isNew: true,
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-calculate',
  family: 'age',
  processorId: 'age',
  guide: {
    slug: 'age-calculator',
    categorySlug: 'datetime',
    title: 'How to Calculate Your Exact Age',
    description: 'Learn how age is measured in years, months, and days, why leap years and month lengths matter, and how to work out totals and your next birthday.',
    readMinutes: 4,
    updatedAt: '2026-07-08',
  },
};
