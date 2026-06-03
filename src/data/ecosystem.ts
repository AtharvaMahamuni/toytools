import type { EcosystemEntry } from './types';

export const ecosystem: Record<string, EcosystemEntry> = {
  'base64-encoder-decoder': {
    guide: {
      slug: 'what-is-base64',
      categorySlug: 'developer',
      title: 'What Is Base64?',
      description:
        'Understand how Base64 encoding works, why it exists, where it is used, and common mistakes developers make.',
      readMinutes: 6,
      updatedAt: 'Jun 2026',
    },
    faq: {
      slug: 'base64-encoder-decoder',
      categorySlug: 'developer',
    },
  },
};
