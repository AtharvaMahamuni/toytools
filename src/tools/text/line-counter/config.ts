import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'line-counter',
  name: 'Line Counter',
  seoTitle: 'Line Counter — Count Lines in Text Online',
  description: 'Count lines in your text instantly. Shows total lines, non-empty lines, paragraphs, and word count. Runs in your browser.',
  categorySlug: 'text-utilities',
  tags: ['line counter', 'count lines', 'line count', 'number of lines', 'count rows', 'newline counter', 'count newlines'],
  isNew: true,
  updatedAt: '2026-07-10',
  engine: 'text-analysis',
  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'lines',
    label: 'Lines',
    formatter: 'integer',
  },
  guide: {
    slug: 'line-counter',
    categorySlug: 'text-utilities',
    title: 'Line Counter: How to Count Lines in Text',
    description: 'Learn what counts as a line, the difference between total lines and non-empty lines, and when line count matters.',
    readMinutes: 3,
    updatedAt: '2026-07-10',
  },
  relatedTools: ['paragraph-counter', 'word-counter', 'character-counter', 'space-counter'],
  keywords: ['row count', 'newline count', 'count line breaks'],
  inputs: ['text'],
  outputs: ['metric'],
};
