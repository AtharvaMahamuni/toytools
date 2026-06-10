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
  guide: {
    slug: 'paragraph-counter',
    categorySlug: 'text-utilities',
    title: 'Paragraph Counter: How Paragraph Detection Works',
    description: 'Learn how paragraph counting works, paragraph length norms for web and academic writing, and when to use paragraph count vs sentence count or word count.',
    readMinutes: 4,
    updatedAt: '2026-06-07',
  },  pattern: 'text-metric',
  family: 'text-counting',
  primaryMetric: {
    metric: 'paragraphs',
    label: 'Paragraphs',
    formatter: 'integer',
  },
};
