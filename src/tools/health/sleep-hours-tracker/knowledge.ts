import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sleep-hours-tracker',
  title: 'Sleep Hours Tracker',
  category: 'health-fitness',
  summary:
    'Log hours slept, read the streak and the week-over-week change, and keep the log on this device.',
  primaryConcepts: ['sleep log', 'sleep diary'],
  secondaryConcepts: ['hours of sleep', 'week-over-week change', 'weekly sleep average'],
  intentGroups: {
    informational: [
      'what the sleep log stores',
      'why a night above 9 hours can include time awake in bed',
    ],
    howTo: [
      'log hours slept and read the streak',
      'read the week-over-week change on the line chart',
    ],
    comparison: [
      'difference between this sleep log and a sleep cycle calculator',
    ],
    misconception: [
      'the chart is not a labeled weekly average',
    ],
    troubleshooting: [
      'what happens when a value above 16 hours is entered',
    ],
  },
  realWorldUseCases: [
    'Logging 7.5 hours and keeping the streak on this device.',
    'Reading the change from the first logged night to the latest one.',
    'Noticing when a 9.5 hour entry may include time awake in bed.',
  ],
  commonMistakes: [
    'Logging time in bed as if every hour were sleep.',
    'Expecting a labeled weekly sleep average.',
    'Trying to store a nap as a second entry on the same day.',
  ],
  commonQuestions: [
    'What does the sleep log store?',
    'Does this show a weekly sleep average?',
    'What is the week-over-week change?',
    'Why does a long night mention time awake in bed?',
    'Can I log a nap as a second entry?',
    'Is this a sleep diary template?',
  ],
  usedWith: [
    { slug: 'body-weight-tracker', reason: 'Keep another daily number on the same device', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'sleep-cycle-calculator', reason: 'When the question is a bedtime in ninety minute cycles, not a log of hours' },
  ],
  nextSteps: [
    { slug: 'body-weight-tracker', reason: 'Log weight beside the sleep hours', strength: 0.3 },
  ],
  workflowStage: ['input', 'analyze'],
  keywords: [
    'sleep tracker',
    'sleep log',
    'hours of sleep tracker',
    'sleep diary template',
    'sleep diary',
    'weekly sleep average',
  ],
  entityAliases: ['sleep diary'],
};
