import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'random-string-generator',
  name: 'Random String Generator',
  seoTitle: 'Random String Generator — Tokens, Keys & Nonces',
  description:
    'Generate random strings, tokens, and keys with a custom alphabet and a live entropy estimate, all in your browser. Nothing is uploaded.',
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
  updatedAt: '2026-07-05',
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
      'What random strings are used for, how length and alphabet set the entropy, and how to generate tokens and keys safely in the browser.',
    readMinutes: 8,
    updatedAt: 'Jul 2026',
  },
};
