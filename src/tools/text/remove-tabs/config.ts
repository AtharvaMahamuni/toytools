import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-tabs',
  name: 'Remove Tabs',
  seoTitle: 'Remove Tabs — Convert Tabs To Spaces Online',
  description: 'Replace tab characters with spaces instantly in your browser — paste, convert, and copy with no uploads.',
  tagline: 'Replace tab characters with spaces, then copy.',
  categorySlug: 'text-utilities',
  tags: ['remove tabs', 'convert tabs to spaces', 'replace tabs', 'tabs to spaces', 'delete tabs', 'strip tabs', 'detab text'],
  updatedAt: '2026-07-10',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeTabs',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-remove-tabs-from-text',
    categorySlug: 'text',
    title: 'How To Remove Tabs From Text',
    description: 'Learn why tab characters cause alignment and paste problems, and how to replace them with spaces in one step.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },};
