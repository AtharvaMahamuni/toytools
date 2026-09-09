import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'breathing-circle',
  name: 'Breathing Circle',
  seoTitle: 'Breathing Circle: Calm Breathing Visual and 4-7-8 Timer',
  description:
    'Breathing circle calm animation and breathing exercise animation. Calm breathing visual with named Box, 4-7-8 breathing timer, and Coherent presets. No account.',
  tagline: 'Breathe with a named pattern, not a vague calm.',
  categorySlug: 'fidgets',
  tags: ['box breathing', '4-7-8', 'coherent breathing', 'breathing timer', 'breathing visual'],
  updatedAt: '2026-09-09',
  isNew: true,
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'breathing-presets',
    kind: 'orientation',
    solves:
      'Default timings are labelled calm but run faster than the user\'s preferred box pattern with no preset names, so the circle lies about what it is doing.',
  },
  relatedTools: ['pomodoro-timer', 'pop-it', 'keep-screen-awake'],
  keywords: [],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'breathing-circle',
    categorySlug: 'fidget',
    title: 'Breathing Circle: Box, 4-7-8 and Coherent',
    description:
      'How a browser breathing circle names its pattern, why mute is independent of motion, and how a session ends without an abrupt cut.',
    readMinutes: 6,
    updatedAt: '2026-09-09',
  },
};
