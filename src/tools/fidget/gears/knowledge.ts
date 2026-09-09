import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'gears',
  title: 'Gears',
  category: 'fidgets',
  summary:
    'Spin meshing gears in the browser with a live ratio. Tooth count owns radius so the pair cannot overlap without meshing.',
  primaryConcepts: ['meshing gears'],
  secondaryConcepts: [
    'interactive gears',
    'gear ratio',
    'gear ratio simulator',
    'spin gears fidget',
    'gear toy',
    'idler gear',
    'pitch circle',
    'virtual gears',
  ],
  intentGroups: {
    informational: ['What are interactive gears?', 'How does a gear ratio work on a fidget?'],
    howTo: [
      'How to spin meshing gears online',
      'How to read a live gear ratio',
      'How to change tooth count without breaking the mesh',
    ],
    comparison: [
      'Browser gears vs a CAD calculator',
      'Playful gears vs engineering applets',
    ],
    misconception: [
      'Radius can be set independently of teeth',
      'The driven gear should turn the same way',
    ],
    troubleshooting: [
      'Why was my tooth count refused?',
      'Why did continuous spin stop under reduced motion?',
    ],
  },
  realWorldUseCases: [
    'Fidgeting through a call by spinning a meshed pair',
    'Showing a child that 12 and 24 teeth means a 1 : 2 ratio',
    'Checking that an external mesh reverses direction',
  ],
  commonMistakes: [
    'Expecting a radius slider that can un-mesh the pair',
    'Reading the ratio as speed instead of tooth counts',
    'Reloading when Reset layout restores the default pair',
  ],
  commonQuestions: [
    'What are interactive gears in a browser?',
    'Why can I not set radius separately from tooth count?',
    'How do I read the gear ratio?',
    'Is this free, and do I need to download it?',
  ],
  usedWith: [
    { slug: 'spinner', reason: 'Another momentum fidget when you want a single disc instead of a pair', strength: 0.8 },
    { slug: 'pop-it', reason: 'A tap fidget when spinning is too much motion', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'switch-board', reason: 'Latches instead of rotation when you want clicks, not spin' },
  ],
  nextSteps: [
    { slug: 'pop-it', reason: 'A quieter board if the gears are too busy for the room', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'interactive gears',
    'meshing gears',
    'gear ratio',
    'gear ratio simulator',
    'spin gears',
    'gear toy',
    'virtual gears',
  ],
  entityAliases: ['gear simulator', 'gear fidget', 'meshing gears online'],
  inputs: [],
  outputs: ['ratio'],
  difficulty: 'beginner',
  audience: ['everyone', 'students', 'parents'],
};
