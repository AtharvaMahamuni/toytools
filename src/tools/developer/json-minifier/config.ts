import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-minifier',
  name: 'JSON Minifier',
  seoTitle: 'JSON Minifier — Free Online Tool',
  description: 'Minify and compress JSON by removing whitespace instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-tools',
  tags: ['json minifier', 'minify json', 'compress json', 'json compact', 'json minify online', 'shrink json', 'json compressor', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-minifier',
  relatedTools: ['json-formatter', 'json-validator'],
  guide: {
    slug: 'what-is-json-minification',
    categorySlug: 'developer',
    title: 'What Is JSON Minification?',
    description: 'Understand how JSON minification reduces payload size, when to minify vs format, and how minification stacks with gzip compression.',
    readMinutes: 4,
    updatedAt: 'Jun 2026',
  },};
