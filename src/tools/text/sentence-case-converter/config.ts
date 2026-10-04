import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sentence-case-converter',
  name: 'Sentence Case Converter',
  seoTitle: 'Sentence Case Converter — Capitalize First Letter Online',
  description: 'Convert text to sentence case, capitalizing the first letter of each sentence.',
  tagline: 'Capitalize the first letter of each sentence.',
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
    title: 'How to Change Text to Sentence Case',
    description: 'Sentence case with Word\'s Change Case menu, a Google Docs workaround, and code, plus the proper noun and abbreviation rules converters get wrong.',
    readMinutes: 5,
    updatedAt: '2026-10-05',
  },};
