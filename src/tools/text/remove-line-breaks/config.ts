import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-line-breaks',
  name: 'Remove Line Breaks',
  seoTitle: 'Remove Line Breaks — Join Text Into One Paragraph',
  description: 'Remove line breaks from text and join lines into one paragraph. Strip the newlines a copy and paste leaves behind, or delete them all at once.',
  tagline: 'Join wrapped lines back into one paragraph.',
  categorySlug: 'text-utilities',
  tags: ['remove line breaks', 'delete line breaks', 'strip newlines', 'join lines', 'remove hard returns', 'unwrap text', 'remove line breaks online'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  craft: {
    id: 'rlb-paragraphs',
    kind: 'orientation',
    solves: 'Joining every line into one block destroys paragraph structure as well as hard wrapping, and the tool that keeps lines separate is one page away with a name that sounds like the same job.',
  },
  processorId: 'removeLineBreaks',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-remove-line-breaks',
    categorySlug: 'text',
    title: 'How To Remove Line Breaks',
    description: 'Learn why pasted text gets broken across lines and how to join it back into one clean, continuous paragraph.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },
};
