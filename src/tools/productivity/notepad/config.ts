import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'notepad',
  name: 'Notepad',
  seoTitle: 'Online Notepad — Free, Private, No Sign-up',
  description: 'Quick notes stored in your browser. Auto-saved, private, and free.',
  tagline: 'Quick notes that save themselves, right in your browser.',
  categorySlug: 'productivity',
  tags: [
    'notepad', 'online notepad', 'browser notepad', 'free notepad',
    'simple notes', 'notes online', 'private notepad', 'text editor online',
    'scratchpad', 'note taking', 'quick notes', 'browser notes',
    'lightweight notes', 'online notebook',
    'temporary notepad online', 'quick notes online', 'notepad no login', 'online text editor free',
  ],
  updatedAt: '2026-10-05',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'note',
  guide: {
    slug: 'how-to-take-better-notes',
    categorySlug: 'productivity',
    title: 'Temporary Notes Online Without an Account',
    description: 'When a browser scratchpad beats a notes app, what survives a restart or cleared data, and how to back up notes you cannot afford to lose.',
    readMinutes: 5,
    updatedAt: '2026-10-05',
  },
  trustVariant: 'local',
  relatedTools: ['todo-list', 'pomodoro-timer'],
};
