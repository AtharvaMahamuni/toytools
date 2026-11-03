import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'no-sleep-website',
  name: 'No Sleep Website',
  seoTitle: 'No Sleep Website – Keep Your Screen Awake Online',
  description:
    'A free no sleep website and page to stay awake online. Keep your screen awake with a browser wake lock and prevent automatic sleep.',
  tagline: 'Keep your screen awake in your browser without installing an app.',
  categorySlug: 'productivity',
  tags: [
    'no sleep website',
    'no sleep page',
    'keep screen awake',
    'stay awake',
    'prevent screen sleep',
    'stop screen dimming',
    'screen always on',
    'stop screen turning off',
    'keep display awake',
    'wake lock',
    'keep phone screen awake',
    'keep laptop screen awake',
    'prevent screen timeout',
    'screen on',
    'productivity',
    'prevent auto lock',
    'screen wake lock',
    'keep screen on online',
  ],
  keywords: ['no', 'sleep', 'website', 'page', 'screen', 'awake', 'wake', 'lock', 'display', 'timeout'],
  updatedAt: '2026-11-03',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'utility',
  craft: {
    id: 'wl-lock-truth',
    kind: 'recovery',
    solves:
      'The whole product is a claim about something invisible, so a lock dropped by battery saver or an OS power policy leaves the page insisting the screen is awake over a screen that is going dark. The status line is derived from the live sentinel and says when the lock went, while the ticker re-acquires it.',
  },
  citation: {
    problem:
      'Use this no sleep website when you need to keep a phone, tablet, or laptop screen awake without installing apps or altering system settings.',
    nonGoal: 'override device power buttons, bypass low-battery shutdowns, or run in the background.',
  },
  guide: {
    slug: 'how-to-keep-your-screen-awake',
    categorySlug: 'productivity',
    title: 'How to Keep Your Screen Awake',
    description:
      'Keep your screen awake online with wake locks, browser support, and battery tips. What you enter stays on your device.',
    readMinutes: 6,
    updatedAt: '2026-11-03',
  },
  trustVariant: 'offline',
  relatedTools: ['pomodoro-timer', 'todo-list'],
};
