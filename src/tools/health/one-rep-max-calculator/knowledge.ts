import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'one-rep-max-calculator',
  title: 'One Rep Max Calculator',
  category: 'health-fitness',
  summary: 'Estimate a one rep max from a submaximal set across four formulas, with the training percentages a strength program is written in.',
  primaryConcepts: ['one rep max', 'training percentage'],
  secondaryConcepts: ['Epley formula', 'Brzycki formula', 'submaximal set', 'rep max', 'progressive overload'],
  intentGroups: {
    informational: [
      'what a one rep max is and why programs use it',
      'how the estimation formulas are derived',
      'what percentage of a max suits each training goal',
    ],
    howTo: [
      'estimate a one rep max from a set of reps',
      'convert a one rep max into working weights',
    ],
    comparison: [
      'Epley versus Brzycki',
      'estimating a max versus testing one directly',
    ],
    misconception: [
      'an estimate above ten reps is far less reliable than one from three',
      'an estimated max is not proof you can lift it today',
    ],
    troubleshooting: [
      'why four formulas give four different answers',
    ],
  },
  realWorldUseCases: [
    'Turning last week\'s top set into working weights for a percentage-based program.',
    'Tracking strength progress without repeatedly testing a true maximum.',
    'Choosing a starting load for a new lift after a layoff.',
  ],
  commonMistakes: [
    'Estimating from a comfortable set rather than one taken close to failure.',
    'Using a high-rep set, where the formulas diverge the most.',
    'Attempting the estimated max without working up to it.',
  ],
  commonQuestions: [
    'How do I calculate my one rep max?',
    'Which one rep max formula is most accurate?',
    'What percentage of my max should I train at?',
  ],
  usedWith: [
    { slug: 'protein-intake-calculator', reason: 'Support the training the max is built from', strength: 0.6 },
    { slug: 'body-weight-tracker', reason: 'Track body weight alongside strength progress', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'running-pace-calculator', reason: 'The endurance equivalent of a performance benchmark' },
  ],
  nextSteps: [
    { slug: 'heart-rate-zone-calculator', reason: 'Set the intensity zones for the conditioning work around it', strength: 0.5 },
  ],
  workflowStage: ['analyze'],
  keywords: ['one rep max calculator', '1rm calculator', 'epley formula', 'brzycki formula', 'training percentage'],
  entityAliases: ['1rm calculator', 'max lift calculator', 'one repetition maximum calculator'],
};
