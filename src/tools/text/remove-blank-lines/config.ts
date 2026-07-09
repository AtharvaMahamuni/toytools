import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-blank-lines',
  name: 'Remove Blank Lines',
  seoTitle: 'Remove Blank Lines — Delete Empty Lines Online',
  description: 'Delete empty and whitespace-only lines from text instantly in your browser — no uploads required.',
  categorySlug: 'text-utilities',
  tags: ['remove blank lines', 'remove empty lines', 'delete blank lines', 'remove line breaks', 'strip empty lines', 'compact text', 'remove extra lines'],
  updatedAt: '2026-07-10',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeBlankLines',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-remove-blank-lines',
    categorySlug: 'text',
    title: 'How To Remove Blank Lines From Text',
    description: 'Learn where empty lines come from, when they get in the way, and how to strip them out without losing your real content.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },};
