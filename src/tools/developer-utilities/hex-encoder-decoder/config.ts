import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'hex-encoder-decoder',
  name: 'Hex Encoder & Decoder',
  seoTitle: 'Hex Encoder & Decoder — Free Online Tool',
  description: 'Encode text to hexadecimal and decode hex back to readable text instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-utilities',
  tags: ['hex encoder', 'hex decoder', 'hexadecimal', 'hex to text', 'text to hex', 'hex converter', 'hex encoding', 'decode hex', 'encode hex', 'developer'],
  isNew: true,
  updatedAt: '2026-06-14',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'hex',
  toolGroup: 'encoders',
  relatedTools: ['base64-encoder-decoder', 'url-encoder-decoder'],
  guide: {
    slug: 'hex-encoder-decoder',
    categorySlug: 'developer-utilities',
    title: 'Hex Encoder & Decoder: Complete Guide',
    description: 'Learn how hex encoding works, when to use it, and how it compares to Base64. Includes examples, common mistakes, and real-world uses.',
    readMinutes: 5,
    updatedAt: '2026-06-15',
  },
};
