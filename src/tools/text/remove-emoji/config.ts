import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-emoji',
  name: 'Remove Emoji',
  seoTitle: 'Remove Emoji From Text — Emoji Remover',
  description: 'Strip every emoji from text in one paste, leaving words, punctuation, and spacing intact. Runs in your browser.',
  categorySlug: 'text-utilities',
  tags: ['remove emoji', 'emoji remover', 'delete emoji from text', 'strip emoji', 'remove emoji from text online', 'clean emoji', 'text without emoji', 'emoji cleaner'],
  updatedAt: '2026-07-02',
  isNew: true,
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeEmoji',
  toolGroup: 'text-cleanup',
  relatedTools: ['remove-accents', 'normalize-whitespace', 'remove-extra-spaces'],
  guide: {
    slug: 'how-to-remove-emoji-from-text',
    categorySlug: 'text',
    title: 'How To Remove Emoji From Text',
    description: 'Learn what counts as an emoji in Unicode, why deleting them by hand misses invisible characters, and how to strip them cleanly.',
    readMinutes: 4,
    updatedAt: 'Jul 2026',
  },
};
