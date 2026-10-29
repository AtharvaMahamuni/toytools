import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'height-comparison',
  title: 'Height Comparison',
  category: 'number-utilities',
  summary: 'Line up a person, a door, and a few cited heights on one scale, in feet or centimetres.',
  primaryConcepts: ['height comparison chart'],
  secondaryConcepts: ['feet and inches', 'centimetres', 'door height', 'basketball rim'],
  intentGroups: {
    informational: [
      'what a height comparison chart shows',
      'how the international inch converts feet and inches to centimetres',
    ],
    howTo: [
      'line up your height with a door',
      'read 5.11 as decimal feet and correct it to 5 ft 11 in',
    ],
    comparison: [
      'a scale you type versus a celebrity height catalog',
    ],
    misconception: [
      '5.11 feet is not 5 feet 11 inches',
    ],
    troubleshooting: [
      'a comma in the height field',
      'a centimetre value typed while the unit is feet',
    ],
  },
  realWorldUseCases: [
    'Checking whether you clear a doorway',
    'Seeing how you stand next to an average adult',
    'Reading the gap to a basketball rim or a kitchen counter',
  ],
  commonMistakes: [
    'Typing 5.11 to mean 5 feet 11 inches',
    'Reading a comma as a decimal point',
    'Leaving the unit on feet while typing a centimetre value',
  ],
  commonQuestions: [
    'What is a height comparison chart?',
    'What does 5.11 mean in feet?',
    'Why are there no celebrities on the chart?',
  ],
  usedWith: [
    { slug: 'percentage-calculator', reason: 'Express one height as a percentage of another', strength: 0.4 },
  ],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['analyze'],
  keywords: [
    'height comparison',
    'height comparison chart',
    'height chart feet inches',
  ],
  entityAliases: [
    'height comparison chart',
    'height chart feet inches',
  ],
  inputs: ['number'],
  outputs: ['chart'],
  difficulty: 'beginner',
  audience: ['students', 'anyone comparing a height'],
};
