import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'hex-encoder-decoder',
  name: 'Hex Encoder and Decoder',
  seoTitle: 'Hex Encoder Decoder Online',
  description: 'Encode text to hex and decode hex back to text in your browser. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Encode text to hex and decode hex back to text.',
  categorySlug: 'developer-utilities',
  tags: ['hex encoder', 'hex decoder', 'hexadecimal', 'hex to text', 'text to hex', 'hex converter', 'hex encoding', 'decode hex', 'encode hex', 'developer'],
  isNew: true,
  updatedAt: '2026-09-25',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'hex',
  toolGroup: 'encoders',
  relatedTools: ['base64-encoder-decoder', 'url-encoder-decoder'],
  guide: {
    slug: 'hex-encoder-decoder',
    categorySlug: 'developer-utilities',
    title: 'Hex Encoder and Decoder: Complete Guide',
    description: 'How hex encoding works, when to use it, and how it compares to Base64. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 5,
    updatedAt: '2026-09-25',
  },
};
