import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'kinetic-sand',
  name: 'Kinetic Sand',
  seoTitle: 'Kinetic Sand Online Play: Virtual Kinetic Sand',
  description:
    'Drag and squish a sand fidget pile in your browser. Reset when packed. Runs on your device; nothing is uploaded.',
  tagline: 'Drag the pile. Reset when it packs.',
  categorySlug: 'fidgets',
  tags: ['kinetic sand', 'virtual sand', 'sand fidget', 'squish sand', 'sand pile'],
  updatedAt: '2026-09-09',
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
