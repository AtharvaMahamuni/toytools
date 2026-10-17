import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sleep-hours-tracker',
  name: 'Sleep Hours Tracker',
  seoTitle: 'Sleep Hours Tracker: Sleep Log and Diary',
  description:
    'A sleep log and diary template for hours slept. The chart is each night. The week-over-week change is the trend, not a labeled weekly average.',
  tagline: 'Log hours slept and read the streak and the week-over-week change.',
  categorySlug: 'health-fitness',
  tags: [
    'sleep tracker',
    'sleep log',
    'hours of sleep tracker',
    'sleep diary template',
    'sleep diary',
    'weekly sleep average',
  ],
  updatedAt: '2026-10-17',
  addedOn: '2026-10-17',
  trustVariant: 'local',
  engine: 'tracker',
  pattern: 'health-track',
  family: 'sleep-log',
  craft: {
    id: 'sleep-awake-in-bed',
    kind: 'orientation',
    solves:
      'A night logged above 9 hours often includes time awake in bed, and the trend still counts every hour as sleep.',
  },
  toolGroup: 'health-trackers',
  processorId: 'sleep-hours',
  relatedTools: ['body-weight-tracker', 'sleep-cycle-calculator'],
  citation: {
    problem: 'Use this when hours slept should be logged on this device, with the streak and the week-over-week change.',
    nonGoal: 'log a nap as a second entry, record sleep stages, or separate time in bed from time asleep.',
  },
  job: {
    intent: 'analyze',
    userJob: 'Log hours slept and read the streak and the week-over-week change.',
    repeatability: 'high',
    interactionDepth: 'medium',
    privacyValue: 'high',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'sleep-hours-tracker',
    categorySlug: 'health-fitness',
    title: 'How to Log Hours of Sleep',
    description:
      'A sleep diary for hours slept, the streak, and why the chart is not a labeled weekly average.',
    readMinutes: 5,
    updatedAt: '2026-10-17',
  },
};
