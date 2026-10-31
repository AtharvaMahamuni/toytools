import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'infinity-cube',
  title: 'Infinity Cube',
  category: 'fidgets',
  summary:
    'Fold an infinity cube one open hinge at a time. The next hinge frees only after a quarter turn, and the blocks never pass through each other.',
  primaryConcepts: ['infinity cube'],
  secondaryConcepts: ['hinged cube fidget', 'virtual infinity cube'],
  intentGroups: {
    informational: ['What is an infinity cube?'],
    howTo: ['How does this infinity cube online work?'],
    comparison: ['How is this different from a fidget spinner and a Pop It?'],
    misconception: ['The blocks must not pass through each other'],
    troubleshooting: ['Why will it not fold the hinge I touched?'],
  },
  realWorldUseCases: [
    'Folding through a long call when a physical cube is not on the desk',
    'Showing a child how the open hinge is the only one that moves',
    'Keeping hands busy while reading, without a sound until Feel sound is on',
  ],
  commonMistakes: [
    'Expecting a second swipe during a fold to queue another turn',
    'Tapping a locked hinge and thinking the cube is stuck',
    'Reloading the page to clear the session fold count',
  ],
  commonQuestions: [
    'How do I fold the infinity cube?',
    'Why will it not fold the hinge I touched?',
    'Can the blocks pass through each other?',
    'How do I get back to one closed cube?',
    'Does it make a sound on every fold?',
    'Why is there no vibration on my laptop?',
    'Does reduced motion still let me fold?',
    'Is the fold count saved?',
    'Is anything uploaded?',
    'How is this different from a fidget spinner?',
    'Does it work on a phone?',
    'Is it free, with nothing to install?',
  ],
  usedWith: [
    {
      slug: 'spinner',
      reason: 'A flick that coasts when you want spin instead of a hinge fold',
      strength: 0.8,
    },
    {
      slug: 'pop-it',
      reason: 'A tap that inverts one bubble when a quarter turn is more motion than you want',
      strength: 0.7,
    },
  ],
  alternatives: [
    { slug: 'gears', reason: 'Meshing gears when you want a ratio you can read while you fidget' },
  ],
  nextSteps: [
    { slug: 'pop-it', reason: 'A quieter board if the room should stay still', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'infinity cube fidget',
    'infinity cube online',
    'fold infinity cube',
    'infinity cube toy',
    'quarter turn',
    'open hinge',
  ],
  entityAliases: ['hinged cube fidget', 'hand toy'],
  inputs: [],
  outputs: ['fold count'],
  difficulty: 'beginner',
  audience: ['everyone', 'students'],
};
