import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'camel-case-converter',
  name: 'camelCase Converter',
  seoTitle: 'camelCase Converter — Convert Text To camelCase Online',
  description: 'Convert text to camelCase for variable and function names.',
  categorySlug: 'text-utilities',
  tags: ['camelcase', 'camel case converter', 'convert to camelcase', 'camelCase', 'variable name', 'javascript naming', 'camel case generator'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  craft: {
    id: 'camel-nonascii',
    kind: 'orientation',
    solves: 'It keeps accented letters, which is right for prose and wrong the moment the result is used as a variable name in a language or toolchain that expects ASCII. The output looks like an identifier and will not work as one.',
  },
  processorId: 'camelCase',
  toolGroup: 'case-converters',
  guide: {
    slug: 'how-to-convert-text-to-camel-case',
    categorySlug: 'text',
    title: 'How To Convert Text To camelCase',
    description: 'Learn what camelCase is, where it is used in code, and how to convert any phrase into a camelCase identifier.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },};
