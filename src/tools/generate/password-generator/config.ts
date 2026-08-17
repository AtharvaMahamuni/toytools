import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'password-generator',
  name: 'Password Generator',
  seoTitle: 'Password Generator — Strong Random Passwords',
  description:
    'Create strong, random passwords in your browser. Pick the length and character sets, see a live entropy and strength estimate, then copy. Nothing is uploaded.',
  tagline: 'Strong random passwords, with a live strength estimate.',
  categorySlug: 'generate',
  tags: [
    'password generator',
    'random password',
    'strong password',
    'secure password',
    'passphrase',
    'password strength',
    'entropy',
  ],
  isNew: true,
  updatedAt: '2026-07-10',
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-credential',
  family: 'credential',
  processorId: 'password',
  relatedTools: ['random-string-generator', 'uuid-generator', 'qr-code-generator'],
  keywords: ['password', 'generator', 'random', 'secure', 'entropy', 'strength'],
  inputs: ['options'],
  outputs: ['text'],
  craft: {
    id: 'pwd-unambiguous',
    kind: 'guardrail',
    solves: 'A generated password gets typed by hand off a screen or read aloud down a phone, and O against 0 and l against 1 are indistinguishable in most fonts, so the failure lands later as a login that will not work for no visible reason.',
  },
  guide: {
    slug: 'password-generator',
    categorySlug: 'generate',
    title: 'How to Generate a Strong Password',
    description:
      'What makes a password strong, how length and character sets change entropy, and how to use a generator safely.',
    readMinutes: 8,
    updatedAt: '2026-07-10',
  },
};
