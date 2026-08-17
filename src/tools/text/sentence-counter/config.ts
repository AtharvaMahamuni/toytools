import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sentence-counter',
  name: 'Sentence Counter',
  seoTitle: 'Sentence Counter — Count Sentences in Text Online',
  description: 'Count sentences in any text instantly. Works by detecting sentence-ending punctuation.',
  tagline: 'Count sentences by their ending punctuation.',
  categorySlug: 'text-utilities',
  tags: ['sentence counter', 'count sentences', 'sentence count', 'number of sentences', 'sentence detection', 'text analysis', 'average sentence length', 'sentences in text'],
  isNew: true,
  updatedAt: '2026-07-10',
  engine: 'text-analysis',
  craft: {
    id: 'sentence-abbrev',
    kind: 'orientation',
    solves: 'Abbreviations like e.g. and Dr. end in a period, so they are counted as sentence ends and the total reads high with no indication.',
  },
  guide: {
    slug: 'sentence-counter',
    categorySlug: 'text-utilities',
    title: 'Sentence Counter: How Sentence Detection Works',
    description: 'Learn how sentence counting works, how abbreviations affect the count, sentence length norms for different writing types, and when to use a sentence counter.',
    readMinutes: 4,
    updatedAt: '2026-06-07',
  },  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'sentences',
    label: 'Sentences',
    formatter: 'integer',
  },
};
