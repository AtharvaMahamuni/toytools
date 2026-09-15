import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'character-counter',
  name: 'Character Counter',
  seoTitle: 'Character Counter Online',
  description: 'Count characters with and without spaces against common platform limits. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Count characters, with and without spaces.',
  categorySlug: 'text-utilities',
  tags: ['character counter', 'count characters', 'character count', 'characters with spaces', 'characters without spaces', 'text length', 'string length', 'twitter character counter', 'character limit checker'],
  isNew: true,
  updatedAt: '2026-07-10',
  engine: 'text-analysis',
  craft: {
    id: 'cc-breakdown',
    kind: 'orientation',
    solves: 'A character limit counts things people do not think of as characters, so a count that fits the box can still fail the field it was written for.',
  },
  guide: {
    slug: 'character-counter',
    categorySlug: 'text-utilities',
    title: 'How to Count Characters in Text',
    description: 'Learn characters with vs without spaces, and why platform limits differ. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-06-07',
  },  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'characters',
    label: 'Characters',
    formatter: 'integer',
  },
  relatedTools: ['word-counter', 'letter-counter', 'remove-extra-spaces'],
};
