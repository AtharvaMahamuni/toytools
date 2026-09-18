import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-diff',
  name: 'JSON Diff',
  seoTitle: 'JSON Diff: compare two JSON objects',
  description:
    'Structural diff of two JSON objects. Ignore key order. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'See added, removed, and changed JSON paths.',
  categorySlug: 'developer-utilities',
  tags: ['compare json'],
  isNew: true,
  updatedAt: '2026-09-18',
  trustVariant: 'local',
  engine: 'structured-data',
  pattern: 'structured-compare',
  family: 'json',
  relatedTools: ['csv-diff', 'json-formatter', 'json-validator'],
  keywords: ['compare json'],
  inputs: ['json', 'json'],
  outputs: ['added paths', 'removed paths', 'changed paths'],
  craft: {
    id: 'json-structural-diff',
    kind: 'verification',
    solves:
      'A line diff treats reordered keys, 1 versus 1.0, and indentation as changes, so a real value edit gets buried and a clean structural match looks broken.',
  },
  guide: {
    slug: 'how-to-compare-two-json-documents',
    categorySlug: 'developer-utilities',
    title: 'How to Compare Two JSON Documents',
    description:
      'See how a structural JSON diff names added, removed, and changed paths, and why key order and 1 versus 1.0 are not changes.',
    readMinutes: 7,
    updatedAt: '2026-09-18',
  },
};
