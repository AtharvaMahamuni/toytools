import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sleep-cycle-calculator',
  title: 'Sleep Cycle Calculator',
  category: 'date-time',
  summary:
    'Turn a wake time or a bedtime into 90 minute sleep cycles, including the minutes it takes to fall asleep.',
  primaryConcepts: ['90 minute sleep cycles'],
  secondaryConcepts: ['bedtime calculator', 'sleep latency', 'wake time', 'time to fall asleep'],
  intentGroups: {
    informational: [
      'what a 90 minute sleep cycle is',
      'why time to fall asleep is not part of the cycle',
      'how many cycles fit in a night',
    ],
    howTo: [
      'find what time you should go to bed',
      'count cycles forward from a bedtime',
      'change the cycle length from 90 minutes',
    ],
    comparison: [
      'bedtime from a wake time versus wake time from a bedtime',
      'six cycles versus five',
    ],
    misconception: [
      'the first cycle starts the moment you get into bed',
      'zero minutes to fall asleep is a realistic default',
    ],
    troubleshooting: [
      'why the alarm feels like it landed mid-dream',
      'why a bedtime looks earlier than nine hours before the alarm',
    ],
  },
  realWorldUseCases: [
    'Setting an alarm for 7:00 am and picking a bedtime that finishes a cycle.',
    'Knowing you will be in bed at 10:30 pm and choosing which wake time ends a cycle.',
    'Trying a 15 minute fall-asleep allowance before trusting a list that starts at lights-out.',
  ],
  commonMistakes: [
    'Counting 90 minutes backward from the alarm and skipping the time it takes to fall asleep.',
    'Leaving latency at zero and treating that as a plan.',
    'Treating six cycles as a prescription rather than one option on the list.',
  ],
  commonQuestions: [
    'What time should I go to bed for 90 minute sleep cycles?',
    'Why does the list start 15 minutes before the first cycle?',
    'How many sleep cycles are in a night?',
    'Does this sleep calculator upload my schedule?',
  ],
  usedWith: [
    { slug: 'date-difference-calculator', reason: 'Count the days between two dates after you have the clock times', strength: 0.3 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'age-calculator', reason: 'Work out an exact age from a birth date', strength: 0.2 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'sleep calculator',
    'sleep cycle calculator',
    'what time should i go to bed',
    'bedtime calculator',
    '90 minute sleep cycles',
  ],
  entityAliases: ['sleepyti.me alternative', 'wake time calculator'],
  inputs: ['text', 'number'],
  outputs: ['metric'],
  difficulty: 'beginner',
  audience: ['students', 'anyone planning a night'],
};
