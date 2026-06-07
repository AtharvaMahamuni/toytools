import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sentence-counter',
  name: 'Sentence Counter',
  seoTitle: 'Sentence Counter — Count Sentences in Text Online',
  description: 'Count sentences in any text instantly. Works by detecting sentence-ending punctuation.',
  categorySlug: 'text-utilities',
  tags: ['sentence counter', 'count sentences', 'sentence count', 'number of sentences', 'sentence detection', 'text analysis', 'average sentence length', 'sentences in text'],
  isNew: true,
  updatedAt: '2026-06-07',
  engine: 'text-analysis',
  pattern: 'text-metric',
  family: 'text-counting',
  primaryMetric: {
    metric: 'sentences',
    label: 'Sentences',
    formatter: 'integer',
  },
};
