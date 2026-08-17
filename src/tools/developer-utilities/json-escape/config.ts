import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-escape',
  name: 'JSON Escape / Unescape',
  seoTitle: 'JSON Escape / Unescape — Escape Strings Online',
  description: 'Escape text for use inside a JSON string, or unescape a JSON string literal back to plain text, live in your browser.',
  tagline: 'Escape text for a JSON string, or unescape one back to plain text.',
  categorySlug: 'developer-utilities',
  tags: ['json escape', 'json unescape', 'escape json string', 'json string escaper', 'unescape json online', 'escape quotes for json', 'json escape characters', 'json stringify text'],
  updatedAt: '2026-07-02',
  isNew: true,
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'web',
  processorId: 'json-escape',
  toolGroup: 'encoders',
  relatedTools: ['json-formatter', 'json-validator', 'url-encoder-decoder'],
  guide: {
    slug: 'how-to-escape-a-json-string',
    categorySlug: 'developer-utilities',
    title: 'How To Escape A JSON String',
    description: 'Learn which characters JSON strings cannot contain, how backslash escape sequences work, and how to escape and unescape text safely.',
    readMinutes: 4,
    updatedAt: '2026-07-02',
  },
};
