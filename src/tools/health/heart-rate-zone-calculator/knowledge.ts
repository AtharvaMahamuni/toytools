import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'heart-rate-zone-calculator',
  title: 'Heart Rate Zone Calculator',
  category: 'health-fitness',
  summary: 'Find your maximum heart rate and five training zones from your age, with the Karvonen reserve method when you add a resting heart rate.',
  primaryConcepts: ['heart rate zones', 'maximum heart rate'],
  secondaryConcepts: ['Karvonen method', 'heart rate reserve', 'resting heart rate', 'aerobic zone', 'target heart rate'],
  intentGroups: {
    informational: [
      'what the five heart rate training zones are',
      'how maximum heart rate is estimated from age',
    ],
    howTo: [
      'calculate heart rate zones from age',
      'personalise zones with a resting heart rate',
      'find the fat-burning or aerobic zone',
    ],
    comparison: [
      'percent of max versus the Karvonen reserve method',
      '220 minus age versus the Tanaka formula',
    ],
    misconception: [
      'max heart rate formulas carry a spread of about ten beats',
    ],
    troubleshooting: [
      'why a formula max differs from a monitor reading',
    ],
  },
  realWorldUseCases: [
    'Setting easy Zone 2 base-training paces for running or cycling.',
    'Knowing the heart rate ceiling for a hard interval session.',
    'Personalising zones to fitness by adding a resting heart rate.',
  ],
  commonMistakes: [
    'Treating a formula maximum as exact instead of a rough estimate.',
    'Skipping the resting heart rate, which would sharpen the zones.',
    'Training too hard in what should be an easy Zone 2 session.',
  ],
  commonQuestions: [
    'What is my fat-burning heart rate zone?',
    'How accurate is 220 minus age?',
    'What is the Karvonen method?',
  ],
  usedWith: [
    { slug: 'running-pace-calculator', reason: 'Pair the zone with the pace you can hold in it', strength: 0.7 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'tdee-calculator', reason: 'Put the training into a daily energy figure', strength: 0.5 },
  ],
  workflowStage: ['analyze'],
  keywords: ['heart rate zone calculator', 'max heart rate', 'training zones', 'karvonen method', 'target heart rate'],
  entityAliases: ['training zone calculator', 'target heart rate calculator', 'max heart rate calculator'],
};
