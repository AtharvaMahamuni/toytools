import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'switch-board',
  name: 'Switch Board',
  seoTitle: 'Switch Board Online: Virtual Toggle Fidget',
  description:
    'Flip satisfying switches on a virtual toggle switch board. Mechanical switch simulator, button fidget web. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Flip the switches. All off when you want a clean board.',
  categorySlug: 'fidgets',
  tags: [
    'switch fidget online',
    'satisfying switches',
    'mechanical switch simulator',
    'button fidget web',
  ],
  updatedAt: '2026-09-24',
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
  relatedTools: ['pop-it', 'spinner', 'gears'],
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
