import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-extra-spaces',
  name: 'Remove Extra Spaces',
  seoTitle: 'Remove Extra Spaces — Clean Up Double Spaces Online',
  description: 'Collapse multiple spaces and tabs into single spaces.',
  categorySlug: 'text-utilities',
  tags: ['remove extra spaces', 'remove double spaces', 'delete extra spaces', 'collapse spaces', 'clean up spaces', 'remove multiple spaces', 'fix spacing'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeExtraSpaces',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-remove-extra-spaces',
    categorySlug: 'text',
    title: 'How To Remove Extra Spaces From Text',
    description: 'Learn why double spaces creep into text, when extra spaces cause problems, and how to collapse them in one step.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
