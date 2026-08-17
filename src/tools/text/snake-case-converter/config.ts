import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'snake-case-converter',
  name: 'snake_case Converter',
  seoTitle: 'snake_case Converter — Convert Text To snake_case Online',
  description: 'Convert text to snake_case, the underscore case used for Python variables and database columns.',
  tagline: 'Convert text to snake_case for variables and columns.',
  categorySlug: 'text-utilities',
  tags: ['snake case', 'snake case converter', 'convert to snake_case', 'snake_case', 'python naming', 'database column name', 'underscore case'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  processorId: 'snakeCase',
  toolGroup: 'case-converters',
  guide: {
    slug: 'how-to-convert-text-to-snake-case',
    categorySlug: 'text',
    title: 'How To Convert Text To snake_case',
    description: 'Learn what snake_case is, why Python and SQL favor it, and how to convert any phrase into a snake_case identifier.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
