import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'switch-board',
  title: 'Switch Board',
  category: 'fidgets',
  summary:
    'Flip a free toggle switch board with optional click sound and haptics, then All off without reloading or uploading anything.',
  primaryConcepts: ['toggle switch board'],
  secondaryConcepts: [
    'switch fidget',
    'satisfying switches',
    'mechanical switch simulator',
    'button fidget',
    'online switch board',
  ],
  intentGroups: {
    informational: [
      'What is a switch board fidget?',
      'How do online switch fidgets handle sound?',
    ],
    howTo: [
      'How to use a switch board online without installing an app',
      'How to mute switch clicks but keep haptics',
      'How to clear a mixed switch board',
      'How to use a switch board with a keyboard',
    ],
    comparison: [
      'Switch board vs an ASMR switch video',
      'Browser switch fidget vs a phone simulator app',
    ],
    misconception: [
      'Desktop vibration should always fire',
      'A mixed board needs a page reload',
      'Muting sound also turns haptics off',
    ],
    troubleshooting: [
      'Can one tap flip the same switch twice?',
      'Why is Tab hopping through every switch?',
    ],
  },
  realWorldUseCases: [
    'Quietly flipping switches on a long call with sound muted',
    'Using a phone switch board with haptics on and no app install',
    'Clearing a mixed board with All off instead of reloading the tab',
  ],
  commonMistakes: [
    'Leaving sound on in a shared space and blaming the page instead of Settings',
    'Reloading the tab when All off would continue the session',
    'Expecting desktop vibration when the device has no vibrator',
  ],
  commonQuestions: [
    'What is a switch board fidget?',
    'Does every flip make a sound?',
    'How do I clear the board after flipping around?',
    'Can I use the board with a keyboard?',
    'Is this Switch Board free, and do I need to download it?',
  ],
  usedWith: [
    { slug: 'pop-it', reason: 'Another browser fidget when you want bubbles instead of latches', strength: 0.8 },
    { slug: 'pomodoro-timer', reason: 'Fidget between focus blocks without leaving the browser', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'pop-it', reason: 'Pick Pop It when you want a bubble board rather than latches' },
  ],
  nextSteps: [
    { slug: 'keep-screen-awake', reason: 'Keep the phone awake while the board stays on screen', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'switch board',
    'toggle switch board',
    'switch fidget online',
    'satisfying switches',
    'button fidget web',
    'mechanical switch simulator',
    'toggle fidget',
  ],
  entityAliases: ['switchboard', 'toggle board', 'switch fidget'],
  inputs: [],
  outputs: ['board'],
  difficulty: 'beginner',
  audience: ['everyone', 'students'],
};
