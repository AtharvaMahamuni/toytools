import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'csv-column-picker',
  name: 'CSV Column Picker',
  seoTitle: 'CSV Column Picker: Extract Columns by Name',
  description:
    'A csv column picker to extract columns from csv. Select columns with the csv column extractor by header name or by position.',
  tagline: 'Keep named columns and drop the rest, even in a semicolon file.',
  categorySlug: 'developer-utilities',
  tags: [
    'csv column picker',
    'extract columns from csv',
    'select csv columns',
    'keep csv columns',
    'semicolon csv',
    'csv column filter',
  ],
  updatedAt: '2026-10-09',
  addedOn: '2026-10-09',
  trustVariant: 'private',
  engine: 'csv',
  pattern: 'csv-transform',
  family: 'select',
  processorId: 'csv-pick',
  toolGroup: 'csv-tools',
  craft: {
    id: 'csv-header-guard',
    kind: 'guardrail',
    solves:
      'A semicolon-delimited file parses as one column, and a pick by position breaks when a column is inserted.',
  },
  citation: {
    problem:
      'Use the csv column picker when an export has extra columns and you only need a few named fields.',
    nonGoal: 'edit cell values or upload the file.',
  },
  job: {
    intent: 'transform',
    userJob:
      'Keep named columns from a CSV and drop the rest, including when the file is semicolon-delimited.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'high',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  relatedTools: ['csv-cleaner', 'csv-to-tsv', 'csv-to-json-converter', 'json-to-csv-converter'],
  guide: {
    slug: 'csv-column-picker',
    categorySlug: 'developer-utilities',
    title: 'How to Pick Columns from a CSV',
    description:
      'Pick CSV columns by name or by position, and handle a semicolon file or a missing header.',
    readMinutes: 5,
    updatedAt: '2026-10-09',
  },
};
