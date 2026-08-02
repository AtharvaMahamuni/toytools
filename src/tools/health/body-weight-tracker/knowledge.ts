import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'body-weight-tracker',
  title: 'Body Weight Tracker',
  category: 'health-fitness',
  summary: 'Log your weight each day and follow the trend line with a smoothed moving average and optional goal, stored privately on your own device.',
  primaryConcepts: ['body weight tracking', 'weight trend'],
  secondaryConcepts: ['moving average', 'daily weigh-in', 'goal weight', 'weight fluctuation'],
  intentGroups: {
    informational: [
      'why the weight trend matters more than a single reading',
      'how a moving average smooths daily weight noise',
    ],
    howTo: [
      'log body weight consistently',
      'read a weight trend line',
      'set a goal weight',
    ],
    comparison: [
      'single weigh-in versus a moving average',
    ],
    misconception: [
      'a one-day jump is usually water, not fat',
    ],
    troubleshooting: [
      'why weight bounces around day to day',
    ],
  },
  realWorldUseCases: [
    'Following a weight-loss or gain trend without obsessing over daily swings.',
    'Weighing in each morning and watching the smoothed line, not the noise.',
    'Keeping a private weight log with no account or subscription.',
  ],
  commonMistakes: [
    'Reacting to a single day jump that is really just water weight.',
    'Weighing at inconsistent times, which adds noise to the trend.',
    'Weighing many times a day instead of once under the same conditions.',
  ],
  commonQuestions: [
    'Why does my weight go up and down day to day?',
    'How often should I weigh myself?',
    'What is the moving average line for?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['input'],
  keywords: ['body weight tracker', 'weight trend', 'daily weigh in', 'moving average', 'weight log'],
  entityAliases: ['weight tracker', 'weight log', 'weigh-in tracker'],
};
