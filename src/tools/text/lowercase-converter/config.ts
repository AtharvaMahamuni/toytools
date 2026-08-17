import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'lowercase-converter',
  name: 'Lowercase Converter',
  seoTitle: 'Lowercase Converter — Convert Text To lowercase Online',
  description: 'Convert all text to lowercase instantly in your browser. Paste, convert and copy, with no uploads.',
  tagline: 'Convert any text to lowercase, then copy it.',
  categorySlug: 'text-utilities',
  tags: ['lowercase', 'lowercase converter', 'convert to lowercase', 'small letters', 'text to lowercase', 'make text lowercase', 'uncapitalize text'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  processorId: 'lowercase',
  toolGroup: 'case-converters',
  relatedTools: ['uppercase-converter', 'title-case-converter', 'sentence-case-converter'],
  guide: {
    slug: 'how-to-convert-text-to-lowercase',
    categorySlug: 'text',
    title: 'How To Convert Text To Lowercase',
    description: 'Learn what lowercase means, where lowercase text is required, and how to convert text to lowercase in one step.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
