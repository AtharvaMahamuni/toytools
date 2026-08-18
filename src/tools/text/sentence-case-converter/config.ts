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
  craft: {
    id: 'sc-nosentences',
    kind: 'orientation',
    solves: 'With no full stop, question mark or exclamation in the input only the very first letter changes, so the whole result reads as if the tool simply lowercased the text. That is the confusion this tool is most often caught in.',
  },
  processorId: 'sentenceCase',
  toolGroup: 'case-converters',
  guide: {
    slug: 'how-to-convert-text-to-sentence-case',
    categorySlug: 'text',
    title: 'How To Convert Text To Sentence Case',
    description: 'Learn what sentence case is, why it is the default for body text, and how to fix inconsistent capitalization quickly.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
