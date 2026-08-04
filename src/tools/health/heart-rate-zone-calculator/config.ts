import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'heart-rate-zone-calculator',
  name: 'Heart Rate Zone Calculator',
  seoTitle: 'Heart Rate Zone Calculator — Max HR & Training Zones',
  description: 'Find your maximum heart rate and five training zones from your age, with the Karvonen method when you add a resting heart rate.',
  categorySlug: 'health-fitness',
  tags: [
    'heart rate zone calculator', 'training zones', 'max heart rate calculator', 'target heart rate',
    'fat burning zone', 'karvonen formula', 'heart rate training', 'zone 2 heart rate',
    'cardio zones', 'running heart rate zones', 'hr zones',
    'free heart rate zone calculator', 'online heart rate calculator',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'cardio',
  toolGroup: 'body-metrics',
  processorId: 'heart-rate-zones',
  relatedTools: ['tdee-calculator'],
  guide: {
    slug: 'how-to-find-your-heart-rate-zones',
    categorySlug: 'health-fitness',
    title: 'How to Find and Train in Your Heart Rate Zones',
    description: 'Learn what the five heart rate zones are, how max heart rate and the Karvonen method work, and how to train in each zone.',
    readMinutes: 6,
    updatedAt: 'Jul 2026',
  },
};
