import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'kinetic-sand',
  title: 'Kinetic Sand',
  category: 'fidgets',
  summary:
    'Drag a virtual kinetic sand pile in the browser. Reset restores the mound when it packs into a corner. No install.',
  primaryConcepts: ['kinetic sand'],
  secondaryConcepts: [
    'virtual kinetic sand',
    'sand fidget',
    'play with sand online',
    'squish sand',
    'sand pile',
  ],
  intentGroups: {
    informational: ['What is kinetic sand online?', 'How does a browser sand pile stay light?'],
    howTo: [
      'How to play kinetic sand in a browser',
      'How to reset a packed sand pile',
      'How to stop pinch-zoom while dragging sand',
    ],
    comparison: ['Browser sand vs a mobile sand game', 'Column pile vs WebGL sand'],
    misconception: [
      'More particles always feel better',
      'A packed corner means you have to reload',
    ],
    troubleshooting: [
      'Why did a pinch zoom the page on other sand toys?',
      'Why is the pile coarse on low intensity?',
    ],
  },
  realWorldUseCases: [
    'A short sensory drag during a break, without an app',
    'Resetting the mound between calls instead of reloading',
    'Using low intensity on a budget phone so the frame rate holds',
  ],
  commonMistakes: [
    'Reloading when Reset pile would restore the mound',
    'Expecting a GPU demo on a phone-width tab',
    'Judging depth by colour only',
  ],
  commonQuestions: [
    'How do I play kinetic sand online?',
    'What does Reset pile do?',
    'Is this free, and do I need to download it?',
  ],
  usedWith: [
    { slug: 'slime', reason: 'A stretch fidget when you want pull instead of a pile', strength: 0.8 },
    { slug: 'pop-it', reason: 'Taps instead of a drag when sand is too messy for the moment', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'gears', reason: 'Clean rotation when you do not want a pile' },
  ],
  nextSteps: [
    { slug: 'slime', reason: 'The other squish fidget on the same Feel prefs', strength: 0.7 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'kinetic sand',
    'kinetic sand online',
    'virtual kinetic sand',
    'sand fidget',
    'play with sand online',
  ],
  entityAliases: ['virtual sand', 'sand toy', 'squish sand browser'],
  inputs: [],
  outputs: ['pile'],
  difficulty: 'beginner',
  audience: ['everyone', 'parents', 'students'],
};
