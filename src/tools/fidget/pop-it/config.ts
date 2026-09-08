import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'pop-it',
  name: 'Pop It',
  seoTitle: 'Pop It Online: Free Virtual Fidget Game',
  description:
    'Pop it online for free. A digital pop it sensory board: tap bubbles, optional sound and haptics, Infinite mode, Reset. No download, nothing uploaded.',
  tagline: 'Tap the bubbles. Infinite mode when you want more.',
  categorySlug: 'fidgets',
  tags: [
    'virtual pop it',
    'pop it online',
    'fidget pop it game',
    'bubble pop fidget',
    'pop it sensory',
    'digital pop it',
  ],
  updatedAt: '2026-09-08',
  isNew: true,
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'pop-it-reset',
    kind: 'continuation',
    solves:
      'A finished or half-scrolled board looks like a dead end, so people reload the tab and break the fidget loop. Reset board inflates every loaded bubble and scrolls the field back to the top without dropping focus or reloading assets.',
  },
  relatedTools: ['switch-board', 'pomodoro-timer', 'keep-screen-awake', 'dice-roller', 'coin-flipper'],
  keywords: ['virtual pop it', 'bubble fidget'],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'virtual-pop-it',
    categorySlug: 'fidget',
    title: 'Virtual Pop It: Sound, Haptics and Reset',
    description:
      'How a browser Pop It works, why sound and haptics stay separate, how Feel motion and Infinite mode work, and how Reset continues without a reload.',
    readMinutes: 6,
    updatedAt: '2026-09-08',
  },
};
