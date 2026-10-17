import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'waist-to-hip-ratio-calculator',
  title: 'Waist to Hip Ratio Calculator',
  category: 'health-fitness',
  summary:
    'Divide waist by hip, read the WHO 2008 cut for men and women, and catch a mixed-unit ratio.',
  primaryConcepts: ['waist to hip ratio', 'WHR'],
  secondaryConcepts: ['central obesity risk', 'WHO 2008 cut', 'waist to height ratio'],
  intentGroups: {
    informational: [
      'what waist to hip ratio is',
      'which WHO 2008 cut applies to men and to women',
    ],
    howTo: [
      'compute WHR from waist and hip circumferences',
      'read the sex-specific band beside the ratio',
    ],
    comparison: [
      'difference between waist to hip ratio and waist to height ratio',
    ],
    misconception: [
      'a ratio at the cut is not a diagnosis of central obesity',
    ],
    troubleshooting: [
      'what happens when one circumference is inches and the other is centimetres',
    ],
  },
  realWorldUseCases: [
    'Reading the sex-specific WHO band from a waist and a hip.',
    'Checking a 0.80 ratio against the male cut of 0.90.',
    'Catching a waist in inches beside a hip in centimetres.',
  ],
  commonMistakes: [
    'Typing one circumference in inches and the other in centimetres.',
    'Treating the ratio as a diagnosis of central obesity.',
    'Expecting a waist to height ratio from this page.',
  ],
  commonQuestions: [
    'What is waist to hip ratio?',
    'What waist to hip ratio is high for men and women?',
    'Does this calculate waist to height ratio?',
    'What if one side is inches and the other is centimetres?',
    'Is a high ratio a diagnosis of central obesity?',
    'Where does the tape go?',
  ],
  usedWith: [
    { slug: 'bmi-calculator', reason: 'Set the same body against the BMI bands', strength: 0.6 },
    { slug: 'body-fat-calculator', reason: 'Estimate fat from a tape when the ratio is only a screen', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'lean-body-mass-calculator', reason: 'When the question is lean mass from height and weight, not a circumference ratio' },
  ],
  nextSteps: [
    { slug: 'body-fat-calculator', reason: 'Turn a tape measurement into a fat estimate', strength: 0.5 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'waist to hip ratio calculator',
    'whr calculator',
    'waist hip ratio risk',
    'central obesity calculator',
    'waist to height ratio',
  ],
  entityAliases: ['WHR'],
};
