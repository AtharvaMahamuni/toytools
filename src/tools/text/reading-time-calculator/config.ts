import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'reading-time-calculator',
  name: 'Reading Time Calculator',
  seoTitle: 'Reading Time Calculator — Estimate Read Time Instantly',
  description: 'Calculate how many minutes to read or speak any text, instantly in your browser.',
  categorySlug: 'text-utilities',
  tags: ['reading time calculator', 'read time estimator', 'how long to read', 'reading time', 'speaking time', 'presentation timer', 'blog post reading time', 'article reading time', 'minutes to read'],
  isNew: true,
  updatedAt: '2026-07-10',
  engine: 'text-analysis',
  guide: {
    slug: 'reading-time-calculator',
    categorySlug: 'text-utilities',
    title: 'Reading Time Calculator: How Read Time Is Estimated',
    description: 'Learn how reading time is calculated, what research says about average reading speed, and when to use reading time vs word count or character count.',
    readMinutes: 4,
    updatedAt: '2026-06-07',
  },  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'readingTime',
    label: 'Reading Time',
    formatter: 'duration',
  },
};
