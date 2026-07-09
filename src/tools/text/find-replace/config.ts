import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'find-replace',
  name: 'Find and Replace',
  seoTitle: 'Find and Replace Text Online — Free Tool',
  description: 'Find and replace text instantly in your browser. Supports plain text and regex. Shows match count live. Nothing is uploaded.',
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
    updatedAt: '2026-06-25',
  },
  relatedTools: ['text-compare', 'remove-duplicate-lines', 'remove-extra-spaces', 'normalize-whitespace'],
  keywords: ['regex replace', 'text substitution', 'search replace online'],
  inputs: ['text', 'pattern', 'replacement'],
  outputs: ['text'],
};
