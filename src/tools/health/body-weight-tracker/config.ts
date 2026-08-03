import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'body-weight-tracker',
  name: 'Body Weight Tracker',
  seoTitle: 'Body Weight Tracker — Daily Weigh-In Log & Trend',
  description: 'Log your weight each day and watch the trend line with a smoothed average and optional goal, all stored privately in your browser.',
  categorySlug: 'health-fitness',
  tags: [
    'body weight tracker', 'weight tracker', 'weight log', 'daily weigh in',
    'weight trend', 'weight loss tracker', 'track weight', 'weight chart',
    'weight progress tracker', 'weight moving average', 'scale weight log',
    'free weight tracker', 'online weight tracker', 'private weight tracker',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'local',
  engine: 'tracker',
  pattern: 'health-track',
  family: 'measurement',
  toolGroup: 'health-trackers',
  processorId: 'body-weight',
  relatedTools: ['bmi-calculator', 'tdee-calculator', 'water-intake-tracker'],
  guide: {
    slug: 'how-to-track-body-weight',
    categorySlug: 'health-fitness',
    title: 'How to Track Body Weight Without Losing Your Mind',
    description: 'Learn why the weight trend matters more than any single reading, how to weigh consistently, and how a moving average cuts through daily noise.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
