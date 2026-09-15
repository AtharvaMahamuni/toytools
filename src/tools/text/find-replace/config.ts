import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'find-replace',
  name: 'Find and Replace',
  seoTitle: 'Find and Replace Text Online',
  description: 'Find text in a document: search and replace every match, with optional regex. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Search and replace text, with regex and a live match count.',
  categorySlug: 'text-utilities',
  tags: ['find and replace', 'text replace', 'find replace', 'regex replace', 'search and replace', 'text substitution', 'string replace'],
  isNew: true,
  updatedAt: '2026-07-10',
  engine: 'text-interactive',
  pattern: 'text-interactive',
  family: 'find-replace',
  guide: {
    slug: 'find-replace',
    categorySlug: 'text-utilities',
    title: 'Find and Replace: How to Search and Replace Text',
    description: 'Learn how to use find and replace effectively, when to use regex, and how to handle common replacement patterns.',
    readMinutes: 4,
    updatedAt: '2026-07-10',
  },
  relatedTools: ['text-compare', 'remove-extra-spaces', 'normalize-whitespace'],
  keywords: ['regex replace', 'text substitution', 'search replace online'],
  inputs: ['text', 'pattern', 'replacement'],
  outputs: ['text'],
};
