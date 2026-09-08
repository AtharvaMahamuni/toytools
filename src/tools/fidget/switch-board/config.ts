import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'switch-board',
  name: 'Switch Board',
  seoTitle: 'Switch Board Online: Satisfying Switches',
  description:
    'Toggle switch board and mechanical switch simulator. A button fidget on the web with optional click sound, All off. No download.',
  tagline: 'Flip the switches. All off when you want a clean board.',
  categorySlug: 'fidgets',
  tags: [
    'switch fidget online',
    'satisfying switches',
    'mechanical switch simulator',
    'button fidget web',
  ],
  updatedAt: '2026-09-08',
  isNew: true,
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'switch-board-all-off',
    kind: 'continuation',
    solves:
      'After flipping around, the board is a mess of mixed latches and the only way back is toggling each one by hand, which ends the fidget loop.',
  },
  relatedTools: ['pop-it', 'pomodoro-timer', 'keep-screen-awake'],
  keywords: [],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'switch-board',
    categorySlug: 'fidget',
    title: 'Switch Board: Clicks, Haptics and All Off',
    description:
      'How a browser switch board works, why sound and haptics stay separate, and how All off continues the fidget without a reload.',
    readMinutes: 5,
    updatedAt: '2026-09-08',
  },
};
