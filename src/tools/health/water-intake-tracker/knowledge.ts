import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'water-intake-tracker',
  title: 'Water Intake Tracker',
  category: 'health-fitness',
  summary: 'Tap to log glasses of water against a daily goal, build a streak, and watch a weekly chart, all stored privately on your own device.',
  primaryConcepts: ['water intake tracking', 'daily hydration goal'],
  secondaryConcepts: ['habit streak', 'hydration', 'daily goal', 'consistency'],
  intentGroups: {
    informational: [
      'how much water to drink a day',
      'why a streak helps build a hydration habit',
    ],
    howTo: [
      'log daily water intake',
      'set a daily water goal',
      'keep a hydration streak going',
    ],
    comparison: [
      'glasses versus millilitres for tracking water',
    ],
    misconception: [
      'the eight-glasses rule is a rough guide, not a strict medical rule',
    ],
    troubleshooting: [
      'what happens to the streak if a day is missed',
    ],
  },
  realWorldUseCases: [
    'Building a daily habit of drinking enough water.',
    'Seeing at a glance whether this week beat last week.',
    'Keeping a private hydration log with no account or app install.',
  ],
  commonMistakes: [
    'Setting an unrealistic goal and giving up after one missed day.',
    'Forgetting to log until the end of the day, then guessing.',
    'Treating eight glasses as a hard target rather than a starting point.',
  ],
  commonQuestions: [
    'How many glasses of water should I drink a day?',
    'How does the streak work?',
    'Is my data private?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['input'],
  keywords: ['water intake tracker', 'hydration tracker', 'daily water goal', 'water log', 'water streak'],
  entityAliases: ['hydration tracker', 'water drinking tracker', 'daily water log'],
};
