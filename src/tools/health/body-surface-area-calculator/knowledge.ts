import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'body-surface-area-calculator',
  title: 'Body Surface Area Calculator',
  category: 'health-fitness',
  summary:
    'Estimate body surface area with Mosteller and Du Bois side by side, and read the square-metre spread.',
  primaryConcepts: ['body surface area', 'Mosteller formula'],
  secondaryConcepts: ['Du Bois formula', 'BSA', 'chemotherapy dosing'],
  intentGroups: {
    informational: [
      'what body surface area is',
      'how the Mosteller formula uses height and weight',
    ],
    howTo: [
      'estimate BSA with Mosteller and Du Bois together',
      'read the signed spread between the two formulas',
    ],
    comparison: [
      'difference between the Mosteller and Du Bois formulas',
    ],
    misconception: [
      'an unlabeled square-metre figure is not a chemotherapy dose',
    ],
    troubleshooting: [
      'what happens when height is entered in metres',
    ],
  },
  realWorldUseCases: [
    'Comparing Mosteller and Du Bois before copying a square-metre figure.',
    'Checking 175 cm and 70 kg, where the two formulas nearly agree.',
    'Seeing the spread open up at 160 cm and 90 kg.',
  ],
  commonMistakes: [
    'Entering height in metres instead of centimetres.',
    'Copying one formula into a chemotherapy dose.',
    'Reading one unlabeled number as the body surface area.',
  ],
  commonQuestions: [
    'What is body surface area?',
    'What is the Mosteller formula?',
    'What is the difference between Mosteller and Du Bois?',
    'Does this calculate a chemotherapy dose?',
    'Why do the two formulas disagree?',
    'What if I enter height in metres?',
  ],
  usedWith: [
    { slug: 'bmi-calculator', reason: 'Set the same height and weight against the BMI bands', strength: 0.6 },
    { slug: 'lean-body-mass-calculator', reason: 'Compare lean-mass formulas for the same body', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'ideal-weight-calculator', reason: 'When the question is a target weight from height, not surface area' },
  ],
  nextSteps: [
    { slug: 'bmi-calculator', reason: 'Read the BMI band for the same height and weight', strength: 0.5 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'body surface area calculator',
    'bsa calculator',
    'mosteller formula',
    'du bois bsa',
    'bsa for chemotherapy dosing',
  ],
  entityAliases: ['BSA', 'Mosteller'],
};
