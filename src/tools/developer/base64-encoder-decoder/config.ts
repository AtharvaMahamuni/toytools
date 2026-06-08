import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'base64-encoder-decoder',
  name: 'Base64 Encoder & Decoder',
  seoTitle: 'Base64 Encoder & Decoder — Free Online Tool',
  description: 'Encode and decode Base64 strings instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-tools',
  tags: ['base64', 'encode', 'decode', 'developer', 'base64 encoder', 'base64 decoder', 'base64 converter', 'online base64', 'base64 to text', 'text to base64', 'decode base64 string', 'base64 converter online', 'base64 encode decode'],
  isNew: true,
  updatedAt: '2026-06-02',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'base64',
  relatedTools: ['url-encoder-decoder', 'html-entity-encoder-decoder'],
  guide: {
    slug: 'what-is-base64',
    categorySlug: 'developer',
    title: 'What Is Base64?',
    description: 'Understand how Base64 encoding works, why it exists, where it is used, and common mistakes developers make.',
    readMinutes: 6,
    updatedAt: 'Jun 2026',
  },
  faq: {
    slug: 'base64-encoder-decoder',
    categorySlug: 'developer',
    description: 'Answers to common questions about Base64 encoding, decoding, and common use cases.',
  },
};
