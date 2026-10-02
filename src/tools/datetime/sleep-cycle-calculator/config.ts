import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sleep-cycle-calculator',
  name: 'Sleep Cycle Calculator',
  seoTitle: 'Sleep Cycle Calculator: 90 Minute Bedtime',
  description:
    'What time should you go to bed? Counts 90 minute sleep cycles and the minutes it takes to fall asleep.',
  tagline: 'Bedtimes in 90 minute cycles, plus time to fall asleep.',
  categorySlug: 'date-time',
  tags: ['sleep calculator', 'bedtime calculator', '90 minute sleep cycles', 'wake time'],
  updatedAt: '2026-10-02',
  addedOn: '2026-10-02',
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-calculate',
  family: 'sleep',
  processorId: 'sleep',
  inputs: ['text', 'number'],
  outputs: ['metric'],
  craft: {
    id: 'sleep-latency',
    kind: 'guardrail',
    solves:
      'A bedtime list that ignores the minutes it takes to fall asleep wakes you in the middle of a cycle. Zero latency says the list assumes instant sleep.',
  },
  citation: {
    problem: 'Use the Sleep Cycle Calculator when an alarm or a bedtime should land on a whole cycle, including minutes to fall asleep.',
    nonGoal: 'prescribe a cycle length, diagnose a sleep disorder, or send your bedtimes to an AI model.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Pick bedtimes or wake times in ninety minute cycles, counting the minutes it takes to fall asleep.',
    repeatability: 'high',
    interactionDepth: 'medium',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['age-calculator', 'date-difference-calculator'],
  guide: {
    slug: 'sleep-cycle-calculator',
    categorySlug: 'datetime',
    title: 'How 90 Minute Sleep Cycles Pick a Bedtime',
    description:
      'How a 90 minute sleep cycle is counted, why the minutes to fall asleep sit outside the cycles, and how to read a bedtime or a wake time.',
    readMinutes: 6,
    updatedAt: '2026-10-02',
  },
};
