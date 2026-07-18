import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'crc32-hash-generator',
  title: 'CRC32 Hash Generator',
  category: 'developer-utilities',
  summary: 'Compute a CRC32 checksum from text. A fast error-detection code, not a security hash.',
  primaryConcepts: ['crc32 checksum'],
  secondaryConcepts: ['error detection', 'cyclic redundancy check', 'data integrity', 'checksum'],
  intentGroups: {
    informational: ['What is CRC32?', 'What is a cyclic redundancy check?'],
    howTo: ['How to generate a CRC32 checksum', 'How to verify data with CRC32'],
    comparison: ['CRC32 vs MD5', 'Checksum vs cryptographic hash'],
    misconception: ['CRC32 is not secure', 'A matching CRC32 does not prove authenticity'],
    troubleshooting: ['My CRC32 differs from another tool (byte order or polynomial)', 'Same checksum for different data (collision)'],
  },
  realWorldUseCases: [
    'Detecting accidental corruption in a downloaded file',
    'Verifying a data frame survived transmission intact',
    'Quick integrity checks in formats like ZIP and PNG',
    'A cheap fingerprint for cache keys where security does not matter',
  ],
  commonMistakes: [
    'Using CRC32 to protect passwords or guard against tampering',
    'Assuming a 32-bit checksum is collision-free (it is not)',
  ],
  commonQuestions: [
    'What is a cyclic redundancy check?',
    'Should I use CRC32 or MD5?',
    'Does a matching CRC32 mean the file is authentic?',
  ],
  usedWith: [
    { slug: 'md5-hash-generator', reason: 'Compare a fast checksum against a fuller hash', strength: 0.6 },
    { slug: 'sha256-hash-generator', reason: 'Step up to a cryptographic hash when security matters', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'md5-hash-generator', reason: 'A 128-bit hash (still not for security, but wider)' },
    { slug: 'sha256-hash-generator', reason: 'A cryptographic hash for integrity against tampering' },
  ],
  nextSteps: [
    { slug: 'sha256-hash-generator', reason: 'Use SHA-256 when you need tamper resistance', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['crc32', 'crc32 checksum', 'crc-32', 'cyclic redundancy check', 'checksum generator'],
  entityAliases: ['crc32', 'crc-32', 'crc'],
  inputs: ['text'],
  outputs: ['32-bit checksum (hex)'],
  difficulty: 'intermediate',
  audience: ['developers', 'students'],
};
