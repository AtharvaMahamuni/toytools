import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'remove-accents',
  name: 'Remove Accents',
  seoTitle: 'Remove Accents — Strip Diacritics From Text Online',
  description: 'Strip accents and diacritics, converting text to plain ASCII letters.',
  categorySlug: 'text-utilities',
  tags: ['remove accents', 'strip diacritics', 'remove diacritical marks', 'accents to plain text', 'unaccent text', 'normalize accents', 'remove accents online'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  processorId: 'removeAccents',
  toolGroup: 'text-cleanup',
  guide: {
    slug: 'how-to-remove-accents',
    categorySlug: 'text',
    title: 'How To Remove Accents',
    description: 'Learn what diacritics are, why some systems need plain ASCII, and how to strip accent marks while keeping the letters.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },
};
