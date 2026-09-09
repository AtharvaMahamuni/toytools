import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'slime',
  title: 'Slime',
  category: 'fidgets',
  summary:
    'Poke and pull virtual slime in the browser. Release unsticks a blob after a missed pointerup. No skins, no download.',
  primaryConcepts: ['virtual slime'],
  secondaryConcepts: [
    'slime fidget',
    'slime simulator',
    'stretch slime',
    'play with slime',
    'sensory slime',
  ],
  intentGroups: {
    informational: ['What is virtual slime?', 'How does browser slime stay attached to a finger?'],
    howTo: [
      'How to stretch slime online',
      'How to unstick slime after leaving the canvas',
      'How to make slime calmer or stretchier',
    ],
    comparison: ['Browser slime vs a mobile slime app', 'One blob vs IAP goo skins'],
    misconception: [
      'Leaving the canvas should keep the grab',
      'More meshes feel more like slime',
    ],
    troubleshooting: [
      'Why is the blob stuck to nothing?',
      'Why is slime hard to see on a light theme elsewhere?',
    ],
  },
  realWorldUseCases: [
    'A one-minute stretch break without installing an app',
    'Unsticking the blob with Release after a finger slid off the canvas',
    'Turning intensity down when the stretch feels too springy',
  ],
  commonMistakes: [
    'Reloading when Release would detach the grab',
    'Looking for colour skins that this page will not add',
    'Expecting idle jiggle under reduced motion',
  ],
  commonQuestions: [
    'How do I play with virtual slime?',
    'What does Release do?',
    'Is this free, and do I need to download it?',
  ],
  usedWith: [
    { slug: 'kinetic-sand', reason: 'A pile you drag when you want push instead of pull', strength: 0.8 },
    { slug: 'pop-it', reason: 'Taps when a blob is the wrong texture', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'spinner', reason: 'Momentum instead of stretch' },
  ],
  nextSteps: [
    { slug: 'kinetic-sand', reason: 'The other squish fidget on the same Feel prefs', strength: 0.7 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'virtual slime',
    'slime fidget',
    'slime simulator',
    'stretch slime online',
    'play with slime',
  ],
  entityAliases: ['slime toy', 'goo fidget', 'slime online'],
  inputs: [],
  outputs: ['blob'],
  difficulty: 'beginner',
  audience: ['everyone', 'students'],
};
