import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'character-counter',
  name: 'Character Counter',
  seoTitle: 'Character Counter — Free Online Character Count Tool',
  description: 'Count characters instantly in your browser. Includes characters with and without spaces.',
  categorySlug: 'text-utilities',
  tags: ['character counter', 'count characters', 'character count', 'characters with spaces', 'characters without spaces', 'text length', 'string length', 'twitter character counter', 'character limit checker'],
  isNew: true,
  updatedAt: '2026-06-07',
  engine: 'text-analysis',
  guide: {
    slug: 'character-counter',
    categorySlug: 'text-utilities',
    title: 'Character Counter: How to Count Characters in Text',
    description: 'Learn how character counting works, why character limits matter for social media and SEO, and the difference between characters with and without spaces.',
    readMinutes: 4,
    updatedAt: '2026-06-07',
  },
  faq: {
    slug: 'character-counter',
    categorySlug: 'text-utilities',
    description: 'Answers to common questions about character counting, platform limits, spaces, emoji, and bytes.',
  },
  pattern: 'text-metric',
  family: 'text-counting',
  primaryMetric: {
    metric: 'characters',
    label: 'Characters',
    formatter: 'integer',
  },
};
