import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-line-breaks',
  name: 'Remove Line Breaks',
  seoTitle: 'Remove Line Breaks — Join Text Into One Paragraph',
  description: 'Remove line breaks from text and join lines into one paragraph. Strip the newlines a copy and paste leaves behind, or delete them all at once.',
  tagline: 'Join wrapped lines back into one paragraph.',
  categorySlug: 'text-utilities',
  tags: ['remove line breaks', 'delete line breaks', 'strip newlines', 'join lines', 'remove hard returns', 'unwrap text', 'remove line breaks online'],
  updatedAt: '2026-10-05',
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
    title: 'How to Remove Line Breaks From Copied Text',
    description: 'Join text copied from a PDF or email into one paragraph. Excel CHAR(10), Word ^p, and regex \\r?\\n, plus how to keep real paragraph breaks.',
    readMinutes: 5,
    updatedAt: '2026-10-05',
  },
};
