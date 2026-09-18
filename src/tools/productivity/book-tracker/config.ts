import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'book-tracker',
  name: 'Book Tracker',
  seoTitle: 'Book Tracker: Local Reading List',
  description:
    'Track books on a private bookshelf, offline, with export. A Goodreads alternative with no account. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'A private shelf for books you want, are reading, or finished.',
  categorySlug: 'productivity',
  tags: [
    'reading list',
    'offline',
    'bookshelf',
    'books',
    'export',
    'local',
    'no account',
    'goodreads alternative',
  ],
  isNew: true,
  updatedAt: '2026-09-18',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'shelf',
  trustVariant: 'local',
  craft: {
    id: 'book-shelf-local',
    kind: 'orientation',
    solves:
      'Goodreads and StoryGraph put a reading shelf behind an account wall, so a private list of titles, progress, and ratings never starts. This shelf stays on the device with no signup.',
  },
  relatedTools: ['habit-streak-tracker', 'notepad', 'todo-list'],
  guide: {
    slug: 'how-to-keep-a-private-reading-shelf',
    categorySlug: 'productivity',
    title: 'How to Keep a Private Reading Shelf',
    description:
      'Keep a private reading list on your device: want, reading, finished, progress, and ratings. No account.',
    readMinutes: 6,
    updatedAt: '2026-09-18',
  },
};
