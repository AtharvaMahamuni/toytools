import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-validator',
  name: 'JSON Validator',
  seoTitle: 'JSON Validator — Free Online Tool',
  description: 'Validate and lint JSON syntax and see errors instantly in your browser. Fast, private, and free.',
  tagline: 'Check JSON syntax and see exactly where it breaks.',
  categorySlug: 'developer-utilities',
  tags: ['json validator', 'validate json', 'json syntax check', 'json lint', 'check json', 'json error', 'is my json valid', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'structured-data',
  pattern: 'structured-validate',
  family: 'json',
  processorId: 'json-validator',
  relatedTools: ['json-formatter', 'json-minifier'],
  guide: {
    slug: 'how-to-validate-json',
    categorySlug: 'developer-utilities',
    title: 'How to Validate JSON',
    description: 'Understand JSON syntax rules, the most common errors like trailing commas and single quotes, and the difference between syntax validation and JSON Schema.',
    readMinutes: 5,
    updatedAt: '2026-06-09',
  },};
