import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'spinner',
  name: 'Fidget Spinner',
  seoTitle: 'Fidget Spinner Online: Spin Fidget Web',
  description:
    'Virtual fidget spinner online. Spin fidget web in the browser. Flick for momentum that actually stops, optional ticks, no download.',
  tagline: 'Flick it. It spins, then it stops.',
  categorySlug: 'fidgets',
  tags: ['spinner online', 'virtual spinner', 'spin fidget', 'spinner toy', 'browser spinner'],
  updatedAt: '2026-09-09',
  isNew: true,
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'spinner-rest',
    kind: 'guardrail',
    solves:
      'The spinner never quite stops and drains a phone battery with the tab backgrounded because the loop kept running at a tiny leftover speed.',
  },
  relatedTools: ['pop-it', 'gears', 'switch-board'],
  keywords: [],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'virtual-fidget-spinner',
    categorySlug: 'fidget',
    title: 'Virtual Fidget Spinner: Flick, Momentum and Rest',
    description:
      'How a browser fidget spinner reads flick velocity, why it has to actually stop, and how ticks stay in sync with the disc.',
    readMinutes: 6,
    updatedAt: '2026-09-09',
  },
};
