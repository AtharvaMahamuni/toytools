import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'move-today-tracker',
  name: 'Move Today Tracker',
  seoTitle: 'Move Today Tracker — Daily Movement Habit & Streak',
  description: 'Tap once a day to log that you moved, build a streak, and watch a month of activity fill in. A dead-simple movement habit tracker.',
  categorySlug: 'health-fitness',
  tags: [
    'movement tracker', 'daily habit tracker', 'exercise streak', 'workout streak tracker',
    'did i work out today', 'daily movement', 'activity streak', 'habit streak tracker',
    'move every day', 'fitness habit tracker', 'simple habit tracker',
    'free habit tracker', 'online streak tracker', 'daily exercise log',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'local',
  engine: 'tracker',
  pattern: 'health-track',
  family: 'habit',
  toolGroup: 'health-trackers',
  processorId: 'move-today',
  relatedTools: ['water-intake-tracker', 'body-weight-tracker', 'heart-rate-zone-calculator'],
  guide: {
    slug: 'how-to-build-a-daily-movement-habit',
    categorySlug: 'health-fitness',
    title: 'How to Build a Daily Movement Habit With a Streak',
    description: 'Learn why a one-tap streak beats an ambitious plan, how "do not break the chain" works, and how a low bar keeps a movement habit alive.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
