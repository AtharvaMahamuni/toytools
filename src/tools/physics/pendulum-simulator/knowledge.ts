import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'pendulum-simulator',
  title: 'Pendulum Simulator',
  category: 'physics',
  summary: 'Drag a pendulum and watch its period, speed, and potential-to-kinetic energy trade as you change length, angle, and gravity.',
  primaryConcepts: ['pendulum motion'],
  secondaryConcepts: ['period', 'simple harmonic motion', 'potential energy', 'kinetic energy', 'gravity', 'energy conservation'],
  intentGroups: {
    informational: ['What determines the period of a pendulum?', 'What is simple harmonic motion?'],
    howTo: ['How to calculate a pendulum period', 'How to change the release angle'],
    comparison: ['Small-angle period vs true period', 'Potential vs kinetic energy'],
    misconception: ['Mass does not affect the pendulum period', 'The small-angle formula is only an approximation'],
    troubleshooting: ['Why a wide swing is slower than the formula predicts', 'Why a heavier bob swings at the same rate'],
  },
  realWorldUseCases: [
    'Understanding why a grandfather clock pendulum is about one metre long',
    'Seeing how gravity on the Moon changes a pendulum period',
    'Visualizing energy conservation for a physics course',
    'Exploring simple harmonic motion before studying waves',
  ],
  commonMistakes: [
    'Assuming a heavier bob swings faster or slower',
    'Trusting the small-angle formula at large release angles',
    'Thinking the bob moves fastest at the top of the swing',
  ],
  commonQuestions: [
    'What determines the period of a pendulum?',
    'Why does the mass not affect the period?',
    'How does energy change during a swing?',
  ],
  usedWith: [
    { slug: 'frequency-period-simulator', reason: 'Relate the pendulum period to frequency', strength: 0.85 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'wave-speed-simulator', reason: 'See how oscillations combine into a travelling wave', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['pendulum', 'pendulum period', 'simple harmonic motion', 'potential energy', 'kinetic energy', 'gravity'],
  entityAliases: ['pendulum', 'simple pendulum', 'pendulum period', 'swinging pendulum'],
  inputs: ['length', 'initial angle', 'gravity'],
  outputs: ['period', 'bob speed', 'potential energy', 'kinetic energy'],
  difficulty: 'intermediate',
  audience: ['students', 'teachers', 'physics learners'],
};
