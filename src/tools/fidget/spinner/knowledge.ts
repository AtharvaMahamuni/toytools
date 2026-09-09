import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'spinner',
  title: 'Fidget Spinner',
  category: 'fidgets',
  summary:
    'Flick a virtual fidget spinner in the browser. Momentum comes from pointer velocity, ticks follow the angle, and the disc actually stops.',
  primaryConcepts: ['fidget spinner'],
  secondaryConcepts: [
    'virtual fidget spinner',
    'spinner online',
    'browser fidget spinner',
    'spin fidget',
    'spinner toy',
    'momentum spinner',
  ],
  intentGroups: {
    informational: ['What is a virtual fidget spinner?', 'How does a browser spinner get momentum?'],
    howTo: [
      'How to flick a fidget spinner online',
      'How to mute spinner ticks',
      'How to use a spinner with reduced motion',
    ],
    comparison: ['Browser spinner vs a phone app', 'Velocity flick vs drag-distance spin'],
    misconception: [
      'A longer drag always means a faster spin',
      'The disc should coast forever',
    ],
    troubleshooting: [
      'Why did a trackpad flick do nothing on other sites?',
      'Why did the tab get hot during a long spin?',
    ],
  },
  realWorldUseCases: [
    'Flicking a spinner on a call with sound muted',
    'A short sensory break on a phone without installing an app',
    'Checking that the disc reaches Stopped instead of crawling forever',
  ],
  commonMistakes: [
    'Judging a flick by drag distance instead of speed',
    'Leaving the tab spinning in the background on a phone',
    'Expecting reduced motion to freeze the whole control',
  ],
  commonQuestions: [
    'How do I spin this fidget spinner?',
    'Why does it actually stop?',
    'Is this free, and do I need to download it?',
    'What does Play do?',
  ],
  usedWith: [
    { slug: 'gears', reason: 'Meshing gears when you want ratio as well as spin', strength: 0.8 },
    { slug: 'pop-it', reason: 'A tap fidget when a disc is the wrong gesture', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'switch-board', reason: 'Clicks instead of momentum' },
  ],
  nextSteps: [
    { slug: 'keep-screen-awake', reason: 'Keep the phone awake if a long spin is the point', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'fidget spinner',
    'virtual fidget spinner',
    'fidget spinner online',
    'spinner toy',
    'browser spinner',
  ],
  entityAliases: ['spinner fidget', 'virtual spinner', 'spin fidget web'],
  inputs: [],
  outputs: ['spin'],
  difficulty: 'beginner',
  audience: ['everyone', 'students'],
};
