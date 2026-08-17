import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'base64-encoder-decoder',
  name: 'Base64 Encoder & Decoder',
  seoTitle: 'Base64 Encoder & Decoder — Free Online Tool',
  description: 'Encode and decode Base64 strings instantly in your browser. Fast, private, and free.',
  tagline: 'Encode and decode Base64 in your browser.',
  categorySlug: 'developer-utilities',
  tags: ['base64', 'encode', 'decode', 'developer', 'base64 encoder', 'base64 decoder', 'base64 converter', 'online base64', 'base64 to text', 'text to base64', 'decode base64 string', 'base64 converter online', 'base64 encode decode'],
  isNew: true,
  updatedAt: '2026-06-02',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'base64',
  toolGroup: 'encoders',
  relatedTools: ['url-encoder-decoder', 'html-entity-encoder-decoder'],
  craft: {
    id: 'b64-recover',
    kind: 'recovery',
    solves: 'Real Base64 arrives as a data URI, a base64url token or a value with its padding stripped, and all three currently get a correct rejection instead of the decode the user came for.',
  },
  guide: {
    slug: 'what-is-base64',
    categorySlug: 'developer-utilities',
    title: 'What Is Base64?',
    description: 'Understand how Base64 encoding works, why it exists, where it is used, and common mistakes developers make.',
    readMinutes: 6,
    updatedAt: '2026-06-02',
  },};
