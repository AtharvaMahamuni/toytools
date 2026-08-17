import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'reverse-text',
  name: 'Reverse Text',
  seoTitle: 'Reverse Text — Flip Text Backwards Online',
  description: 'Reverse text or a string character by character, online and private.',
  categorySlug: 'text-utilities',
  tags: ['reverse text', 'backwards text', 'flip text', 'reverse string', 'mirror text', 'text reverser', 'reverse text online'],
  updatedAt: '2026-07-10',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  processorId: 'reverseText',
  guide: {
    slug: 'how-to-reverse-text',
    categorySlug: 'text',
    title: 'How To Reverse Text',
    description: 'Learn what reversing text does, when backwards text is useful, and how to flip a string character by character instantly.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },
};
