import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'protein-intake-calculator',
  title: 'Protein Intake Calculator',
  category: 'health-fitness',
  summary: 'Find the daily protein range your body weight and training goal support, with the per-meal split and the grams per kilogram behind it.',
  primaryConcepts: ['protein intake', 'grams per kilogram'],
  secondaryConcepts: ['muscle protein synthesis', 'recommended dietary allowance', 'lean body mass', 'protein distribution', 'ISSN position stand'],
  intentGroups: {
    informational: [
      'how much protein a day the guidelines support',
      'why the recommendation is a range rather than a number',
      'what changes protein needs',
    ],
    howTo: [
      'calculate daily protein from body weight and training goal',
      'split a daily protein target across meals',
    ],
    comparison: [
      'total body weight versus lean mass as the basis',
      'protein needs for endurance versus strength training',
    ],
    misconception: [
      'more protein past the top of the range does not add more muscle',
      'the RDA is a deficiency floor, not a training target',
    ],
    troubleshooting: [
      'why a protein target feels impossible to hit in three meals',
    ],
  },
  realWorldUseCases: [
    'Setting a protein goal before planning meals for the week.',
    'Checking whether a diet plan supplies enough protein while cutting.',
    'Working out a per-meal protein target rather than a daily one.',
  ],
  commonMistakes: [
    'Eating most of the day\'s protein at dinner rather than spreading it.',
    'Applying a strength-training figure to a mostly sedentary week.',
    'Using total body weight when carrying a lot of fat, which overshoots the target.',
  ],
  commonQuestions: [
    'How much protein do I need a day?',
    'Is too much protein bad for you?',
    'Should protein be based on body weight or lean mass?',
  ],
  usedWith: [
    { slug: 'macro-calculator', reason: 'Fit the protein figure inside a full macro split', strength: 0.9 },
    { slug: 'tdee-calculator', reason: 'Find the calorie total the protein sits inside', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'macro-calculator', reason: 'When you want all three macronutrients, not protein alone' },
  ],
  nextSteps: [
    { slug: 'calorie-deficit-calculator', reason: 'Set the calorie target the protein has to fit within', strength: 0.7 },
  ],
  workflowStage: ['analyze'],
  keywords: ['protein intake calculator', 'how much protein', 'grams of protein per day', 'protein per kg', 'protein calculator'],
  entityAliases: ['daily protein calculator', 'protein requirement calculator', 'how much protein do i need'],
};
