import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'reading-time-calculator',
  name: 'Reading Time Calculator',
  seoTitle: 'Reading Time Calculator — Estimate Read Time Instantly',
  description: 'Calculate how many minutes to read or speak any text, instantly in your browser.',
  tagline: 'Minutes to read or speak a text. Nothing is uploaded.',
  categorySlug: 'text-utilities',
  tags: ['reading time calculator', 'read time estimator', 'how long to read', 'reading time', 'speaking time', 'presentation timer', 'blog post reading time', 'article reading time', 'minutes to read'],
  isNew: true,
  updatedAt: '2026-10-05',
  engine: 'text-analysis',
  craft: {
    id: 'read-assumption',
    kind: 'orientation',
    solves: 'A reading time is derived from an assumed words-per-minute rate, not measured, so a reader whose own pace differs has no way to see what the figure assumed.',
  },
  guide: {
    slug: 'reading-time-calculator',
    categorySlug: 'text-utilities',
    title: 'How Reading Time Is Calculated',
    description: 'Reading time is word count divided by words per minute. See the 200 WPM average, speaking time for talks, and why calculators differ.',
    readMinutes: 5,
    updatedAt: '2026-10-05',
  },  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'readingTime',
    label: 'Reading Time',
    formatter: 'duration',
  },
};
