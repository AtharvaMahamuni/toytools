import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'uuid-generator',
  name: 'UUID Generator',
  seoTitle: 'UUID Generator — Random Version 4 UUIDs',
  description:
    'Generate random version 4 UUIDs in your browser. Make one or many at once, toggle hyphens and case, and copy them all. Nothing is uploaded.',
  categorySlug: 'generate',
  tags: [
    'uuid generator',
    'guid generator',
    'uuid v4',
    'random uuid',
    'unique identifier',
    'bulk uuid',
  ],
  isNew: true,
  updatedAt: '2026-07-10',
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-identifier',
  family: 'identifier',
  processorId: 'uuid',
  relatedTools: ['random-string-generator', 'password-generator'],
  keywords: ['uuid', 'guid', 'v4', 'identifier', 'unique', 'random'],
  inputs: ['options'],
  outputs: ['text'],
  guide: {
    slug: 'uuid-generator',
    categorySlug: 'generate',
    title: 'What Is a UUID and How to Generate One',
    description:
      'What UUIDs are, how version 4 works, when to use them, and how to generate them safely in the browser.',
    readMinutes: 8,
    updatedAt: 'Jul 2026',
  },
};
