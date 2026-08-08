import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sha1-hash-generator',
  name: 'SHA-1 Hash Generator',
  seoTitle: 'SHA-1 Hash Generator — Free Online Tool',
  description: 'Generate a SHA-1 hash from any text instantly in your browser. Fast, private, and free.',
  tagline: 'Generate a SHA-1 hash from any text.',
  categorySlug: 'developer-utilities',
  tags: ['sha1', 'sha-1', 'sha1 hash', 'sha1 generator', 'hash generator', 'checksum', 'sha1 online', 'generate sha1', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'hashing',
  pattern: 'hash',
  family: 'cryptographic',
  processorId: 'sha1',
  toolGroup: 'hash-generators',
  relatedTools: ['md5-hash-generator', 'sha256-hash-generator'],
  guide: {
    slug: 'what-is-sha1',
    categorySlug: 'developer-utilities',
    title: 'What Is SHA-1?',
    description: 'Understand what SHA-1 is, why it was deprecated after the SHAttered collision attack in 2017, and where it still appears today.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },};
