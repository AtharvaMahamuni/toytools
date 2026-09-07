import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'pop-it',
  title: 'Pop It',
  category: 'fidgets',
  summary:
    'Tap a virtual Pop It bubble board in the browser, with optional sound and haptics, then reset without reloading.',
  primaryConcepts: ['Pop It'],
  secondaryConcepts: [
    'virtual pop it',
    'bubble fidget',
    'online fidget',
    'digital pop it',
    'pop it sensory',
  ],
  intentGroups: {
    informational: ['What is a virtual Pop It?', 'How do online Pop It fidgets handle sound?'],
    howTo: [
      'How to use a Pop It online without installing an app',
      'How to mute Pop It sounds but keep haptics',
      'How to reset a finished Pop It board',
    ],
    comparison: ['Browser Pop It vs a phone fidget app', 'Optional haptics vs always-on vibration'],
    misconception: [
      'Desktop vibration should always fire',
      'A finished board needs a page reload',
    ],
    troubleshooting: [
      'Why do some Pop It pages break when vibration is unsupported?',
      'Can one tap pop the same bubble twice?',
    ],
  },
  realWorldUseCases: [
    'Quietly fidgeting through a long call with sound muted',
    'Using a phone Pop It with haptics on and no app install',
    'Giving a child a sensory bubble board without ads or accounts',
    'Resetting the board between short breaks instead of reloading the tab',
  ],
  commonMistakes: [
    'Leaving sound on in a shared space and blaming the page instead of Settings',
    'Reloading the tab when Reset would continue the session',
    'Expecting desktop vibration when the device has no vibrator',
  ],
  commonQuestions: [
    'Does this Pop It make sound on every tap?',
    'How do I reuse the board after every bubble is popped?',
    'Can one tap pop the same bubble twice?',
    'Is anything uploaded when I use this?',
  ],
  usedWith: [
    { slug: 'pomodoro-timer', reason: 'Fidget between focus blocks without leaving the browser', strength: 0.7 },
    { slug: 'keep-screen-awake', reason: 'Keep the phone awake while the board stays on screen', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'dice-roller', reason: 'Another quick browser toy when you want a random outcome instead of a sensory loop' },
  ],
  nextSteps: [
    { slug: 'coin-flipper', reason: 'Flip a coin when the fidget break turns into a decision', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'pop it',
    'virtual pop it',
    'pop it online',
    'fidget pop it',
    'bubble pop fidget',
    'pop it sensory',
    'online fidget',
    'digital pop it',
    'bubble fidget',
    'popit',
  ],
  entityAliases: ['popit', 'pop-it', 'virtual fidget', 'fidget pop it'],
  inputs: [],
  outputs: ['board'],
  difficulty: 'beginner',
  audience: ['everyone', 'students', 'parents'],
};
