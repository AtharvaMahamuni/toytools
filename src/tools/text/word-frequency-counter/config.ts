import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'word-frequency-counter',
  name: 'Word Frequency Counter',
  seoTitle: 'Word Frequency Counter — Count Word Occurrences',
  description: 'Count words by frequency and find the most common words in your text, with keyword density percentages and a stop-word filter.',
  tagline: 'How many times each word appears, with percentages.',
  categorySlug: 'text-utilities',
  tags: ['word frequency counter', 'word frequency', 'count word occurrences', 'word repetition checker', 'most used words', 'word frequency analysis', 'keyword density', 'word count by word'],
  updatedAt: '2026-07-02',
  isNew: true,
  engine: 'text-analysis',
  pattern: 'text-metric',
  family: 'text-counting',
  toolGroup: 'text-counters',
  relatedTools: ['word-counter', 'character-counter', 'remove-duplicate-lines'],
  guide: {
    slug: 'how-to-analyze-word-frequency',
    categorySlug: 'text',
    title: 'How To Analyze Word Frequency',
    description: 'Learn what word frequency reveals about a text, how counting and stop-word filtering work, and how writers and SEOs use the results.',
    readMinutes: 4,
    updatedAt: '2026-07-02',
  },
};
