import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-formatter',
  name: 'JSON Formatter',
  seoTitle: 'JSON Formatter & Beautifier — Free Online Tool',
  description: 'Pretty-print and beautify JSON with proper indentation instantly in your browser. Fast, private, and free.',
  tagline: 'Pretty-print JSON with proper indentation.',
  categorySlug: 'developer-utilities',
  tags: ['json formatter', 'json beautifier', 'format json', 'pretty print json', 'json pretty', 'json indent', 'beautify json', 'json online', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-formatter',
  toolGroup: 'json-tools',
  relatedTools: ['json-minifier', 'json-validator'],
  guide: {
    slug: 'what-is-json-formatting',
    categorySlug: 'developer-utilities',
    title: 'What Is JSON Formatting?',
    description: 'Understand what JSON pretty-printing does, why formatted and minified JSON are identical in meaning, and when to use each.',
    readMinutes: 4,
    updatedAt: 'Jun 2026',
  },};
