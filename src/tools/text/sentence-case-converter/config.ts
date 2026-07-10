import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sentence-case-converter',
  name: 'Sentence Case Converter',
  seoTitle: 'Sentence Case Converter — Capitalize First Letter Online',
  description: 'Convert text to sentence case — capitalize the first letter of each sentence.',
  categorySlug: 'text-utilities',
  tags: ['sentence case', 'sentence case converter', 'capitalize first letter', 'capitalize sentences', 'fix capitalization', 'sentence case text', 'capitalize first letter of sentence'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  processorId: 'sentenceCase',
  toolGroup: 'case-converters',
  guide: {
    slug: 'how-to-convert-text-to-sentence-case',
    categorySlug: 'text',
    title: 'How To Convert Text To Sentence Case',
    description: 'Learn what sentence case is, why it is the default for body text, and how to fix inconsistent capitalization quickly.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },};
