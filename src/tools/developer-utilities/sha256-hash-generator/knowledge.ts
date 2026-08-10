import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sha256-hash-generator',
  title: 'SHA-256 Hash Generator',
  category: 'developer-utilities',
  summary: 'Generate a 64-character SHA-256 digest. The current baseline secure hash, no known attacks.',
  primaryConcepts: ['SHA-256'],
  secondaryConcepts: ['hash', 'sha-2', 'digest', 'collision resistance'],
  intentGroups: {
    informational: ['What is SHA-256?', 'Why is SHA-256 considered secure?'],
    howTo: ['How to generate a SHA-256 hash from text'],
    comparison: ['SHA-256 vs SHA-512', 'SHA-256 vs MD5 and SHA-1'],
    misconception: ['SHA-256 is not for password storage', 'Hashing is not encryption'],
    troubleshooting: ['Why the same input always gives the same hash'],
  },
  realWorldUseCases: [
    'Verifying TLS/SSL certificate signatures',
    'Signing software packages and manifests',
    'Bitcoin proof-of-work and transaction IDs',
    'Checking file integrity against tampering',
  ],
  commonMistakes: [
    'Using raw SHA-256 for password storage',
    'Confusing hashing with encryption',
  ],
  commonQuestions: [
    'Can SHA-256 be reversed?',
    'Is SHA-256 safe for password hashing?',
    'How does SHA-256 compare to MD5 and SHA-1?',
  ],
  usedWith: [],
  alternatives: [
    { slug: 'md5-hash-generator', reason: 'Faster but broken for security' },
    { slug: 'sha1-hash-generator', reason: 'Deprecated predecessor' },
  ],
  nextSteps: [],
  workflowStage: ['transform', 'validate'],
  keywords: ['sha256', 'sha-256', 'sha256 hash', 'sha256 generator', 'checksum'],
  entityAliases: ['secure hash algorithm 256', 'sha2'],
};
