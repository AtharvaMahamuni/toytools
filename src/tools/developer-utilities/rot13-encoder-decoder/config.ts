import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'rot13-encoder-decoder',
  name: 'ROT13 Encoder / Decoder',
  seoTitle: 'ROT13 Encoder Decoder Online',
  description: 'Encode or decode ROT13 (Caesar cipher) text in one pass. It is not encryption. What you enter stays on your device.',
  tagline: 'ROT13 text. One pass does both directions.',
  categorySlug: 'developer-utilities',
  tags: ['rot13', 'rot13 decoder', 'rot13 encoder', 'rot13 translator', 'rot13 cipher', 'decode rot13 online', 'caesar cipher 13', 'rot13 converter'],
  updatedAt: '2026-07-02',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'rot13',
  craft: {
    id: 'rot13-self-inverse',
    kind: 'orientation',
    solves:
      'Users frequently search for a separate ROT13 decoder without realizing ROT13 is symmetric: applying the cipher twice restores the original text.',
  },
  toolGroup: 'encoders',
  relatedTools: ['base64-encoder-decoder', 'reverse-text', 'binary-text-converter'],
  guide: {
    slug: 'what-is-rot13',
    categorySlug: 'developer-utilities',
    title: 'What Is ROT13 and How It Works',
    description: 'ROT13 rotates letters by 13 places and is its own inverse. Not encryption. What you enter stays on your device.',
    readMinutes: 4,
    updatedAt: '2026-07-02',
  },
};
