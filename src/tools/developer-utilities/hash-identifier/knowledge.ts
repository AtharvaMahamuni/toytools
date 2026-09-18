import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'hash-identifier',
  title: 'Hash Identifier',
  category: 'developer-utilities',
  summary:
    'Identify MD5, SHA-1, SHA-256, SHA-512, or CRC32 from digest length, then verify it on your device.',
  primaryConcepts: ['hash identifier'],
  secondaryConcepts: ['digest length', 'checksum verifier', 'sha256sum', 'SHA-1 versus SHA-256'],
  intentGroups: {
    informational: [
      'what a hash identifier does',
      'which algorithms a digest length can name',
      'what truncated or unknown means',
    ],
    howTo: [
      'identify a hash from its length',
      'verify a checksum against a local file',
      'strip a sha256sum filename before comparing',
    ],
    comparison: [
      'hash identifier vs hash generator',
      'SHA-1 length vs SHA-256',
      'CRC32 vs SHA-256',
    ],
    misconception: [
      'a SHA-1 digest is a broken SHA-256',
      'uppercase hex is a mismatch',
      'a filename stuck to the digest is part of the hash',
    ],
    troubleshooting: [
      'digest length matches none of the five',
      'pasted text does not match a file checksum',
      'sha256sum line fails to parse',
    ],
  },
  realWorldUseCases: [
    'Checking a download checksum printed next to a file',
    'Reading a sha256sum line copied from a terminal',
    'Telling an MD5 digest from a SHA-256 digest by length',
    'Confirming a pasted string matches a digest you were given',
  ],
  commonMistakes: [
    'Treating a SHA-1 digest as SHA-256 because both look like hex',
    'Pasting a sha256sum line with the filename still attached',
    'Calling a case difference a mismatch',
    'Hashing pasted text when the checksum was of a file',
  ],
  commonQuestions: [
    'Does the paste stay on my device?',
    'Why is a SHA-1 length not SHA-256?',
    'What happens if the digest is truncated?',
    'Does a case difference count as a mismatch?',
  ],
  usedWith: [
    { slug: 'sha256-hash-generator', reason: 'Create a SHA-256 digest when you do not have one yet' },
    { slug: 'md5-hash-generator', reason: 'Create an MD5 digest for a checksum that asked for MD5' },
  ],
  alternatives: [
    { slug: 'sha1-hash-generator', reason: 'Choose this when the job is to produce a SHA-1 digest, not to name one' },
    { slug: 'crc32-hash-generator', reason: 'Choose this when you need a new CRC32 rather than a reading of an existing one' },
  ],
  nextSteps: [
    { slug: 'sha512-hash-generator', reason: 'Hash the same text as SHA-512 after the length shows the digest was not SHA-512' },
  ],
  workflowStage: ['validate'],
  keywords: ['hash identifier', 'identify hash', 'checksum verifier', 'digest length'],
  entityAliases: ['digest identifier'],
  inputs: ['text', 'file'],
  outputs: ['hash reading'],
  difficulty: 'beginner',
  audience: ['developers'],
};
