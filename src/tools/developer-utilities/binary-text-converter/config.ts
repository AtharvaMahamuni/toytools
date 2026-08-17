import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'binary-text-converter',
  name: 'Binary Text Converter',
  seoTitle: 'Binary Text Converter — Text to Binary & Binary to Text',
  description: 'Convert text to binary (0s and 1s) and binary back to text. Turn an ASCII string into binary in your browser, with no uploads.',
  tagline: 'Convert text to binary and binary back to text.',
  categorySlug: 'developer-utilities',
  tags: ['binary text converter', 'text to binary', 'binary to text', 'binary translator', 'ascii to binary', 'binary code converter', 'convert binary', '8-bit binary'],
  updatedAt: '2026-07-09',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'binary',
  toolGroup: 'encoders',
  guide: {
    slug: 'how-to-convert-text-to-binary',
    categorySlug: 'developer-utilities',
    title: 'How To Convert Text To Binary',
    description: 'Learn how text becomes binary, why each character is eight bits, and how to convert text to binary and back.',
    readMinutes: 4,
    updatedAt: '2026-06-01',
  },
};
