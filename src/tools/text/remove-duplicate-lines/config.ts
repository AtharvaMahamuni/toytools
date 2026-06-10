import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-duplicate-lines',
  name: 'Remove Duplicate Lines',
  seoTitle: 'Remove Duplicate Lines — Deduplicate Text Online',
  description: 'Remove repeated lines from text, keeping the first occurrence.',
  categorySlug: 'text-utilities',
  tags: ['remove duplicate lines', 'deduplicate text', 'delete duplicate lines', 'unique lines', 'dedupe list', 'remove repeated lines', 'find duplicate lines'],
  updatedAt: '2026-06-07',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeDuplicateLines',
  guide: {
    slug: 'how-to-remove-duplicate-lines',
    categorySlug: 'text',
    title: 'How To Remove Duplicate Lines From Text',
    description: 'Learn how to deduplicate a list, what "first occurrence wins" means, and when to clean duplicates before importing data.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },};
