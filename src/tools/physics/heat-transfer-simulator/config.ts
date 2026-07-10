import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'heat-transfer-simulator',
  name: 'Heat Transfer Simulator',
  seoTitle: 'Heat Transfer Simulator — Watch Blocks Reach Equilibrium',
  description: 'Watch heat flow from a hot block to a cold one until they reach the same temperature. Drag a block to set its heat and see equilibrium happen live.',
  categorySlug: 'physics',
  tags: ['heat transfer', 'thermal equilibrium', 'conduction', 'heat flow', 'temperature', 'thermodynamics', 'newton cooling', 'heat simulator'],
  updatedAt: '2026-07-09',
  isNew: true,
  trustVariant: 'offline',
  engine: 'physics',
  pattern: 'simulate',
  family: 'thermodynamics',
  processorId: 'heat-transfer',
  relatedTools: ['wave-speed-simulator', 'pendulum-simulator'],
  guide: {
    slug: 'how-heat-transfer-reaches-equilibrium',
    categorySlug: 'physics',
    title: 'How Heat Transfer Reaches Equilibrium',
    description: 'Which way heat flows, what thermal equilibrium means, why the flow slows over time, and why conductance changes the speed but not the final temperature.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
