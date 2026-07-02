import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'letter-counter',
  name: 'Letter Counter',
  seoTitle: 'Letter Counter — Count Letters in Text Online',
  description: 'Count only the letters in your text. Excludes digits, spaces, and punctuation. Runs instantly in your browser.',
  categorySlug: 'text-utilities',
  tags: ['letter counter', 'count letters', 'letter count', 'alphabetic characters', 'letters only', 'count alphabetic', 'letter frequency'],
  isNew: true,
  updatedAt: '2026-06-25',
  engine: 'text-analysis',
  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'letters',
    label: 'Letters',
    formatter: 'integer',
  },
  guide: {
    slug: 'letter-counter',
    categorySlug: 'text-utilities',
    title: 'Letter Counter: How to Count Letters in Text',
    description: 'Learn the difference between letters, characters, and symbols, when letter count matters, and how to use a letter counter effectively.',
    readMinutes: 3,
    updatedAt: '2026-06-25',
  },
  relatedTools: ['character-counter', 'word-counter', 'space-counter', 'sentence-counter'],
  keywords: ['alphabet count', 'alpha characters', 'count alphabetic characters'],
  inputs: ['text'],
  outputs: ['metric'],
};
