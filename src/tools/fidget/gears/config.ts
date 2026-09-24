import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'gears',
  name: 'Gears',
  seoTitle: 'Gears Fidget Online: Spin Meshing Gears',
  description:
    'Spin interactive meshing gears as a virtual fidget. Gear ratio simulator, gear toy browser. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Spin the pair. The ratio stays honest.',
  categorySlug: 'fidgets',
  tags: ['gear ratio', 'meshing gears', 'spin gears', 'gear toy', 'interactive gears'],
  updatedAt: '2026-09-24',
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
  relatedTools: ['spinner', 'pop-it', 'switch-board'],
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
