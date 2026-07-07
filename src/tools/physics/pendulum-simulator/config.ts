import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'pendulum-simulator',
  name: 'Pendulum Simulator',
  seoTitle: 'Pendulum Simulator — Period, Energy & Gravity',
  description: 'Drag the bob and let it swing. Change length, angle, and gravity and watch the period, velocity, and the trade between potential and kinetic energy in real time.',
  categorySlug: 'physics',
  tags: ['pendulum', 'pendulum simulator', 'pendulum period', 'simple harmonic motion', 'potential and kinetic energy', 'gravity', 'oscillation', 'T = 2 pi sqrt L over g'],
  updatedAt: '2026-07-07',
  isNew: true,
  trustVariant: 'offline',
  engine: 'physics',
  pattern: 'simulate',
  family: 'oscillations',
  processorId: 'pendulum',
  relatedTools: ['frequency-period-simulator', 'wave-speed-simulator'],
};
