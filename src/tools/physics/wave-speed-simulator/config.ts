import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'wave-speed-simulator',
  name: 'Wave Speed Simulator',
  seoTitle: 'Wave Speed Simulator — Explore v = f × λ',
  description: 'Watch a travelling wave in real time and see how frequency and wavelength set its speed. Drag the wave, change any value, and explore v = f × λ live.',
  categorySlug: 'physics',
  tags: ['wave speed', 'wave speed calculator', 'v = f λ', 'frequency and wavelength', 'wave simulation', 'travelling wave', 'wave physics', 'interactive wave'],
  updatedAt: '2026-07-10',
  isNew: true,
  trustVariant: 'offline',
  engine: 'physics',
  pattern: 'simulate',
  family: 'waves',
  processorId: 'wave-speed',
  relatedTools: ['frequency-period-simulator', 'pendulum-simulator'],
  guide: {
    slug: 'how-wave-speed-works',
    categorySlug: 'physics',
    title: 'How Wave Speed Works: v = f × λ',
    description: 'A visual guide to wave speed: what frequency, wavelength, and amplitude each change, why v = f × λ, and what does (and does not) affect how fast a wave travels.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
