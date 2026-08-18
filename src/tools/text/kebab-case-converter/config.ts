import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'kebab-case-converter',
  name: 'kebab-case Converter',
  seoTitle: 'kebab-case Converter — Convert Text To kebab-case Online',
  description: 'Convert text to kebab-case, also called dash case, for CSS classes, URL slugs, and IDs.',
  tagline: 'Convert text to kebab-case for slugs, classes and IDs.',
  categorySlug: 'text-utilities',
  tags: ['kebab case', 'kebab case converter', 'convert to kebab-case', 'kebab-case', 'url slug', 'css class name', 'hyphen case', 'slugify'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  craft: {
    id: 'kebab-nonascii',
    kind: 'orientation',
    solves: 'It keeps accented letters, which is right for prose and wrong the moment the result is used as a URL, a filename or an ASCII-only identifier. The output looks like a slug and will not work as one.',
  },
  processorId: 'kebabCase',
  toolGroup: 'case-converters',
  guide: {
    slug: 'how-to-convert-text-to-kebab-case',
    categorySlug: 'text',
    title: 'How To Convert Text To kebab-case',
    description: 'Learn what kebab-case is, why it suits URLs and CSS, and how to turn any phrase into a clean hyphenated slug.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
