import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'ideal-weight-calculator',
  title: 'Ideal Weight Calculator',
  category: 'health-fitness',
  summary: 'Estimate ideal body weight from height and sex with the Devine, Robinson, Miller, and Hamwi formulas, alongside the modern BMI healthy range.',
  primaryConcepts: ['ideal body weight', 'healthy weight range'],
  secondaryConcepts: ['Devine formula', 'Robinson formula', 'Hamwi formula', 'BMI range', 'frame size'],
  intentGroups: {
    informational: [
      'what ideal body weight formulas estimate',
      'why the classic formulas disagree',
    ],
    howTo: [
      'find an ideal weight for a height',
      'read the healthy weight range for a height',
    ],
    comparison: [
      'ideal weight formulas versus the BMI healthy range',
    ],
    misconception: [
      'a healthy weight is a range, not a single ideal number',
    ],
    troubleshooting: [
      'why the formulas ignore muscle and frame size',
    ],
  },
  realWorldUseCases: [
    'Getting a rough target weight for a height before setting a goal.',
    'Comparing an old ideal-weight number against the modern BMI range.',
    'Understanding a target weight quoted by a clinician.',
  ],
  commonMistakes: [
    'Treating one formula number as an exact target to hit.',
    'Ignoring muscle and frame size, which the formulas cannot see.',
    'Confusing ideal weight with a healthy weight range.',
  ],
  commonQuestions: [
    'What should I weigh for my height?',
    'Why do the formulas give different answers?',
    'Is ideal weight the same as a healthy weight?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['analyze'],
  keywords: ['ideal weight calculator', 'ideal body weight', 'healthy weight for height', 'devine formula', 'bmi range'],
  entityAliases: ['ideal body weight calculator', 'healthy weight calculator', 'target weight calculator'],
};
