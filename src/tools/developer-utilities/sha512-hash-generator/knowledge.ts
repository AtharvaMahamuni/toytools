import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sha512-hash-generator',
  title: 'SHA-512 Hash Generator',
  category: 'developer-utilities',
  summary: 'Generate a SHA-512 cryptographic hash from any text string, producing a 128-character hex digest in the browser.',
  primaryConcepts: ['SHA-512 hash', 'cryptographic hashing'],
  secondaryConcepts: ['checksum', 'data integrity', 'hex digest', 'SHA-2 family'],
  intentGroups: {
    informational: ['What is SHA-512?', 'How does SHA-512 work?', 'Is SHA-512 more secure than SHA-256?'],
    howTo: ['How to generate a SHA-512 hash', 'How to verify file integrity with SHA-512', 'How to hash a password with SHA-512'],
    comparison: ['SHA-512 vs SHA-256', 'SHA-512 vs MD5 security', 'SHA-2 vs SHA-3'],
    misconception: ['SHA-512 is not encryption — it cannot be reversed', 'A longer hash does not mean slower — SHA-512 can be faster than SHA-256 on 64-bit CPUs'],
    troubleshooting: ['SHA-512 hash is 128 characters, not 64', 'Same input always gives the same output'],
  },
  realWorldUseCases: [
    'Generating file checksums for download verification',
    'Hashing API secrets and tokens before storage',
    'Creating HMAC-SHA512 signatures for webhook validation',
    'Verifying data integrity in distributed systems',
    'Password hashing foundations (before adding salt/KDF)',
  ],
  commonMistakes: [
    'Using SHA-512 alone (without a salt or KDF) for password storage',
    'Expecting SHA-512 to be reversible — it is a one-way function',
    'Confusing the hash length (512 bits = 128 hex chars) with SHA-256 (256 bits = 64 hex chars)',
  ],
  commonQuestions: [
    'How many characters is a SHA-512 hash?',
    'Is SHA-512 better than SHA-256?',
    'Can SHA-512 be reversed?',
  ],
  usedWith: [
    { slug: 'sha256-hash-generator', reason: 'Compare output lengths and use cases', strength: 0.8 },
    { slug: 'sha1-hash-generator', reason: 'Older algorithm in the SHA family', strength: 0.5 },
    { slug: 'md5-hash-generator', reason: 'Faster but weaker alternative for non-security checksums', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'sha256-hash-generator', reason: 'Shorter digest, widely supported, often sufficient' },
    { slug: 'md5-hash-generator', reason: 'Faster for non-security checksums where collision resistance is not critical' },
  ],
  nextSteps: [
    { slug: 'sha256-hash-generator', reason: 'Generate a SHA-256 hash for comparison', priority: 1 },
    { slug: 'sha1-hash-generator', reason: 'Generate an older SHA-1 hash', priority: 2 },
  ],
  workflowStage: ['validate', 'analyze'],
  keywords: ['sha512 hash generator', 'sha-512', 'sha512 online', 'generate sha512 hash', 'sha512 checksum', 'sha2 hash'],
  entityAliases: ['SHA-512 generator', 'SHA512 hash tool', 'sha2-512 hash generator'],
};
