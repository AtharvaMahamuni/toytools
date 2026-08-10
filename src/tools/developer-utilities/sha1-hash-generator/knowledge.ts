import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sha1-hash-generator',
  title: 'SHA-1 Hash Generator',
  category: 'developer-utilities',
  summary: 'Generate a 40-character SHA-1 digest. Deprecated for security since the 2017 collision.',
  primaryConcepts: ['SHA-1'],
  secondaryConcepts: ['hash', 'checksum', 'digest', 'shattered'],
  intentGroups: {
    informational: ['What is SHA-1?', 'What does a SHA-1 hash look like?'],
    howTo: ['How to generate a SHA-1 hash from text'],
    comparison: ['SHA-1 vs SHA-256', 'SHA-1 vs MD5'],
    misconception: ['SHA-1 is deprecated, not safe for signatures'],
    troubleshooting: ['Why SHA-1 certificates are rejected'],
  },
  realWorldUseCases: [
    'Identifying Git commits, trees, and blobs',
    'Computing HMAC-SHA1 for TOTP two-factor codes',
    'Checking legacy download checksums',
  ],
  commonMistakes: [
    'Using SHA-1 for new digital signatures or certificates',
    'Using SHA-1 to hash passwords',
  ],
  commonQuestions: [
    'Is SHA-1 still safe to use?',
    'What was the SHAttered attack?',
    'What should I use instead of SHA-1?',
  ],
  usedWith: [],
  alternatives: [
    { slug: 'sha256-hash-generator', reason: 'Use a secure, non-deprecated hash', strength: 0.9 },
    { slug: 'md5-hash-generator', reason: 'A shorter, also-broken digest' },
  ],
  nextSteps: [
    { slug: 'sha256-hash-generator', reason: 'Upgrade to a secure hash', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['sha1', 'sha-1', 'sha1 hash', 'sha1 generator', 'checksum'],
  entityAliases: ['secure hash algorithm 1'],
};
