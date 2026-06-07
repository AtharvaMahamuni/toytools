import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'paragraph-counter',
  name: 'Paragraph Counter',
  seoTitle: 'Paragraph Counter — Count Paragraphs in Text Online',
  description: 'Count paragraphs in any text instantly. Paragraphs are separated by blank lines.',
  categorySlug: 'text-utilities',
  tags: ['paragraph counter', 'count paragraphs', 'paragraph count', 'number of paragraphs', 'paragraphs in text', 'text structure', 'essay paragraph counter', 'article structure'],
  isNew: true,
  updatedAt: '2026-06-07',
  engine: 'text-analysis',
  pattern: 'text-metric',
  family: 'text-counting',
  primaryMetric: {
    metric: 'paragraphs',
    label: 'Paragraphs',
    formatter: 'integer',
  },
};
