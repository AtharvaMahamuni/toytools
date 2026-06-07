import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'normalize-whitespace',
  name: 'Normalize Whitespace',
  seoTitle: 'Normalize Whitespace — Collapse All Spacing Online',
  description: 'Collapse all whitespace into single spaces and trim the result.',
  categorySlug: 'text-utilities',
  tags: ['normalize whitespace', 'collapse whitespace', 'flatten text', 'remove line breaks', 'single line text', 'clean whitespace', 'remove newlines'],
  updatedAt: '2026-06-07',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'normalizeWhitespace',
  guide: {
    slug: 'how-to-normalize-whitespace',
    categorySlug: 'text',
    title: 'How To Normalize Whitespace In Text',
    description: 'Learn what normalizing whitespace means, how it flattens messy spacing and line breaks, and when to use it.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },
  faq: {
    slug: 'normalize-whitespace',
    categorySlug: 'text',
    description: 'Answers to common questions about normalizing whitespace.',
  },
};
