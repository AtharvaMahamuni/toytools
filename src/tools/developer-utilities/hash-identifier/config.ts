import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'hash-identifier',
  name: 'Hash Identifier',
  seoTitle: 'Hash Identifier and Verifier',
  description:
    'Identify a hash from digest length, then verify the checksum. Hash identifier for MD5, SHA-1, SHA-256, SHA-512, and CRC32. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Identify a digest and verify the checksum.',
  categorySlug: 'developer-utilities',
  tags: ['hash identifier', 'identify hash', 'checksum verifier', 'digest length'],
  isNew: true,
  updatedAt: '2026-09-18',
  trustVariant: 'local',
  engine: 'hashing',
  pattern: 'hash-identify',
  family: 'identify',
  relatedTools: [
    'sha256-hash-generator',
    'md5-hash-generator',
    'sha1-hash-generator',
    'sha512-hash-generator',
    'crc32-hash-generator',
  ],
  keywords: ['hash identifier', 'identify hash', 'checksum verifier', 'digest length'],
  inputs: ['text'],
  outputs: ['text'],
  craft: {
    id: 'hash-identify-verify',
    kind: 'verification',
    solves:
      'A sha256sum line with a filename stuck on, a SHA-1 digest checked as SHA-256, or a hash that only differs by case all read as a broken file when the bytes were fine.',
  },
  guide: {
    slug: 'hash-identifier',
    categorySlug: 'developer-utilities',
    title: 'How to Identify a Hash and Verify It',
    description:
      'Tell MD5, SHA-1, SHA-256, SHA-512, and CRC32 apart by length, then check a digest against text or a local file.',
    readMinutes: 7,
    updatedAt: '2026-09-18',
  },
};
