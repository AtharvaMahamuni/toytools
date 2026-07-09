import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'csv-cleaner',
  name: 'CSV Cleaner',
  seoTitle: 'CSV Cleaner — Remove Empty Rows and Fix Messy CSV Online',
  description: 'Clean a messy CSV in one pass: remove empty rows, trim stray whitespace, fix trailing commas, and square up ragged rows.',
  categorySlug: 'developer-utilities',
  tags: ['csv cleaner', 'clean csv online', 'remove empty rows csv', 'fix messy csv', 'csv whitespace trimmer', 'csv formatter', 'normalize csv', 'csv import errors'],
  updatedAt: '2026-07-09',
  isNew: true,
  trustVariant: 'private',
  engine: 'csv',
  pattern: 'csv-transform',
  family: 'clean',
  processorId: 'csv-clean',
  toolGroup: 'csv-tools',
  relatedTools: ['csv-diff', 'csv-to-json-converter', 'remove-blank-lines'],
  guide: {
    slug: 'how-to-clean-a-messy-csv-file',
    categorySlug: 'developer-utilities',
    title: 'How to Clean a Messy CSV File',
    description: 'Remove empty rows, trim stray whitespace, drop trailing-comma columns, and square ragged rows so a rejected CSV imports cleanly.',
    readMinutes: 4,
    updatedAt: 'Jul 2026',
  },
};
