import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'tdee-calculator',
  title: 'TDEE Calculator',
  category: 'health-fitness',
  summary: 'Estimate Total Daily Energy Expenditure from BMR and activity, with calorie targets for losing, holding, or gaining weight, in metric or imperial.',
  primaryConcepts: ['total daily energy expenditure', 'basal metabolic rate'],
  secondaryConcepts: ['maintenance calories', 'calorie deficit', 'calorie surplus', 'activity multiplier', 'Mifflin-St Jeor equation'],
  intentGroups: {
    informational: [
      'what TDEE and BMR mean',
      'how the Mifflin-St Jeor equation estimates resting energy',
    ],
    howTo: [
      'calculate maintenance calories from height, weight, age, and activity',
      'set a calorie target to lose or gain weight',
      'choose the right activity multiplier',
    ],
    comparison: [
      'BMR versus TDEE',
      'calorie deficit versus surplus',
    ],
    misconception: [
      'TDEE is an estimate to test against the scale, not an exact measurement',
    ],
    troubleshooting: [
      'why weight is not changing at the calculated calorie target',
    ],
  },
  realWorldUseCases: [
    'Setting a daily calorie goal before starting a cut or bulk.',
    'Understanding how much everyday activity adds to resting energy needs.',
    'Sanity-checking a calorie target suggested by a fitness app.',
  ],
  commonMistakes: [
    'Overstating activity level, which inflates the calorie target.',
    'Treating the estimate as exact instead of adjusting from real weight trends.',
    'Cutting calories below BMR in pursuit of faster loss.',
  ],
  commonQuestions: [
    'How many calories should I eat to lose weight?',
    'What is the difference between BMR and TDEE?',
    'Which activity level should I choose?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['analyze'],
  keywords: ['tdee calculator', 'maintenance calories', 'daily calorie calculator', 'bmr', 'calorie deficit'],
  entityAliases: ['daily calorie calculator', 'maintenance calorie calculator', 'energy expenditure calculator'],
};
