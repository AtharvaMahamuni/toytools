import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-to-yaml-converter',
  name: 'JSON to YAML Converter',
  seoTitle: 'JSON to YAML Converter — Free Online Tool',
  description: 'Convert JSON to YAML for Kubernetes, Docker Compose, and CI/CD configs. Smart quoting, literal block scalars, and sort-key options. Private and in-browser.',
  categorySlug: 'developer-utilities',
  tags: ['json to yaml', 'json yaml converter', 'yaml converter', 'convert json to yaml', 'developer', 'data conversion', 'kubernetes', 'devops'],
  isNew: true,
  updatedAt: '2026-07-09',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-to-yaml',
  toolGroup: 'json-yaml',
  relatedTools: ['yaml-to-json-converter', 'json-formatter', 'json-validator', 'json-to-csv-converter'],
  guide: {
    slug: 'json-to-yaml-converter',
    categorySlug: 'developer-utilities',
    title: 'JSON to YAML Converter: Complete Guide',
    description: 'Learn how JSON to YAML conversion works, YAML syntax and indentation, and when to use each format. Covers Kubernetes, Docker Compose, and CI/CD use cases.',
    readMinutes: 5,
    updatedAt: '2026-06-18',
  },
};
