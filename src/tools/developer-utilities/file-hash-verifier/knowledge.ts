import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'file-hash-verifier',
  title: 'File Hash Verifier',
  category: 'developer-utilities',
  summary:
    'Hash a local file in the browser and compare the digest with the checksum published for that download.',
  primaryConcepts: ['file checksums'],
  secondaryConcepts: ['SHA-256', 'MD5', 'download verification', 'CRC32'],
  intentGroups: {
    informational: [
      'what a sha256 file checksum is',
      'why an empty file still has a digest',
      'how a sha256sum line is shaped',
    ],
    howTo: [
      'hash a file in the browser',
      'verify a download checksum',
      'switch a large file from MD5 to sliced SHA-256',
    ],
    comparison: [
      'MD5 versus SHA-256 for a download',
      'CRC32 versus a cryptographic hash',
    ],
    misconception: [
      'a hash of zero bytes means the ISO is fine',
      'a length mismatch means the mirror is corrupt',
    ],
    troubleshooting: [
      'why a pasted sha256sum line does not match',
      'why MD5 stops on a file over 32 MB',
    ],
  },
  realWorldUseCases: [
    'Checking an ISO against the SHA-256 line on the download page before you write it to a USB stick.',
    'Confirming a zip from a mirror when the publisher printed MD5 and you need that length, not a guess.',
    'Seeing that a 0-byte file is an empty download before you compare it with a real release digest.',
  ],
  commonMistakes: [
    'Pasting a sha256sum line and treating the filename as part of the digest.',
    'Trusting the digest of a 0-byte file as if the download had finished.',
    'Leaving the menu on MD5 when the publisher printed a 64-character SHA-256.',
  ],
  commonQuestions: [
    'How do I hash a file in the browser?',
    'What is a SHA256 file checksum?',
    'How do I verify a download checksum?',
    'Why does an empty file still have a hash?',
  ],
  usedWith: [
    { slug: 'hash-identifier', reason: 'Name the algorithm from the length of a pasted digest', strength: 0.8 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'sha256-hash-generator', reason: 'Hash a sentence of text instead of a file', strength: 0.6 },
  ],
  workflowStage: ['validate'],
  keywords: [
    'file hash checker',
    'sha256 file checksum',
    'verify download checksum',
    'md5 checksum of a file',
    'iso checksum',
  ],
  entityAliases: ['file checksum', 'SHA256 checksum'],
  inputs: ['file'],
  outputs: ['text'],
  difficulty: 'beginner',
  audience: ['developers', 'anyone checking a download'],
};
