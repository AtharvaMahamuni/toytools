import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'water-intake-tracker',
  name: 'Water Intake Tracker',
  seoTitle: 'Water Intake Tracker — Daily Hydration Log & Streaks',
  description: 'Tap to log glasses of water, hit your daily goal, and build a streak. A private hydration tracker with a weekly chart, right in your browser.',
  tagline: 'Tap to log glasses of water and build a hydration streak.',
  categorySlug: 'health-fitness',
  tags: [
    'water intake tracker', 'water tracker', 'hydration tracker', 'daily water tracker',
    'drink water reminder', 'water log', 'glasses of water', 'water goal tracker',
    'track water intake', 'hydration log', 'water drinking tracker',
    'free water tracker', 'online water tracker', 'water streak',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'local',
  engine: 'tracker',
  pattern: 'health-track',
  family: 'habit',
  toolGroup: 'health-trackers',
  processorId: 'water-intake',
  relatedTools: ['body-weight-tracker', 'move-today-tracker', 'tdee-calculator'],
  guide: {
    slug: 'how-to-track-water-intake',
    categorySlug: 'health-fitness',
    title: 'How to Track Your Water Intake and Stick to It',
    description: 'Learn how much water to aim for, why a daily goal and a streak keep you consistent, and how to build a hydration habit that lasts.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
