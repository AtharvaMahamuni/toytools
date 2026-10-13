import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'lean-body-mass-calculator',
  title: 'Lean Body Mass Calculator',
  category: 'health-fitness',
  summary:
    'Estimate lean body mass from height, weight and sex with Boer 1984, James 1976 and Hume 1966 shown side by side.',
  primaryConcepts: ['lean body mass calculator', 'Boer formula'],
  secondaryConcepts: ['James formula', 'Hume formula', 'implied fat percent', 'body composition'],
  intentGroups: {
    informational: [
      'what lean body mass is',
      'how the Boer formula estimates lean mass from height and weight',
    ],
    howTo: [
      'estimate lean body mass from height, weight and sex',
      'calculate lean body mass from a body fat percentage',
    ],
    comparison: [
      'difference between the Boer, James and Hume formulas',
    ],
    misconception: [
      'one unlabeled lean mass number is not a measured fact or a drug dose',
    ],
    troubleshooting: [
      'what goes wrong when height is entered in meters instead of centimetres',
    ],
  },
  realWorldUseCases: [
    'Comparing Boer, James, and Hume before writing a lean mass figure down.',
    'Estimating how much of a scale weight the formulas treat as lean.',
    'Checking the kilogram gap before a formula is copied into a chart.',
  ],
  commonMistakes: [
    'Entering height in meters instead of centimetres.',
    'Copying one formula into a drug dose.',
    'Reading one unlabeled number as the lean mass.',
  ],
  commonQuestions: [
    'What is lean body mass?',
    'What is the difference between the Boer, James, and Hume formulas?',
    'Why do the three formulas disagree?',
    'How do I calculate lean body mass from a body fat percentage?',
    'Which formula should I use?',
    'Is this a drug dose?',
  ],
  usedWith: [
    { slug: 'body-fat-calculator', reason: 'Measure fat with a tape when this page has only estimated it', strength: 0.8 },
    { slug: 'bmi-calculator', reason: 'Set the same height and weight against the BMI bands', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'ideal-weight-calculator', reason: 'When the question is a target weight from height and sex, not lean mass' },
  ],
  nextSteps: [
    { slug: 'body-fat-calculator', reason: 'Turn a tape measurement into fat mass and lean mass', strength: 0.7 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'lean body mass calculator',
    'Boer formula',
    'James formula',
    'Hume formula',
    'lean body mass',
    'fat free mass',
  ],
  entityAliases: ['LBM calculator', 'lean mass calculator', 'Boer lean body mass'],
};
