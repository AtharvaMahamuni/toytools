import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'wave-speed-simulator',
  title: 'Wave Speed Simulator',
  category: 'physics',
  summary: 'Visualize a travelling wave and see how frequency and wavelength set its speed through v = f × λ, live and interactive.',
  primaryConcepts: ['wave speed'],
  secondaryConcepts: ['frequency', 'wavelength', 'amplitude', 'period', 'travelling wave'],
  intentGroups: {
    informational: ['What is wave speed?', 'What does v = f × λ mean?', 'What is a travelling wave?'],
    howTo: ['How to calculate wave speed from frequency and wavelength', 'How to find the period of a wave'],
    comparison: ['Wave speed vs particle speed', 'Frequency vs wavelength'],
    misconception: ['Amplitude does not change wave speed', 'The medium does not travel with the wave'],
    troubleshooting: ['Why the wave speed stays the same when I change amplitude', 'Why higher frequency can mean shorter wavelength'],
  },
  realWorldUseCases: [
    'Understanding why pitch is frequency while sound speed is fixed by the air',
    'Seeing why all light travels at c but colours have different wavelengths',
    'Explaining how ocean swells of different wavelengths move at different speeds',
    'Building intuition for the wave equation before a physics exam',
  ],
  commonMistakes: [
    'Thinking a taller (higher-amplitude) wave travels faster',
    'Assuming the medium particles move along with the wave',
    'Confusing frequency (cycles per second) with wave speed (metres per second)',
  ],
  commonQuestions: [
    'What is the wave speed formula?',
    'Does amplitude affect wave speed?',
    'What is the difference between wave speed and particle speed?',
  ],
  usedWith: [
    { slug: 'frequency-period-simulator', reason: 'Zoom in on the frequency-period relationship behind the wave', strength: 0.9 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'pendulum-simulator', reason: 'See simple harmonic motion that underlies a wave', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['wave speed', 'v = f lambda', 'frequency', 'wavelength', 'travelling wave', 'wave simulator'],
  entityAliases: ['wave speed', 'wave velocity', 'v = f λ', 'wave equation'],
  inputs: ['frequency', 'wavelength', 'amplitude'],
  outputs: ['wave speed', 'period', 'relative energy'],
  difficulty: 'beginner',
  audience: ['students', 'teachers', 'physics learners'],
};
