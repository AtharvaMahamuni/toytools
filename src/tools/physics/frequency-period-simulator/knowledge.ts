import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'frequency-period-simulator',
  title: 'Frequency & Period Simulator',
  category: 'physics',
  summary: 'Watch an oscillator and see how frequency and period are reciprocals through T = 1 / f, with a tap-the-beat input.',
  primaryConcepts: ['frequency and period'],
  secondaryConcepts: ['angular frequency', 'oscillation', 'hertz', 'reciprocal', 'cycles per second'],
  intentGroups: {
    informational: ['What is the relationship between frequency and period?', 'What is angular frequency?'],
    howTo: ['How to convert frequency to period', 'How to find angular frequency from frequency'],
    comparison: ['Frequency vs period', 'Frequency vs angular frequency'],
    misconception: ['Period is not proportional to frequency, it is the reciprocal'],
    troubleshooting: ['Why the period halves when I double the frequency'],
  },
  realWorldUseCases: [
    'Converting a metronome tempo in beats per minute into a frequency',
    'Understanding why mains electricity at 50 Hz has a 20 ms period',
    'Relating a heart rate to the time between beats',
    'Preparing for a physics topic on simple harmonic motion',
  ],
  commonMistakes: [
    'Thinking a higher frequency means a longer period',
    'Confusing angular frequency (rad/s) with ordinary frequency (Hz)',
  ],
  commonQuestions: [
    'What is the relationship between frequency and period?',
    'What is angular frequency?',
    'If I double the frequency, what happens to the period?',
  ],
  usedWith: [
    { slug: 'wave-speed-simulator', reason: 'Use the frequency here inside the wave speed equation', strength: 0.9 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'pendulum-simulator', reason: 'See a real oscillator whose period follows the same idea', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['frequency', 'period', 'T = 1/f', 'angular frequency', 'oscillation', 'hertz'],
  entityAliases: ['frequency and period', 'period of oscillation', 'T = 1/f', 'angular frequency'],
  inputs: ['frequency'],
  outputs: ['period', 'angular frequency', 'cycles completed'],
  difficulty: 'beginner',
  audience: ['students', 'teachers', 'physics learners'],
};
