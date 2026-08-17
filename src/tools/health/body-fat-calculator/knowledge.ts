import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'body-fat-calculator',
  title: 'Body Fat Calculator',
  category: 'health-fitness',
  summary: 'Estimate body fat percentage with the U.S. Navy tape-measure method from neck, waist, and hip measurements, plus fat mass and lean mass.',
  primaryConcepts: ['body fat percentage', 'U.S. Navy method'],
  secondaryConcepts: ['lean body mass', 'fat mass', 'body composition', 'circumference measurement'],
  intentGroups: {
    informational: [
      'what body fat percentage means',
      'how the U.S. Navy circumference method estimates body fat',
    ],
    howTo: [
      'measure body fat with a tape measure',
      'find fat mass and lean mass from bodyweight',
      'take neck, waist, and hip measurements correctly',
    ],
    comparison: [
      'body fat percentage versus BMI',
    ],
    misconception: [
      'the tape method is an estimate with a few points of error, not a lab measurement',
    ],
    troubleshooting: [
      'why two readings differ when the tape is pulled tighter',
    ],
  },
  realWorldUseCases: [
    'Tracking body composition during a cut or bulk without a scan.',
    'Getting a fat and lean mass split from just a tape measure and scale.',
    'Sanity-checking whether a high BMI is muscle or fat.',
  ],
  commonMistakes: [
    'Pulling the tape too tight, which compresses the skin and lowers the reading.',
    'Measuring at different times of day, so results are not comparable.',
    'Skipping the hip measurement for women, which the formula requires.',
  ],
  commonQuestions: [
    'What is a healthy body fat percentage?',
    'How accurate is the Navy body fat method?',
    'How is body fat different from BMI?',
  ],
  usedWith: [
    { slug: 'bmi-calculator', reason: 'Set the composition estimate beside the simpler BMI band', strength: 0.7 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'macro-calculator', reason: 'Split a calorie target once you know composition', strength: 0.6 },
  ],
  workflowStage: ['analyze'],
  keywords: ['body fat calculator', 'body fat percentage', 'navy method', 'lean body mass', 'fat mass'],
  entityAliases: ['body fat percentage calculator', 'navy body fat calculator', 'body composition calculator'],
};
