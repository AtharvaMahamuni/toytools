import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'space-counter',
  name: 'Space Counter',
  seoTitle: 'Space Counter — Count Spaces in Text Online',
  description: 'Count the number of space characters in your text. Shows spaces, total characters, characters without spaces, and word count. Runs in your browser.',
  categorySlug: 'text-utilities',
  tags: ['space counter', 'count spaces', 'space count', 'count whitespace', 'spaces in text', 'number of spaces'],
  isNew: true,
  updatedAt: '2026-06-25',
  engine: 'text-analysis',
  pattern: 'text-metric',
  family: 'text-counting',
  primaryMetric: {
    metric: 'spaces',
    label: 'Spaces',
    formatter: 'integer',
  },
  guide: {
    slug: 'space-counter',
    categorySlug: 'text-utilities',
    title: 'Space Counter: How to Count Spaces in Text',
    description: 'Learn what counts as a space, the difference between spaces and all whitespace, and when counting spaces is useful.',
    readMinutes: 3,
    updatedAt: '2026-06-25',
  },
  relatedTools: ['character-counter', 'letter-counter', 'word-counter', 'line-counter'],
  keywords: ['whitespace count', 'blank space counter', 'count blank characters'],
  inputs: ['text'],
  outputs: ['metric'],
};
