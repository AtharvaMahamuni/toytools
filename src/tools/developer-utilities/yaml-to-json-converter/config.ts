import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'yaml-to-json-converter',
  name: 'YAML to JSON Converter',
  seoTitle: 'YAML to JSON Converter — Free Online Tool',
  description: 'Convert YAML to JSON for APIs, JSON Schema validation, and tools without a YAML parser. Handles anchors, multi-line strings, and timestamps. In-browser, free.',
  tagline: 'Turn YAML into JSON, anchors and multi-line strings handled.',
  categorySlug: 'developer-utilities',
  tags: ['yaml to json', 'yaml json converter', 'json converter', 'convert yaml to json', 'developer', 'data conversion', 'kubernetes', 'devops'],
  isNew: true,
  updatedAt: '2026-07-10',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'yaml-to-json',
  toolGroup: 'json-yaml',
  relatedTools: ['json-to-yaml-converter', 'json-formatter', 'json-validator', 'json-to-csv-converter'],
  guide: {
    slug: 'yaml-to-json-converter',
    categorySlug: 'developer-utilities',
    title: 'YAML to JSON Converter: Complete Guide',
    description: 'Learn how YAML to JSON conversion works, how YAML types map to JSON, and when to convert. Covers APIs, JSON Schema validation, and common YAML pitfalls.',
    readMinutes: 5,
    updatedAt: '2026-06-18',
  },
};
