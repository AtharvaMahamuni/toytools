import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'running-pace-calculator',
  title: 'Running Pace Calculator',
  category: 'health-fitness',
  summary: 'Turn a distance and finish time into pace per kilometre and mile, speed, and Riegel-predicted 5K, 10K, half and marathon times.',
  primaryConcepts: ['running pace', 'race time prediction'],
  secondaryConcepts: ['Riegel formula', 'speed', 'even pacing', 'endurance model', 'split time'],
  intentGroups: {
    informational: [
      'what running pace means and how it differs from speed',
      'how a shorter race predicts a longer one',
      'what a typical 5K pace looks like',
    ],
    howTo: [
      'calculate pace from a distance and a finish time',
      'convert pace per kilometre to pace per mile',
      'predict a marathon time from a 5K or 10K',
    ],
    comparison: [
      'pace versus speed',
      'pace per kilometre versus pace per mile',
    ],
    misconception: [
      'a race prediction assumes you trained for that distance',
      'pace does not hold constant as race distance grows',
    ],
    troubleshooting: [
      'why a predicted marathon time feels far too fast',
    ],
  },
  realWorldUseCases: [
    'Setting a target pace for a race from a recent time trial.',
    'Converting a treadmill speed into the pace a race is run at.',
    'Sanity-checking a goal marathon time against current 10K form.',
  ],
  commonMistakes: [
    'Extrapolating a marathon from a 5K, which is far outside the model\'s reliable range.',
    'Comparing a downhill or short-course time as if it were flat and accurate.',
    'Planning a race at a pace held only for a single fast kilometre.',
  ],
  commonQuestions: [
    'How do I calculate running pace?',
    'What is a good 5K pace?',
    'Can a 5K time predict my marathon time?',
  ],
  usedWith: [
    { slug: 'heart-rate-zone-calculator', reason: 'Match the target pace to a training intensity zone', strength: 0.8 },
    { slug: 'move-today-tracker', reason: 'Log the runs the pace was measured on', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'one-rep-max-calculator', reason: 'The strength equivalent of a performance benchmark' },
  ],
  nextSteps: [
    { slug: 'tdee-calculator', reason: 'Account for the calories the training burns', strength: 0.6 },
  ],
  workflowStage: ['analyze'],
  keywords: ['running pace calculator', 'pace calculator', 'race time predictor', 'riegel formula', 'marathon pace'],
  entityAliases: ['pace calculator', 'race pace calculator', 'marathon time predictor'],
};
