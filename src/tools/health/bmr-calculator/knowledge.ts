import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'bmr-calculator',
  title: 'BMR Calculator',
  category: 'health-fitness',
  summary: 'Estimate basal metabolic rate with the Mifflin-St Jeor equation and see what each activity multiplier adds on top of the resting figure.',
  primaryConcepts: ['basal metabolic rate', 'resting metabolic rate'],
  secondaryConcepts: ['Mifflin-St Jeor equation', 'activity multiplier', 'total daily energy expenditure', 'Harris-Benedict equation', 'resting energy expenditure'],
  intentGroups: {
    informational: [
      'what basal metabolic rate measures',
      'what a normal BMR looks like at a given size and age',
      'how the Mifflin-St Jeor equation is built',
    ],
    howTo: [
      'calculate basal metabolic rate from height, weight, age, and sex',
      'turn a BMR into a daily calorie total using an activity factor',
    ],
    comparison: [
      'BMR versus RMR',
      'Mifflin-St Jeor versus Harris-Benedict',
      'BMR versus TDEE',
    ],
    misconception: [
      'BMR is not the number of calories you should eat',
      'a slow metabolism is rarely the reason weight will not move',
    ],
    troubleshooting: [
      'why two people the same weight get different BMR figures',
    ],
  },
  realWorldUseCases: [
    'Finding the resting figure an app used before it applied an activity multiplier.',
    'Setting the floor a calorie deficit should not go below.',
    'Comparing how much of a daily burn is resting rather than activity.',
  ],
  commonMistakes: [
    'Eating at BMR instead of at maintenance, which is a far steeper deficit than intended.',
    'Expecting the formula to account for muscle mass, which it cannot from height and weight alone.',
    'Reading a low BMR as a broken metabolism rather than as a consequence of being smaller.',
  ],
  commonQuestions: [
    'What is a normal BMR?',
    'What is the difference between BMR and TDEE?',
    'Should I eat my BMR to lose weight?',
  ],
  usedWith: [
    { slug: 'tdee-calculator', reason: 'Scale the resting figure by activity into a daily total', strength: 0.9 },
    { slug: 'macro-calculator', reason: 'Split the resulting calories into protein, carbs, and fat', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'tdee-calculator', reason: 'When you want the daily burn rather than the resting one' },
  ],
  nextSteps: [
    { slug: 'calorie-deficit-calculator', reason: 'Turn maintenance into a weight-loss target', strength: 0.8 },
  ],
  workflowStage: ['analyze'],
  keywords: ['bmr calculator', 'basal metabolic rate', 'mifflin st jeor', 'resting metabolic rate', 'metabolism calculator'],
  entityAliases: ['basal metabolic rate calculator', 'resting metabolic rate calculator', 'metabolism calculator'],
};
