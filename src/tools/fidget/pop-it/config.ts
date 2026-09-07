import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'pop-it',
  name: 'Pop It',
  seoTitle: 'Virtual Pop It Fidget Online: Sensory Bubble Board',
  description:
    'Virtual pop it fidget online: a pop it sensory bubble pop fidget game with optional sound and haptics. Reset restores the board.',
  tagline: 'Tap the bubbles. Reset when the board is done.',
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
      'A finished board looks like a dead end, so people reload the tab and break the fidget loop. Reset board inflates every bubble again without dropping focus or reloading assets.',
  },
  relatedTools: ['pomodoro-timer', 'keep-screen-awake', 'dice-roller', 'coin-flipper'],
  keywords: ['virtual pop it', 'bubble fidget'],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'virtual-pop-it',
    categorySlug: 'fidget',
    title: 'Virtual Pop It: Sound, Haptics and Reset',
    description:
      'How a browser Pop It works, why sound and haptics stay separate, and how Reset continues the board without a reload.',
    readMinutes: 6,
    updatedAt: '2026-09-08',
  },
};
