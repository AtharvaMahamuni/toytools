import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'word-counter',
  name: 'Word Counter',
  seoTitle: 'Word Counter — Free Online Word Count Tool',
  description: 'Count words, characters, sentences, and paragraphs in any text.',
  categorySlug: 'text-utilities',
  tags: ['text', 'count', 'words', 'characters', 'count words online', 'word count checker', 'character counter', 'words in text', 'online word counter free', 'word count tool', 'word counter online', 'reading time calculator'],
  isNew: true,
  updatedAt: '2026-06-02',
  engine: 'text-analysis',
  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'words',
    label: 'Words',
    formatter: 'integer',
  },
  relatedTools: ['character-counter', 'reading-time-calculator', 'sentence-counter'],
  guide: {
    slug: 'how-to-count-words-in-your-writing',
    categorySlug: 'text',
    title: 'How To Count Words In Your Writing',
    description: 'Learn why word count matters, how different tools count words, and how to use word limits effectively for essays, articles, and social media.',
    readMinutes: 4,
    updatedAt: 'Jun 2026',
  },};
