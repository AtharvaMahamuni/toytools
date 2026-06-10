import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'md5-hash-generator',
  title: 'MD5 Hash Generator',
  category: 'developer-tools',
  summary: 'Generate a 32-character MD5 digest. Fast and ubiquitous, but broken for security use.',
  primaryConcepts: ['md5'],
  secondaryConcepts: ['hash', 'checksum', 'digest', 'collision'],
  intentGroups: {
    informational: ['What is MD5?', 'What does an MD5 hash look like?'],
    howTo: ['How to generate an MD5 hash from text'],
    comparison: ['MD5 vs SHA-256', 'MD5 vs SHA-1'],
    misconception: ['MD5 is not encryption', 'MD5 is unsafe for passwords'],
    troubleshooting: ['Why two inputs produce the same MD5 (collision)'],
  },
  realWorldUseCases: [
    'Verifying a download against accidental corruption',
    'Generating cache keys from a URL or arguments',
    'Deduplicating files by content',
    'Distributing rows across database shards',
  ],
  commonMistakes: [
    'Using MD5 to hash passwords',
    'Trusting MD5 for tamper detection',
  ],
  commonQuestions: [
    'Can you reverse an MD5 hash?',
    'Is MD5 safe to use?',
    'What is a hash collision?',
  ],
  usedWith: [],
  alternatives: [
    { slug: 'sha256-hash-generator', reason: 'Use a collision-resistant hash', strength: 0.9 },
    { slug: 'sha1-hash-generator', reason: 'A longer but also-deprecated digest' },
  ],
  nextSteps: [
    { slug: 'sha256-hash-generator', reason: 'Upgrade to a secure hash', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['md5', 'md5 hash', 'md5 generator', 'checksum', 'text to md5'],
  entityAliases: ['message digest 5'],
};
