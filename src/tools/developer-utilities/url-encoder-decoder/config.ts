import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'url-encoder-decoder',
  name: 'URL Encoder & Decoder',
  seoTitle: 'URL Encoder & Decoder — Free Online Tool',
  description: 'Percent-encode and decode URL components instantly in your browser. Fast, private, and free.',
  tagline: 'Percent-encode and decode URL components.',
  categorySlug: 'developer-utilities',
  tags: ['url encode', 'url decode', 'percent encoding', 'uri encode', 'uri decode', 'url encoder', 'url decoder', 'encode url online', 'decode url online', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'web',
  processorId: 'url',
  toolGroup: 'encoders',
  relatedTools: ['base64-encoder-decoder', 'html-entity-encoder-decoder'],
  craft: {
    id: 'url-recover',
    kind: 'recovery',
    solves: 'A double-encoded value, a form-encoded "+" or one stray "%" from prose each break the decode in a way that reads as the tool being broken rather than the input needing a fix.',
  },
  guide: {
    slug: 'what-is-url-encoding',
    categorySlug: 'developer-utilities',
    title: 'What Is URL Encoding?',
    description: 'Understand how percent-encoding works, why URLs need it, what characters get encoded, and the mistakes that cause silent bugs.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },};
