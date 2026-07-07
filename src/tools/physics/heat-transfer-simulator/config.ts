import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'heat-transfer-simulator',
  name: 'Heat Transfer Simulator',
  seoTitle: 'Heat Transfer Simulator — Watch Blocks Reach Equilibrium',
  description: 'Watch heat flow from a hot block to a cold one until they reach the same temperature. Drag a block to set its heat and see equilibrium happen live.',
  categorySlug: 'physics',
  tags: ['heat transfer', 'thermal equilibrium', 'conduction', 'heat flow', 'temperature', 'thermodynamics', 'newton cooling', 'heat simulator'],
  updatedAt: '2026-07-07',
  isNew: true,
  trustVariant: 'offline',
  engine: 'physics',
  pattern: 'simulate',
  family: 'thermodynamics',
  processorId: 'heat-transfer',
  relatedTools: ['wave-speed-simulator', 'pendulum-simulator'],
};
