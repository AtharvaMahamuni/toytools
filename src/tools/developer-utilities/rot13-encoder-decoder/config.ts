import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'rot13-encoder-decoder',
  name: 'ROT13 Encoder / Decoder',
  seoTitle: 'ROT13 Encoder / Decoder — Decode ROT13 Online',
  description: 'Encode or decode ROT13, the Caesar cipher with a shift of 13. It is its own inverse, so one pass does both directions.',
  tagline: 'ROT13 text. One pass does both directions.',
  categorySlug: 'developer-utilities',
  tags: ['rot13', 'rot13 decoder', 'rot13 encoder', 'rot13 translator', 'rot13 cipher', 'decode rot13 online', 'caesar cipher 13', 'rot13 converter'],
  updatedAt: '2026-07-02',
  isNew: true,
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'rot13',
  toolGroup: 'encoders',
  relatedTools: ['base64-encoder-decoder', 'binary-text-converter', 'reverse-text'],
  guide: {
    slug: 'what-is-rot13',
    categorySlug: 'developer-utilities',
    title: 'What Is ROT13 And How Does It Work',
    description: 'Learn how the ROT13 cipher rotates letters, why it is its own inverse, where it is still used, and why it is not encryption.',
    readMinutes: 4,
    updatedAt: '2026-07-02',
  },
};
