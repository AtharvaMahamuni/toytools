import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'pregnancy-due-date-calculator',
  name: 'Pregnancy Due Date Calculator',
  description:
    'How many weeks pregnant am I? Naegele rule estimated delivery date and trimester dates. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Due date, weeks pregnant, and trimester dates.',
  categorySlug: 'health-fitness',
  tags: [
    'naegele rule',
    'estimated delivery date',
    'how many weeks pregnant am i',
    'weeks pregnant',
    'gestational age',
  ],
  updatedAt: '2026-10-21',
  addedOn: '2026-10-21',
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-calculate',
  family: 'due-date',
  processorId: 'pregnancy',
  inputs: ['date', 'number'],
  outputs: ['metric'],
  craft: {
    id: 'due-cycle-length',
    kind: 'guardrail',
    solves:
      'A 28 day cycle is assumed for a longer cycle, so the due date lands early and nothing says the cycle length moved it.',
  },
  citation: {
    problem: 'Use the Pregnancy Due Date Calculator when a last period and a cycle length should show a due date, weeks pregnant, and trimester dates together.',
    nonGoal: 'diagnose a pregnancy, replace a scan or a prenatal visit, or upload these dates.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Project a due date, the weeks pregnant today, and the trimester dates from the first day of the last period.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'high',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['age-calculator', 'date-difference-calculator'],
  guide: {
    slug: 'pregnancy-due-date-calculator',
    categorySlug: 'health',
    title: 'How a Last Period Sets a Due Date',
    description:
      'How the Naegele rule turns the first day of the last period and the cycle length into a due date, weeks pregnant, and trimester dates.',
    readMinutes: 7,
    updatedAt: '2026-10-21',
  },
};
