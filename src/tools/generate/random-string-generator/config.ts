import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'random-string-generator',
  name: 'Random String Generator',
  seoTitle: 'Random String Generator for Tokens',
  description: 'Generate random strings, tokens, and keys with a custom alphabet. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Random strings and tokens with a custom alphabet.',
  categorySlug: 'generate',
  tags: [
    'random string generator',
    'token generator',
    'api key generator',
    'nonce generator',
    'random characters',
    'custom alphabet',
  ],
  isNew: true,
  updatedAt: '2026-09-25',
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-credential',
  family: 'credential',
  processorId: 'random-string',
  relatedTools: ['password-generator', 'uuid-generator'],
  keywords: ['random', 'string', 'token', 'key', 'nonce', 'entropy', 'alphabet'],
  inputs: ['options'],
  outputs: ['text'],
  guide: {
    slug: 'random-string-generator',
    categorySlug: 'generate',
    title: 'How to Generate a Random String',
    description:
      'What random strings are used for, and how length and alphabet set the entropy. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 8,
    updatedAt: '2026-09-25',
  },
};
