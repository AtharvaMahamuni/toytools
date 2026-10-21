import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'ovulation-calculator',
  name: 'Ovulation Calculator',
  description:
    'When am I ovulating? Fertile window and conception date from the last period. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Fertile window, ovulation date, and the next period.',
  categorySlug: 'health-fitness',
  tags: [
    'fertile window calculator',
    'when am i ovulating',
    'conception date calculator',
    'luteal phase',
  ],
  updatedAt: '2026-10-21',
  addedOn: '2026-10-21',
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-calculate',
  family: 'fertile-window',
  processorId: 'ovulation',
  inputs: ['date', 'number'],
  outputs: ['metric'],
  craft: {
    id: 'luteal-phase-length',
    kind: 'guardrail',
    solves:
      'A 14 day luteal phase is assumed for a shorter luteal phase, so ovulation is marked early and nothing says the luteal length moved it.',
  },
  citation: {
    problem: 'Use the Ovulation Calculator when a last period, a cycle length, and a luteal phase should show an ovulation date, a fertile window, and the next period together.',
    nonGoal: 'confirm ovulation with a test, predict a pregnancy, keep a multi-cycle log, or upload these dates.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Find the fertile window and the ovulation date from the last period, the cycle length, and the luteal phase.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'high',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['pregnancy-due-date-calculator', 'date-difference-calculator'],
  guide: {
    slug: 'ovulation-calculator',
    categorySlug: 'health',
    title: 'How a Luteal Phase Sets Ovulation',
    description:
      'How cycle length and the luteal phase turn the last period into an ovulation date, a fertile window, and the next period.',
    readMinutes: 7,
    updatedAt: '2026-10-21',
  },
};
