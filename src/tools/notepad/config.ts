import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'notepad',
  name: 'Notepad',
  seoTitle: 'Notepad - Free Online Notes',
  description: 'Simple notes stored in your browser. Auto-saved, private, and free.',
  categorySlug: 'productivity',
  tags: [
    'notepad', 'online notepad', 'browser notepad', 'free notepad',
    'simple notes', 'notes online', 'private notepad', 'text editor online',
    'scratchpad', 'note taking', 'quick notes', 'browser notes',
    'lightweight notes', 'online notebook',
  ],
  isNew: true,
  updatedAt: '2026-06-04',
  guide: {
    slug: 'how-to-take-better-notes',
    categorySlug: 'productivity',
    title: 'How To Take Better Notes',
    description: 'Learn why writing things down improves memory, reduces mental load, and helps organize information more effectively.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
  faq: {
    slug: 'notepad',
    categorySlug: 'productivity',
  },
};
