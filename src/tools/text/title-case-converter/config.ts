import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'title-case-converter',
  name: 'Title Case Converter',
  seoTitle: 'Title Case Converter — Capitalize Each Word Online',
  description: 'Convert text to Title Case — capitalize the first letter of each word.',
  categorySlug: 'text-utilities',
  tags: ['title case', 'title case converter', 'capitalize each word', 'capitalize text', 'headline case', 'title capitalization', 'capitalize first letter of each word'],
  updatedAt: '2026-07-10',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  craft: {
    id: 'tc-minor',
    kind: 'orientation',
    solves: 'It capitalizes every word including the articles, conjunctions and short prepositions that Chicago and AP both leave lowercase, so a headline pasted into a publication needs hand-correcting and nothing here says which words.',
  },
  processorId: 'titleCase',
  toolGroup: 'case-converters',
  relatedTools: ['uppercase-converter', 'lowercase-converter', 'sentence-case-converter'],
  guide: {
    slug: 'how-to-convert-text-to-title-case',
    categorySlug: 'text',
    title: 'How To Convert Text To Title Case',
    description: 'Learn what Title Case is, the rules for which words to capitalize, and when to use it for headings and titles.',
    readMinutes: 4,
    updatedAt: '2026-06-01',
  },};
