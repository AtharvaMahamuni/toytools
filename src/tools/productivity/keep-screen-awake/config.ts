import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'keep-screen-awake',
  name: 'Keep Screen Awake',
  seoTitle: 'Keep Screen Awake — Prevent Screen Sleep Online',
  description: 'Prevent your device from sleeping while this page remains open.',
  categorySlug: 'productivity',
  tags: [
    'keep screen awake', 'prevent screen sleep', 'screen always on',
    'stop screen turning off', 'keep display awake', 'wake lock',
    'screen timeout', 'keep phone screen awake', 'keep laptop screen awake',
    'prevent auto lock', 'screen on', 'productivity',
    'prevent screen lock', 'keep display on', 'keep screen on browser',
    'screen wake lock', 'stop screen from turning off',
  ],
  isNew: true,
  updatedAt: '2026-06-04',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'utility',
  guide: {
    slug: 'how-to-keep-your-screen-awake',
    categorySlug: 'productivity',
    title: 'How to Keep Your Screen Awake',
    description: 'Understand wake locks, browser support, battery impact, and when to use device settings instead.',
    readMinutes: 6,
    updatedAt: '2026-06-04',
  },
  trustVariant: 'offline',
  relatedTools: ['pomodoro-timer', 'todo-list'],
};
