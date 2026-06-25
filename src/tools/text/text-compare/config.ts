import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'text-compare',
  name: 'Text Compare',
  seoTitle: 'Text Compare — Compare Two Texts Online Free',
  description: 'Compare two texts side-by-side and see exactly what changed. Line-by-line diff with added, removed, and unchanged lines. Runs in your browser.',
  categorySlug: 'text-utilities',
  tags: ['text compare', 'text diff', 'compare text', 'diff two texts', 'text difference', 'find differences', 'online diff tool'],
  isNew: true,
  updatedAt: '2026-06-25',
  engine: 'text-interactive',
  pattern: 'text-interactive',
  family: 'text-compare',
  guide: {
    slug: 'text-compare',
    categorySlug: 'text-utilities',
    title: 'Text Compare: How to Diff Two Texts Online',
    description: 'Learn how to compare two versions of text, read a diff output, and use text comparison for editing, proofreading, and code review.',
    readMinutes: 4,
    updatedAt: '2026-06-25',
  },
  relatedTools: ['find-replace', 'remove-duplicate-lines', 'word-counter', 'character-counter'],
  keywords: ['diff tool', 'compare strings', 'text diff online'],
  inputs: ['text', 'text'],
  outputs: ['diff'],
};
