import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'random-string-generator',
  title: 'Random String Generator',
  category: 'generate',
  summary:
    'Generate random strings, tokens, and keys in the browser: set length and character sets or a custom alphabet, with a live entropy estimate.',
  primaryConcepts: ['random string generation', 'tokens and keys'],
  secondaryConcepts: ['entropy', 'character sets', 'custom alphabet', 'nonces', 'api keys'],
  intentGroups: {
    informational: [
      'what a random string is used for',
      'how string entropy is measured',
      'what a nonce is',
    ],
    howTo: [
      'generate a random string',
      'generate a token or api key',
      'use a custom character set',
    ],
    comparison: ['random string vs uuid', 'random string vs password'],
    misconception: ['any random text is secure', 'longer is always necessary'],
    troubleshooting: ['string contains characters a system rejects', 'string too short to be safe'],
  },
  realWorldUseCases: [
    'Creating an API key or access token',
    'Generating a nonce or one-time value',
    'Producing a random file name or slug',
    'Seeding test data with unique strings',
  ],
  commonMistakes: [
    'Using a short string for a security token',
    'Building tokens from a predictable random source',
    'Including characters a target system cannot handle',
    'Reusing a nonce that must be unique',
  ],
  commonQuestions: [
    'What is a random string used for?',
    'Is it safe for tokens and keys?',
    'Can I use my own character set?',
    'How long should a token be?',
    'Does it work offline?',
  ],
  usedWith: [],
  alternatives: [
    { slug: 'password-generator', reason: 'A human-facing password with an exclude-ambiguous option' },
  ],
  nextSteps: [
    { slug: 'uuid-generator', reason: 'A standard 128-bit identifier in a fixed format' },
  ],
  workflowStage: ['transform'],
  keywords: ['random string generator', 'token generator', 'api key generator', 'nonce generator'],
  entityAliases: ['token generator', 'key generator', 'random text generator'],
  inputs: ['options'],
  outputs: ['random string'],
  difficulty: 'beginner',
  audience: ['developers'],
};
