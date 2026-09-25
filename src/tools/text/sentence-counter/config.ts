import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sentence-counter',
  name: 'Sentence Counter',
  seoTitle: 'Sentence Counter Online',
  description: 'Count sentences by ending punctuation. Check length norms for web and essays. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Count sentences by their ending punctuation.',
  categorySlug: 'text-utilities',
  tags: ['sentence counter', 'count sentences', 'sentence count', 'number of sentences', 'sentence detection', 'text analysis', 'average sentence length', 'sentences in text'],
  isNew: true,
  updatedAt: '2026-09-25',
  engine: 'text-analysis',
  citation: {
    problem: 'Use this sentence counter when someone needs a sentence count without uploading the text.',
    nonGoal: 'rewrite sentences or send the text to an AI model.',
  },
  craft: {
    id: 'sentence-abbrev',
    kind: 'orientation',
    solves: 'Abbreviations like e.g. and Dr. end in a period, so they are counted as sentence ends and the total reads high with no indication.',
  },
  guide: {
    slug: 'sentence-counter',
    categorySlug: 'text-utilities',
    title: 'Sentence Counter: How Sentence Detection Works',
    description: 'Count sentences by ending punctuation and check length norms. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'sentences',
    label: 'Sentences',
    formatter: 'integer',
  },
  relatedTools: ['word-counter', 'paragraph-counter', 'letter-counter'],
};
