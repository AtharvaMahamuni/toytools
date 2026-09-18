import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'uuid-inspector',
  name: 'UUID Inspector',
  seoTitle: 'UUID Inspector: Version and Variant',
  description:
    'Is this UUID valid, and what version is this UUID? UUID validator for v4 vs v7. Decode a UUID timestamp. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Read the version, variant, and time inside a UUID.',
  categorySlug: 'generate',
  tags: [
    'uuid validator',
    'decode uuid timestamp',
    'uuid v4 vs v7',
    'is this uuid valid',
    'nil uuid',
    'what version is this uuid',
  ],
  isNew: true,
  updatedAt: '2026-09-18',
  trustVariant: 'local',
  engine: 'generation',
  pattern: 'generate-identifier',
  family: 'identifier',
  processorId: 'uuid-inspector',
  relatedTools: ['uuid-generator'],
  keywords: [
    'uuid validator',
    'what version is this uuid',
    'uuid v4 vs v7',
    'is this a valid uuid',
    'is this uuid valid',
    'decode uuid timestamp',
    'nil uuid',
  ],
  inputs: ['text'],
  outputs: ['text'],
  craft: {
    id: 'uuid-version-check',
    kind: 'verification',
    solves:
      'A version 4 UUID looks fine to a human even when the system that will store it wants version 7, and the only difference is one hex digit nobody reads.',
  },
  guide: {
    slug: 'uuid-inspector',
    categorySlug: 'generate',
    title: 'Why UUID Version and Variant Bits Matter',
    description:
      'Why the version and variant bits in a UUID decide what a database will accept, and how to read them.',
    readMinutes: 7,
    updatedAt: '2026-09-18',
  },
};
