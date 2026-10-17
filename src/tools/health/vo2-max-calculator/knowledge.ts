import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'vo2-max-calculator',
  title: 'VO2 Max Calculator',
  category: 'health-fitness',
  summary:
    'Estimate VO2 max from a twelve-minute Cooper distance or a resting pulse, and keep the two numbers apart.',
  primaryConcepts: ['aerobic capacity', 'VO2 max'],
  secondaryConcepts: ['Cooper test', 'resting heart rate', 'fitness age'],
  intentGroups: {
    informational: [
      'what VO2 max is',
      'how the Cooper test turns a twelve-minute distance into a number',
    ],
    howTo: [
      'estimate aerobic capacity from 2.4 km in twelve minutes',
      'estimate vo2max from age and a resting pulse',
    ],
    comparison: [
      'difference between the Cooper test and the resting-pulse estimate',
    ],
    misconception: [
      'this page does not compute fitness age',
    ],
    troubleshooting: [
      'what happens when a distance in metres is typed into the kilometre field',
    ],
  },
  realWorldUseCases: [
    'Reading a Cooper estimate from a 2.4 km twelve-minute run.',
    'Comparing that run with a resting pulse of 60 at age 30.',
    'Leaving one method blank so the other stands alone.',
  ],
  commonMistakes: [
    'Typing the distance in metres while the field is in kilometres.',
    'Treating the Cooper number and the pulse number as one measurement.',
    'Expecting a fitness age from this page.',
  ],
  commonQuestions: [
    'What is VO2 max?',
    'How does the Cooper test estimate VO2 max?',
    'How does a resting heart rate estimate vo2max?',
    'What is the difference between the Cooper test and the resting-pulse estimate?',
    'Does this calculate fitness age?',
    'What distance counts as a twelve-minute run?',
  ],
  usedWith: [
    { slug: 'running-pace-calculator', reason: 'Turn a race distance and time into pace after the field test', strength: 0.5 },
    { slug: 'heart-rate-zone-calculator', reason: 'Set training zones from age, which this page does not do', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'heart-rate-zone-calculator', reason: 'When the question is training zones from age, not a VO2 estimate' },
  ],
  nextSteps: [
    { slug: 'running-pace-calculator', reason: 'Convert a race result into pace', strength: 0.4 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'vo2 max calculator',
    'cooper test calculator',
    'aerobic capacity calculator',
    'vo2max from resting heart rate',
    'fitness age calculator',
  ],
  entityAliases: ['VO2'],
};
