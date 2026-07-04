import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'csv-diff',
  name: 'CSV Diff',
  seoTitle: 'CSV Diff — Compare Two CSV Files Online, Nothing Uploaded',
  description: 'Compare two CSV files in your browser and see which rows were added, removed, or changed, with per-column detail.',
  categorySlug: 'developer-utilities',
  tags: ['csv diff', 'compare csv files', 'csv compare online', 'diff two csv', 'csv difference checker', 'compare spreadsheets', 'csv comparison tool', 'find changed rows csv'],
  updatedAt: '2026-07-04',
  isNew: true,
  trustVariant: 'private',
  engine: 'csv',
  pattern: 'csv-transform',
  family: 'compare',
  processorId: 'csv-diff',
  toolGroup: 'csv-tools',
  relatedTools: ['text-compare', 'csv-to-json-converter', 'csv-cleaner'],
  guide: {
    slug: 'how-to-compare-two-csv-files',
    categorySlug: 'developer-utilities',
    title: 'How to Compare Two CSV Files',
    description: 'Learn how a row-aware CSV diff works, why line diffs fail on reordered exports, and how to read added, removed, and changed rows.',
    readMinutes: 4,
    updatedAt: 'Jul 2026',
  },
};
