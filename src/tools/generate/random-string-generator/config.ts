import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'random-string-generator',
  name: 'Random String Generator',
  seoTitle: 'Random String Generator for Tokens',
  description: 'Generate random strings, tokens, and keys with a custom alphabet. What you enter stays on your device.',
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
  craft: {
    id: 'random-string-entropy',
    kind: 'guardrail',
    solves: 'Generating tokens without lowercase, uppercase, and digit variety yields low entropy strings vulnerable to dictionary attacks and collision.',
  },
  guide: {
    slug: 'random-string-generator',
    categorySlug: 'generate',
    title: 'How to Generate a Random String',
    description:
      'What random strings are used for, and how length and alphabet set the entropy. What you enter stays on your device.',
    readMinutes: 8,
    updatedAt: '2026-09-25',
  },
};
