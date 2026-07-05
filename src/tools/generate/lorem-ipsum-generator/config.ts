import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'lorem-ipsum-generator',
  name: 'Lorem Ipsum Generator',
  seoTitle: 'Lorem Ipsum Generator — Placeholder Text',
  description:
    'Generate lorem ipsum placeholder text in your browser. Choose paragraphs, sentences, or words, set the count, and copy plain text. Nothing is uploaded.',
  categorySlug: 'generate',
  tags: [
    'lorem ipsum generator',
    'placeholder text',
    'dummy text',
    'filler text',
    'lorem ipsum',
    'sample text',
  ],
  isNew: true,
  updatedAt: '2026-07-05',
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-placeholder',
  family: 'placeholder',
  processorId: 'lorem-ipsum',
  relatedTools: ['password-generator', 'uuid-generator'],
  keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'filler', 'text'],
  inputs: ['options'],
  outputs: ['text'],
  guide: {
    slug: 'lorem-ipsum-generator',
    categorySlug: 'generate',
    title: 'What Is Lorem Ipsum and How to Use It',
    description:
      'What lorem ipsum is, why designers use placeholder text, and how to generate paragraphs, sentences, or words in the browser.',
    readMinutes: 8,
    updatedAt: 'Jul 2026',
  },
};
