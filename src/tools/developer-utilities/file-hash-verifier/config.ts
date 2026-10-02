import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'file-hash-verifier',
  name: 'File Hash Verifier',
  seoTitle: 'File Hash Verifier: SHA256 Checksum in the Browser',
  description:
    'MD5 or SHA256 checksum of a local file, to verify a download. Nothing is uploaded.',
  tagline: 'SHA256 checksum of a local file, compared with the published digest.',
  categorySlug: 'developer-utilities',
  tags: ['sha256', 'checksum', 'download', 'browser', 'md5', 'uploaded', 'file checksum', 'verify download'],
  updatedAt: '2026-10-02',
  addedOn: '2026-10-02',
  trustVariant: 'private',
  engine: 'hashing',
  pattern: 'hash',
  family: 'file-hash',
  processorId: 'file-hash',
  inputs: ['file'],
  outputs: ['text'],
  craft: {
    id: 'file-hash-slices',
    kind: 'guardrail',
    solves:
      'An empty download still produces a digest, and a multi-gigabyte ISO dies if the page loads it with one arrayBuffer.',
  },
  citation: {
    problem: 'Use File Hash Verifier when a local file should be checked against a published digest in the browser.',
    nonGoal: 'upload the file to a server, treat an empty download as a finished ISO, or send the bytes to an AI model.',
  },
  job: {
    intent: 'validate',
    userJob: 'Hash a local file in the browser and check it against a published digest without uploading the file.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'high',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  relatedTools: ['sha256-hash-generator', 'md5-hash-generator', 'hash-identifier'],
  guide: {
    slug: 'file-hash-verifier',
    categorySlug: 'developer-utilities',
    title: 'How to Verify a File Checksum in the Browser',
    description:
      'How to hash a local file as SHA256, compare a download checksum, and catch an empty file before you install it.',
    readMinutes: 6,
    updatedAt: '2026-10-02',
  },
};
