import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'equalizer-settings-generator',
  title: 'Music Equalizer Settings',
  category: 'music-audio',
  summary: 'Turn what you want to hear into equalizer settings: pick a goal, drag seven bands, see what each frequency does, then copy the values into your own player.',
  primaryConcepts: ['equalizer settings'],
  secondaryConcepts: [
    'frequency bands',
    'bass frequencies',
    'vocal presence',
    'eq preamp',
    'gain in decibels',
    'eq curve',
  ],
  intentGroups: {
    informational: [
      'What does an equalizer actually change?',
      'What does 60 Hz do?',
      'What frequency makes vocals clearer?',
      'What is the preamp on an equalizer for?',
    ],
    howTo: [
      'How to set an equalizer for more bass',
      'How to make vocals clearer with EQ',
      'How to reduce harshness with EQ',
      'How to copy EQ settings into a music player',
    ],
    comparison: [
      'Boosting bass vs cutting the low mids',
      'A 5-band EQ vs a 10-band EQ',
    ],
    misconception: [
      'A browser page cannot change the equalizer in Spotify or your headphones',
      'There is no single best EQ setting, because it depends on the recording and the headphones',
    ],
    troubleshooting: [
      'Music distorts or crackles after boosting bass',
      'The same EQ settings sound wrong on different headphones',
      'My player has different frequency bands from these',
    ],
  },
  realWorldUseCases: [
    'Building a bass-heavy preset for a phone music app before a commute',
    'Making a podcast or an audiobook easier to follow by lifting vocal presence',
    'Taming a bright pair of headphones that make cymbals sound harsh',
    'Sending a friend the exact EQ settings you landed on, as a link or an image',
  ],
  commonMistakes: [
    'Boosting several bands at once and clipping the output instead of lowering the preamp',
    'Treating a preset as a fixed answer rather than a starting point for your own headphones',
    'Adding bass to fix muddiness, when a small cut in the low mids is usually the fix',
  ],
  commonQuestions: [
    'What are the best EQ settings for bass?',
    'What frequency makes vocals clearer?',
    'Can EQ cause distortion?',
    'Can this change my Spotify equalizer?',
  ],
  usedWith: [
    { slug: 'frequency-period-calculator', reason: 'Work between a frequency in hertz and its period when reading about bands', strength: 0.5 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'wave-speed-calculator', reason: 'See how frequency and wavelength relate for the sound itself', priority: 1 },
  ],
  workflowStage: ['transform', 'export'],
  keywords: [
    'equalizer settings',
    'music equalizer',
    'eq settings',
    'eq presets',
    'bass boost eq',
    'eq settings for vocals',
    'eq frequency chart',
  ],
  entityAliases: ['eq', 'equaliser', 'equalizer', 'graphic equalizer', 'eq generator'],
  inputs: ['goal', 'gain per band'],
  outputs: ['equalizer settings', 'preset link', 'preset image'],
  difficulty: 'beginner',
  audience: ['music listeners', 'podcast listeners', 'headphone owners'],
};
