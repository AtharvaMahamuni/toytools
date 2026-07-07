import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'frequency-period-simulator',
  name: 'Frequency & Period Simulator',
  seoTitle: 'Frequency & Period Simulator — T = 1 / f',
  description: 'See how frequency and period are two views of one motion. Tap a beat or drag the slider and watch the period and angular frequency update live.',
  categorySlug: 'physics',
  tags: ['frequency', 'period', 'T = 1/f', 'angular frequency', 'oscillation', 'frequency to period', 'hertz', 'cycles per second'],
  updatedAt: '2026-07-07',
  isNew: true,
  trustVariant: 'offline',
  engine: 'physics',
  pattern: 'simulate',
  family: 'oscillations',
  processorId: 'frequency-period',
  relatedTools: ['wave-speed-simulator', 'pendulum-simulator'],
};
