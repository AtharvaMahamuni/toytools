import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'kinetic-sand',
  name: 'Kinetic Sand',
  seoTitle: 'Kinetic Sand Online: Virtual Sand Fidget',
  description:
    'Drag, squish, or tilt virtual kinetic sand. Play with sand in the browser. Reset when packed. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Drag or tilt the pile. Reset when it packs.',
  categorySlug: 'fidgets',
  tags: ['kinetic sand', 'virtual sand', 'sand fidget', 'squish sand', 'sand pile'],
  updatedAt: '2026-09-24',
  isNew: true,
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'sand-reset',
    kind: 'continuation',
    solves:
      'There is no clear action and the surface packs into a corner with no reset, so people reload the tab and break the fidget loop.',
  },
  relatedTools: ['slime', 'pop-it', 'gears'],
  keywords: [],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'kinetic-sand-online',
    categorySlug: 'fidget',
    title: 'Kinetic Sand Online: Drag, Settle and Reset',
    description:
      'How a browser sand pile stays light on a phone, why pinch must not zoom the page, and how Reset continues after the mound packs.',
    readMinutes: 6,
    updatedAt: '2026-09-09',
  },
};
