import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'gears',
  name: 'Gears',
  seoTitle: 'Gear Ratio Simulator: Spin Gears Fidget Online',
  description:
    'Gear ratio simulator and spin gears fidget. Interactive meshing gears in the browser, live ratio, no download. Tooth count always matches radius.',
  tagline: 'Spin the pair. The ratio stays honest.',
  categorySlug: 'fidgets',
  tags: ['gear ratio', 'meshing gears', 'spin gears', 'gear toy', 'interactive gears'],
  updatedAt: '2026-09-09',
  isNew: true,
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'gears-mesh',
    kind: 'guardrail',
    solves:
      'Two gears overlap without meshing because tooth count and radius were allowed to disagree, so the pair looks like it drives when it does not.',
  },
  relatedTools: ['pop-it', 'switch-board', 'spinner'],
  keywords: [],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'interactive-gears',
    categorySlug: 'fidget',
    title: 'Interactive Gears: Meshing, Ratio and Reset',
    description:
      'How browser gears stay meshed, why tooth count owns radius, and how the live ratio stays in sync when you spin.',
    readMinutes: 6,
    updatedAt: '2026-09-09',
  },
};
