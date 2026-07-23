import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'bmi-calculator',
  title: 'BMI Calculator',
  category: 'health-fitness',
  summary: 'Calculate Body Mass Index from height and weight in metric or imperial, with the WHO adult category and the healthy weight range for your height.',
  primaryConcepts: ['body mass index', 'healthy weight range'],
  secondaryConcepts: ['WHO weight categories', 'underweight', 'overweight', 'obesity', 'body composition'],
  intentGroups: {
    informational: [
      'what BMI measures and how it is calculated',
      'what the WHO BMI categories mean for adults',
    ],
    howTo: [
      'calculate BMI from height and weight',
      'find the healthy weight range for a given height',
      'convert between metric and imperial for BMI',
    ],
    comparison: [
      'BMI versus body fat percentage as a health measure',
    ],
    misconception: [
      'BMI is a screening ratio, not a diagnosis, and cannot tell muscle from fat',
    ],
    troubleshooting: [
      'why BMI can mislabel very muscular or older bodies',
    ],
  },
  realWorldUseCases: [
    'Checking where your weight sits against the healthy range before setting a goal.',
    'Understanding a BMI figure quoted at a doctor visit or insurance form.',
    'Seeing how many kilograms or pounds separate you from the healthy band.',
  ],
  commonMistakes: [
    'Treating BMI as a diagnosis rather than a rough population-level screen.',
    'Mixing units, such as entering weight in pounds while height is in centimetres.',
    'Applying adult BMI categories to children or athletes, where they do not fit.',
  ],
  commonQuestions: [
    'What is a healthy BMI range?',
    'Is BMI accurate for muscular people?',
    'How do I calculate BMI in pounds and inches?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['analyze'],
  keywords: ['bmi calculator', 'body mass index', 'healthy weight range', 'bmi categories', 'bmi formula'],
  entityAliases: ['body mass index calculator', 'bmi checker', 'weight status calculator'],
};
