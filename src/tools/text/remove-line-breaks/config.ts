import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-line-breaks',
  name: 'Remove Line Breaks',
  seoTitle: 'Remove Line Breaks — Join Text Into One Paragraph',
  description: 'Remove line breaks and join wrapped text into one paragraph.',
  categorySlug: 'text-utilities',
  tags: ['remove line breaks', 'delete line breaks', 'strip newlines', 'join lines', 'remove hard returns', 'unwrap text', 'remove line breaks online'],
  updatedAt: '2026-06-28',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeLineBreaks',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-remove-line-breaks',
    categorySlug: 'text',
    title: 'How To Remove Line Breaks',
    description: 'Learn why pasted text gets broken across lines and how to join it back into one clean, continuous paragraph.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },
};
