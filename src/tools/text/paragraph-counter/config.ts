import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'paragraph-counter',
  name: 'Paragraph Counter',
  seoTitle: 'Paragraph Counter Online',
  description: 'Count paragraphs split by blank lines for essays and web drafts. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Count paragraphs split by blank lines. On your device.',
  categorySlug: 'text-utilities',
  tags: ['paragraph counter', 'count paragraphs', 'paragraph count', 'number of paragraphs', 'paragraphs in text', 'text structure', 'essay paragraph counter', 'article structure'],
  isNew: true,
  updatedAt: '2026-09-25',
  engine: 'text-analysis',
  craft: {
    id: 'para-breaks',
    kind: 'orientation',
    solves: 'A wall of text separated by single newlines counts as one paragraph, so the number reads wrong and nothing on the page says why.',
  },
  guide: {
    slug: 'paragraph-counter',
    categorySlug: 'text-utilities',
    title: 'Paragraph Counter: How Paragraph Detection Works',
    description: 'Count paragraphs split by blank lines for essays and drafts. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'paragraphs',
    label: 'Paragraphs',
    formatter: 'integer',
  },
  relatedTools: ['sentence-counter', 'word-counter', 'line-counter'],
};
