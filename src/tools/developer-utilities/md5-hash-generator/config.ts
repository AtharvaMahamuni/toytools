import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'md5-hash-generator',
  name: 'MD5 Hash Generator',
  seoTitle: 'MD5 Hash Generator — Free Online Tool',
  description: 'Generate an MD5 hash or checksum from any text instantly in your browser. Fast, private, and free.',
  tagline: 'Generate an MD5 hash from any text.',
  categorySlug: 'developer-utilities',
  tags: ['md5', 'md5 hash', 'md5 generator', 'hash generator', 'checksum', 'md5 online', 'generate md5', 'text to md5', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'hashing',
  pattern: 'hash',
  family: 'cryptographic',
  processorId: 'md5',
  toolGroup: 'hash-generators',
  relatedTools: ['sha1-hash-generator', 'sha256-hash-generator'],
  guide: {
    slug: 'what-is-md5',
    categorySlug: 'developer-utilities',
    title: 'What Is MD5?',
    description: 'Understand how MD5 hashing works, what a 32-character digest means, why MD5 is broken for security, and what it\'s still safe for.',
    readMinutes: 5,
    updatedAt: '2026-06-09',
  },};
