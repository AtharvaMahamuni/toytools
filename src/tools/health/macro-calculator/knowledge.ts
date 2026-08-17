import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'macro-calculator',
  title: 'Macro Calculator',
  category: 'health-fitness',
  summary: 'Split a daily calorie target into grams of protein, carbohydrate, and fat using balanced, high-protein, low-carb, or keto presets.',
  primaryConcepts: ['macronutrients', 'macro split'],
  secondaryConcepts: ['protein', 'carbohydrate', 'dietary fat', 'calorie target', 'keto ratio'],
  intentGroups: {
    informational: [
      'what macronutrients are',
      'how calories convert to grams of protein, carbs, and fat',
    ],
    howTo: [
      'calculate macros from a calorie target',
      'choose a macro split for a goal',
    ],
    comparison: [
      'balanced versus keto versus high-protein splits',
    ],
    misconception: [
      'hitting the calorie total matters more than a perfect ratio',
    ],
    troubleshooting: [
      'why different diets give very different fat and carb grams',
    ],
  },
  realWorldUseCases: [
    'Turning a TDEE calorie target into daily protein, carb, and fat goals.',
    'Comparing how a keto split changes fat and carb grams versus balanced.',
    'Setting a protein target to support training.',
  ],
  commonMistakes: [
    'Chasing a perfect ratio while missing the calorie total.',
    'Copying a split that does not fit your training or preferences.',
    'Forgetting fat carries 9 calories per gram, not 4.',
  ],
  commonQuestions: [
    'How do I calculate my macros?',
    'What is a good macro split for weight loss?',
    'How much protein should I eat?',
  ],
  usedWith: [
    { slug: 'tdee-calculator', reason: 'Get the calorie target the split divides up', strength: 0.9 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'protein-intake-calculator', reason: 'Sanity-check the protein half against body weight', strength: 0.7 },
  ],
  workflowStage: ['analyze'],
  keywords: ['macro calculator', 'macronutrient calculator', 'protein carbs fat', 'macro split', 'keto macros'],
  entityAliases: ['macronutrient calculator', 'iifym calculator', 'protein carb fat calculator'],
};
