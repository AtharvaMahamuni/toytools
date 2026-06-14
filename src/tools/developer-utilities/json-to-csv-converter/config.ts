import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-to-csv-converter',
  name: 'JSON to CSV Converter',
  seoTitle: 'JSON to CSV Converter — Free Online Tool',
  description: 'Convert JSON arrays to CSV for spreadsheets, databases, and data analysis. Handles nested objects, sparse data, and special characters. Free and private.',
  categorySlug: 'developer-utilities',
  tags: ['json to csv', 'convert json to csv', 'json csv converter', 'export json', 'json to spreadsheet', 'developer', 'data conversion'],
  isNew: true,
  updatedAt: '2026-06-14',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-to-csv',
  relatedTools: ['json-formatter', 'json-validator', 'json-minifier'],
};
