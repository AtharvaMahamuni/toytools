import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'calorie-deficit-calculator',
  title: 'Calorie Deficit Calculator',
  category: 'health-fitness',
  summary: 'Set a daily calorie target for a chosen rate of weight loss, with a BMR floor and a week-by-week timeline to a goal weight.',
  primaryConcepts: ['calorie deficit', 'weight loss rate'],
  secondaryConcepts: ['maintenance calories', 'energy balance', 'metabolic adaptation', 'basal metabolic rate', 'rate of loss'],
  intentGroups: {
    informational: [
      'what a calorie deficit is',
      'where the 7,700 kcal per kilogram figure comes from',
      'how fast weight loss can safely go',
    ],
    howTo: [
      'set a daily calorie target for a chosen rate of loss',
      'estimate how many weeks a goal weight will take',
      'adjust the target as body weight falls',
    ],
    comparison: [
      'a gentle deficit versus an aggressive one',
      'eating less versus moving more to widen the gap',
    ],
    misconception: [
      'a bigger deficit does not produce proportionally faster fat loss',
      'week-to-week scale movement is not the same as fat loss',
    ],
    troubleshooting: [
      'why weight stalls partway through a deficit',
      'what to do when the target falls below BMR',
    ],
  },
  realWorldUseCases: [
    'Choosing a daily calorie number before starting a cut.',
    'Estimating whether a goal weight is realistic before an event.',
    'Checking whether an app-suggested target is dangerously low.',
  ],
  commonMistakes: [
    'Picking the most aggressive rate available and abandoning it within a fortnight.',
    'Never recalculating, so the original deficit becomes maintenance as weight falls.',
    'Reading a single weigh-in as progress instead of a weekly average.',
  ],
  commonQuestions: [
    'How big should a calorie deficit be?',
    'How long will it take me to lose weight?',
    'Why did my weight loss stall?',
  ],
  usedWith: [
    { slug: 'tdee-calculator', reason: 'Check the maintenance figure the deficit is subtracted from', strength: 0.9 },
    { slug: 'body-weight-tracker', reason: 'Log the weekly weigh-ins the plan is judged by', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'tdee-calculator', reason: 'When you only need maintenance rather than a loss target' },
  ],
  nextSteps: [
    { slug: 'macro-calculator', reason: 'Split the daily target into macronutrients', strength: 0.8 },
  ],
  workflowStage: ['analyze'],
  keywords: ['calorie deficit calculator', 'weight loss calculator', 'daily calorie target', 'calories to lose weight', 'deficit'],
  entityAliases: ['weight loss calorie calculator', 'deficit calculator', 'cutting calorie calculator'],
};
