import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'trim-text',
  name: 'Trim Text',
  seoTitle: 'Trim Text — Remove Leading & Trailing Spaces Online',
  description: 'Trim leading and trailing whitespace from every line.',
  categorySlug: 'text-utilities',
  tags: ['trim text', 'trim whitespace', 'remove leading spaces', 'remove trailing spaces', 'strip whitespace', 'trim lines', 'remove spaces from start and end'],
  updatedAt: '2026-06-07',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'trimLines',
  guide: {
    slug: 'how-to-trim-whitespace-from-text',
    categorySlug: 'text',
    title: 'How To Trim Whitespace From Text',
    description: 'Learn what trimming does, why trailing spaces cause bugs, and how to clean the start and end of every line at once.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },
  faq: {
    slug: 'trim-text',
    categorySlug: 'text',
    description: 'Answers to common questions about trimming whitespace from text.',
  },
};
