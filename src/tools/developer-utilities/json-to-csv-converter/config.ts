import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-to-csv-converter',
  name: 'JSON to CSV Converter',
  seoTitle: 'JSON to CSV Converter — Free Online Tool',
  description: 'Convert JSON arrays to CSV for spreadsheets, databases, and data analysis. Handles nested objects, sparse data, and special characters. Free and private.',
  tagline: 'Turn JSON arrays into CSV, nested objects handled.',
  categorySlug: 'developer-utilities',
  tags: ['json to csv', 'convert json to csv', 'json csv converter', 'export json', 'json to spreadsheet', 'developer', 'data conversion'],
  isNew: true,
  updatedAt: '2026-06-14',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-to-csv',
  toolGroup: 'json-csv',
  relatedTools: ['csv-to-json-converter', 'json-formatter', 'json-validator', 'json-minifier'],
  guide: {
    slug: 'json-to-csv-converter',
    categorySlug: 'developer-utilities',
    title: 'JSON to CSV Converter: Complete Guide',
    description: 'Learn how JSON to CSV conversion works, how nested objects are handled, and when to use each format. Includes examples and common mistakes.',
    readMinutes: 5,
    updatedAt: '2026-06-15',
  },
};
