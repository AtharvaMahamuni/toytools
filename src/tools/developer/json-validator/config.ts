import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-validator',
  name: 'JSON Validator',
  seoTitle: 'JSON Validator — Free Online Tool',
  description: 'Validate JSON syntax and see errors instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-tools',
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
    categorySlug: 'developer',
    title: 'How to Validate JSON',
    description: 'Understand JSON syntax rules, the most common errors like trailing commas and single quotes, and the difference between syntax validation and JSON Schema.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
  faq: {
    slug: 'json-validator',
    categorySlug: 'developer',
    description: 'Answers to common questions about JSON validation, syntax errors, JSONC vs JSON, and JSON Schema.',
  },
};
