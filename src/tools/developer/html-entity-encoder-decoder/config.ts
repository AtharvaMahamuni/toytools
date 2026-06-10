import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'html-entity-encoder-decoder',
  name: 'HTML Entity Encoder & Decoder',
  seoTitle: 'HTML Entity Encoder & Decoder — Free Online Tool',
  description: 'Encode and decode HTML entities instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-tools',
  tags: ['html entity', 'html encode', 'html decode', 'html entities', 'escape html', 'unescape html', 'html entity encoder', 'html entity decoder', 'encode html online', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'web',
  processorId: 'html-entity',
  relatedTools: ['base64-encoder-decoder', 'url-encoder-decoder'],
  guide: {
    slug: 'what-is-html-entity-encoding',
    categorySlug: 'developer',
    title: 'What Is HTML Entity Encoding?',
    description: 'Understand what HTML entities are, which characters must be escaped, when entities are still necessary in a UTF-8 world, and how to avoid XSS.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },};
