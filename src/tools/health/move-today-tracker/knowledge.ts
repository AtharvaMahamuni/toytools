import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'move-today-tracker',
  title: 'Move Today Tracker',
  category: 'health-fitness',
  summary: 'Tap once a day to log that you moved, build a streak, and watch a month of activity fill in, all stored privately on your own device.',
  primaryConcepts: ['movement habit', 'activity streak'],
  secondaryConcepts: ['habit formation', 'do not break the chain', 'consistency', 'daily exercise'],
  intentGroups: {
    informational: [
      'why a streak helps build an exercise habit',
      'how a low daily bar keeps a habit alive',
    ],
    howTo: [
      'log daily movement in one tap',
      'keep an exercise streak going',
      'build a consistent movement habit',
    ],
    comparison: [
      'a simple streak versus an ambitious workout plan',
    ],
    misconception: [
      'consistency matters more than the length of any single session',
    ],
    troubleshooting: [
      'what happens to the streak after a missed day',
    ],
  },
  realWorldUseCases: [
    'Turning "exercise more" into a single daily tap you actually do.',
    'Keeping a visible chain of active days going.',
    'Building the habit first, before worrying about workout details.',
  ],
  commonMistakes: [
    'Setting the bar so high that one busy day breaks the habit.',
    'Chasing perfect workouts instead of showing up daily.',
    'Treating a missed day as failure rather than restarting the chain.',
  ],
  commonQuestions: [
    'How do I build an exercise habit?',
    'What counts as movement for the day?',
    'What happens to my streak if I miss a day?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['input'],
  keywords: ['movement tracker', 'exercise streak', 'daily habit tracker', 'activity streak', 'habit streak'],
  entityAliases: ['exercise habit tracker', 'daily movement tracker', 'workout streak tracker'],
};
