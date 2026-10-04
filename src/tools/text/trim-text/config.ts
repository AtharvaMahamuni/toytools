import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'trim-text',
  name: 'Trim Text',
  seoTitle: 'Trim Leading and Trailing Spaces Online',
  description: 'Trim leading and trailing spaces and tabs from every line, without touching the words between. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Trim the whitespace at each end of every line.',
  categorySlug: 'text-utilities',
  tags: ['trim text', 'trim whitespace', 'remove leading spaces', 'remove trailing spaces', 'strip whitespace', 'trim lines', 'remove spaces from start and end'],
  updatedAt: '2026-10-05',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  craft: {
    id: 'trim-inner',
    kind: 'orientation',
    solves: 'It trims the edges of every line and leaves the middle alone, which is the exact mirror of the tool next door. A person cleaning a pasted table gets tidy margins and untouched double spaces between the columns.',
  },
  processorId: 'trimLines',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-trim-whitespace-from-text',
    categorySlug: 'text',
    title: 'How to Trim Whitespace in Excel and Code',
    description: 'Trim leading and trailing spaces with Excel TRIM, JavaScript trim(), Python strip() and SQL TRIM, and find the trailing spaces that break matches.',
    readMinutes: 5,
    updatedAt: '2026-10-05',
  },};
