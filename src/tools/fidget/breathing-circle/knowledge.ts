import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'breathing-circle',
  title: 'Breathing Circle',
  category: 'fidgets',
  summary:
    'A breathing circle with named Box, 4-7-8 and Coherent presets. Optional soft cues, fully in the browser, no account.',
  primaryConcepts: ['breathing circle'],
  secondaryConcepts: [
    'box breathing',
    '4-7-8 breathing',
    'coherent breathing',
    'breathing exercise',
    'calm breathing visual',
    'breathing timer',
  ],
  intentGroups: {
    informational: ['What is a breathing circle?', 'What is box breathing?'],
    howTo: [
      'How to follow box breathing online',
      'How to run 4-7-8 breathing in a browser',
      'How to mute breathing cues',
    ],
    comparison: [
      'Named presets vs a vague calm timer',
      'Browser breathing circle vs a meditation app',
    ],
    misconception: [
      'A default labelled calm is the same as box breathing',
      'Reduced motion means the session cannot run',
    ],
    troubleshooting: [
      'Why did the circle keep moving under reduced motion on other sites?',
      'Why can I not silence a YouTube breathing video?',
    ],
  },
  realWorldUseCases: [
    'A silent Box session at a desk with cues muted',
    '4-7-8 before sleep without a subscription app',
    'Coherent 5-5 when you want an even inhale and exhale',
  ],
  commonMistakes: [
    'Trusting a calm label that is not a named pattern',
    'Leaving audio on in an office',
    'Expecting the circle to be the only progress under reduced motion',
  ],
  commonQuestions: [
    'What is a breathing circle?',
    'Why is there no preset called Calm?',
    'Can I use this silently?',
    'Is this free, and do I need an account?',
  ],
  usedWith: [
    { slug: 'pomodoro-timer', reason: 'A breathing session between focus blocks', strength: 0.8 },
    { slug: 'keep-screen-awake', reason: 'Keep the phone awake through a longer session', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'pop-it', reason: 'A tap fidget when you want hands, not breath' },
  ],
  nextSteps: [
    { slug: 'pomodoro-timer', reason: 'Time the next work block after the session', strength: 0.6 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'breathing circle',
    'box breathing',
    '4-7-8 breathing',
    'coherent breathing',
    'breathing exercise animation',
  ],
  entityAliases: ['box breathing online', 'breathing timer', 'calm breathing visual'],
  inputs: [],
  outputs: ['session'],
  difficulty: 'beginner',
  audience: ['everyone'],
};
