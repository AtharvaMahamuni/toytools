import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'csv-to-tsv',
  name: 'CSV to TSV Converter',
  seoTitle: 'CSV to TSV Converter — Quote-Safe, In Your Browser',
  description: 'Convert comma-separated values to tab-separated values with quoting handled correctly, entirely in your browser.',
  tagline: 'Convert comma-separated values to tab-separated, quoting handled.',
  categorySlug: 'developer-utilities',
  tags: ['csv to tsv', 'csv to tsv converter', 'convert csv to tab separated', 'csv tsv online', 'tab delimited converter', 'change csv delimiter', 'csv to tab file'],
  updatedAt: '2026-07-09',
  isNew: true,
  trustVariant: 'private',
  engine: 'csv',
  pattern: 'csv-transform',
  family: 'convert',
  processorId: 'csv-to-tsv',
  toolGroup: 'csv-tools',
  relatedTools: ['csv-to-json-converter', 'csv-cleaner', 'json-to-csv-converter'],
  guide: {
    slug: 'how-to-convert-csv-to-tsv',
    categorySlug: 'developer-utilities',
    title: 'How to Convert CSV to TSV',
    description: 'Change a comma-separated file to tab-separated values without corrupting quoted cells, why find-and-replace fails, and when TSV beats CSV.',
    readMinutes: 4,
    updatedAt: '2026-07-09',
  },
};
