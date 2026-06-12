import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'notepad',
  name: 'Notepad',
  seoTitle: 'Online Notepad — Free, Private, No Sign-up',
  description: 'Simple notes stored in your browser. Auto-saved, private, and free.',
  categorySlug: 'productivity',
  tags: [
    'notepad', 'online notepad', 'browser notepad', 'free notepad',
    'simple notes', 'notes online', 'private notepad', 'text editor online',
    'scratchpad', 'note taking', 'quick notes', 'browser notes',
    'lightweight notes', 'online notebook',
    'temporary notepad online', 'quick notes online', 'notepad no login', 'online text editor free',
  ],
  isNew: true,
  updatedAt: '2026-06-04',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'note',
  guide: {
    slug: 'how-to-take-better-notes',
    categorySlug: 'productivity',
    title: 'How To Take Better Notes',
    description: 'Learn why writing things down improves memory, reduces mental load, and helps organize information more effectively.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
  trustVariant: 'local',
  relatedTools: ['todo-list', 'pomodoro-timer'],
};
