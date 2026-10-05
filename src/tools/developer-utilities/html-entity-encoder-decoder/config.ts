import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'html-entity-encoder-decoder',
  name: 'HTML Entity Encoder & Decoder',
  seoTitle: 'HTML Entity Encoder & Decoder — Free Online Tool',
  description: 'Escape and unescape HTML entities instantly in your browser. Encode angle brackets and ampersands, or decode an HTML escape back to text.',
  tagline: 'Encode and decode HTML entities in your browser.',
  categorySlug: 'developer-utilities',
  tags: ['html entity', 'html encode', 'html decode', 'html entities', 'escape html', 'unescape html', 'html entity encoder', 'html entity decoder', 'encode html online', 'developer'],
  updatedAt: '2026-10-05',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'web',
  processorId: 'html-entity',
  toolGroup: 'encoders',
  relatedTools: ['base64-encoder-decoder', 'url-encoder-decoder'],
  guide: {
    slug: 'what-is-html-entity-encoding',
    categorySlug: 'developer-utilities',
    title: 'HTML Entities: What to Escape and Why',
    description: 'The five characters to escape in HTML, why the ampersand comes first, when UTF-8 makes entities unnecessary, and how escaping stops XSS in text and attributes.',
    readMinutes: 6,
    updatedAt: '2026-10-05',
  },};
