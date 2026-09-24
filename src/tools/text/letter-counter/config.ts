import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'letter-counter',
  name: 'Letter Counter',
  seoTitle: 'Letter Counter Online',
  description: 'Count only letters in text online. Digits, spaces, and punctuation are excluded. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Count only letters, ignoring digits, spaces and punctuation.',
  categorySlug: 'text-utilities',
  tags: ['letter counter', 'count letters', 'letter count', 'alphabetic characters', 'letters only', 'count alphabetic', 'letter frequency'],
  isNew: true,
  updatedAt: '2026-09-25',
  engine: 'text-analysis',
  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'letters',
    label: 'Letters',
    formatter: 'integer',
  },
  craft: {
    id: 'lc-frequency',
    kind: 'orientation',
    solves: 'A letter count answers how many but never which, so checking that a field holds only letters, or which letters dominate, means counting by eye.',
  },
  guide: {
    slug: 'letter-counter',
    categorySlug: 'text-utilities',
    title: 'Letter Counter: How to Count Letters in Text',
    description: 'Learn letters vs characters and when letter count matters. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 3,
    updatedAt: '2026-09-25',
  },
  relatedTools: ['character-counter', 'word-counter', 'space-counter', 'sentence-counter'],
  keywords: ['alphabet count', 'alpha characters', 'count alphabetic characters'],
  inputs: ['text'],
  outputs: ['metric'],
};
