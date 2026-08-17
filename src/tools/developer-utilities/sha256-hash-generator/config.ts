import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sha256-hash-generator',
  name: 'SHA-256 Hash Generator',
  seoTitle: 'SHA-256 Hash Generator — Free Online Tool',
  description: 'Generate a SHA-256 hash from any text instantly in your browser. Fast, private, and free.',
  tagline: 'Generate a SHA-256 hash from any text.',
  categorySlug: 'developer-utilities',
  tags: ['sha256', 'sha-256', 'sha256 hash', 'sha256 generator', 'hash generator', 'checksum', 'sha256 online', 'generate sha256', 'developer'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'hashing',
  pattern: 'hash',
  family: 'cryptographic',
  processorId: 'sha256',
  toolGroup: 'hash-generators',
  relatedTools: ['md5-hash-generator', 'sha1-hash-generator'],
  guide: {
    slug: 'what-is-sha256',
    categorySlug: 'developer-utilities',
    title: 'What Is SHA-256?',
    description: 'Understand how SHA-256 works, why it\'s considered secure, and where it\'s used — from TLS certificates to Bitcoin to HMAC API authentication.',
    readMinutes: 5,
    updatedAt: '2026-06-09',
  },};
