import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'frequency-period-simulator',
  name: 'Frequency & Period Simulator',
  seoTitle: 'Frequency & Period Simulator — T = 1 / f',
  description: 'See how frequency and period are two views of one motion. Tap a beat or drag the slider and watch the period and angular frequency update live.',
  categorySlug: 'physics',
  tags: ['frequency', 'period', 'T = 1/f', 'angular frequency', 'oscillation', 'frequency to period', 'hertz', 'cycles per second'],
  updatedAt: '2026-07-09',
  isNew: true,
  trustVariant: 'offline',
  engine: 'physics',
  pattern: 'simulate',
  family: 'oscillations',
  processorId: 'frequency-period',
  relatedTools: ['wave-speed-simulator', 'pendulum-simulator'],
  guide: {
    slug: 'how-frequency-and-period-relate',
    categorySlug: 'physics',
    title: 'Frequency and Period: T = 1 / f',
    description: 'How frequency and period are reciprocals, how to convert frequency to period, what angular frequency means, and why doubling frequency halves the period.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
