import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sha512-hash-generator',
  name: 'SHA-512 Hash Generator',
  seoTitle: 'SHA-512 Hash Generator — Free Online Tool',
  description: 'Generate a SHA-512 hash from any text instantly in your browser. Fast, private, and free.',
  tagline: 'Generate a SHA-512 hash from any text.',
  categorySlug: 'developer-utilities',
  tags: ['sha512', 'sha-512', 'sha512 hash', 'sha512 generator', 'hash generator', 'checksum', 'sha512 online', 'generate sha512', 'developer'],
  isNew: true,
  updatedAt: '2026-06-14',
  engine: 'hashing',
  pattern: 'hash',
  family: 'cryptographic',
  processorId: 'sha512',
  toolGroup: 'hash-generators',
  relatedTools: ['sha256-hash-generator', 'sha1-hash-generator', 'md5-hash-generator'],
  guide: {
    slug: 'sha512-hash-generator',
    categorySlug: 'developer-utilities',
    title: 'SHA-512 Hash Generator: Complete Guide',
    description: 'Learn what SHA-512 is, how it compares to SHA-256, and when to use it. Includes real-world uses, common mistakes, and examples.',
    readMinutes: 5,
    updatedAt: '2026-06-15',
  },
};
