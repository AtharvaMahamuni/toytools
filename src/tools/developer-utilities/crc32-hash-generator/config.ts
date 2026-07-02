import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'crc32-hash-generator',
  name: 'CRC32 Hash Generator',
  seoTitle: 'CRC32 Hash Generator — Online CRC32 Checksum Calculator',
  description: 'Generate a CRC32 checksum from text instantly in your browser. A fast error-detection hash, not for security.',
  categorySlug: 'developer-utilities',
  tags: ['crc32 hash generator', 'crc32 checksum', 'crc32 calculator', 'crc32 online', 'checksum generator', 'crc-32', 'error detection hash'],
  updatedAt: '2026-06-28',
  engine: 'hashing',
  pattern: 'hash',
  family: 'checksum',
  processorId: 'crc32',
  toolGroup: 'hash-generators',
  guide: {
    slug: 'what-is-a-crc32-checksum',
    categorySlug: 'developer-utilities',
    title: 'What Is A CRC32 Checksum',
    description: 'Learn what CRC32 is, how it detects accidental data corruption, and why it is not a security hash.',
    readMinutes: 4,
    updatedAt: 'Jun 2026',
  },
};
