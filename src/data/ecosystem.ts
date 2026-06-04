import type { EcosystemEntry } from './types';

export const ecosystem: Record<string, EcosystemEntry> = {
  'todo-list': {
    guide: {
      slug: 'how-to-use-a-todo-list',
      categorySlug: 'productivity',
      title: 'How To Use A Todo List',
      description:
        'Learn how simple task lists reduce mental load, improve focus, and help you finish work more consistently.',
      readMinutes: 5,
      updatedAt: 'Jun 2026',
    },
    faq: {
      slug: 'todo-list',
      categorySlug: 'productivity',
    },
  },
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
