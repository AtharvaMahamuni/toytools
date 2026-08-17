import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'normalize-whitespace',
  name: 'Normalize Whitespace',
  seoTitle: 'Normalize Whitespace — Collapse All Spacing Online',
  description: 'Clean whitespace by collapsing every run of spaces, tabs and newlines into single spaces, then trimming the result.',
  tagline: 'Collapse every run of whitespace into single spaces.',
  categorySlug: 'text-utilities',
  tags: ['normalize whitespace', 'collapse whitespace', 'flatten text', 'remove line breaks', 'single line text', 'clean whitespace', 'remove newlines'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'normalizeWhitespace',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-normalize-whitespace',
    categorySlug: 'text',
    title: 'How To Normalize Whitespace In Text',
    description: 'Learn what normalizing whitespace means, how it flattens messy spacing and line breaks, and when to use it.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
