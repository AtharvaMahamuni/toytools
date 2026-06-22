import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'csv-to-json-converter',
  name: 'CSV to JSON Converter',
  seoTitle: 'CSV to JSON Converter — Free Online Tool',
  description: 'Convert CSV to a JSON array of objects for APIs, JavaScript, and databases. Smart type detection, custom delimiters, and RFC 4180 quoting. Free and private — all processing happens in your browser.',
  categorySlug: 'developer-utilities',
  tags: ['csv to json', 'csv json converter', 'convert csv to json', 'csv to array', 'import csv', 'developer', 'data conversion'],
  isNew: true,
  updatedAt: '2026-06-18',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'csv-to-json',
  toolGroup: 'json-csv',
  relatedTools: ['json-to-csv-converter', 'json-formatter', 'json-validator', 'json-minifier'],
  guide: {
    slug: 'csv-to-json-converter',
    categorySlug: 'developer-utilities',
    title: 'CSV to JSON Converter: Complete Guide',
    description: 'Learn how CSV to JSON conversion works, how type detection and quoting are handled, and when to use each format. Includes examples and common pitfalls.',
    readMinutes: 5,
    updatedAt: '2026-06-18',
  },
};
