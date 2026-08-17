import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-duplicate-lines',
  name: 'Remove Duplicate Lines',
  seoTitle: 'Remove Duplicate Lines — Deduplicate Text Online',
  description: 'Remove repeated lines from text, keeping the first occurrence, to dedupe a list down to its unique lines.',
  tagline: 'Remove repeated lines, keeping the first of each.',
  categorySlug: 'text-utilities',
  tags: ['remove duplicate lines', 'deduplicate text', 'delete duplicate lines', 'unique lines', 'dedupe list', 'remove repeated lines', 'find duplicate lines'],
  updatedAt: '2026-07-10',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeDuplicateLines',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-remove-duplicate-lines',
    categorySlug: 'text',
    title: 'How To Remove Duplicate Lines From Text',
    description: 'Learn how to deduplicate a list, what "first occurrence wins" means, and when to clean duplicates before importing data.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
