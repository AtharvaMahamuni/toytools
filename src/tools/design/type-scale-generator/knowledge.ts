import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'type-scale-generator',
  title: 'Type Scale Generator',
  category: 'design-tools',
  summary:
    'Build a modular type scale from a base size and a ratio, and copy the steps as rem CSS variables.',
  primaryConcepts: ['modular type scales'],
  secondaryConcepts: ['golden ratio typography', 'rem font sizes', 'CSS custom properties'],
  intentGroups: {
    informational: [
      'what a modular type scale is',
      'which musical ratio maps to 1.25',
      'why rem uses a 16px root',
    ],
    howTo: [
      'generate a css type scale from a base size',
      'copy font steps as CSS variables',
      'pick a golden ratio for display type',
    ],
    comparison: [
      'major third versus golden ratio',
      'px sizes versus rem sizes',
    ],
    misconception: [
      'every step on a golden ratio scale is readable on a phone',
      'the body step has to be named 16',
    ],
    troubleshooting: [
      'why the note appears on caption',
      'why display type overflows a phone',
    ],
  },
  realWorldUseCases: [
    'Setting caption through display before a stylesheet has a type ramp.',
    'Comparing a 1.25 major third with a 1.618 golden ratio on the same base.',
    'Copying --type-body and its siblings into a :root block.',
  ],
  commonMistakes: [
    'Shipping a caption under 12px because the ratio looked elegant on a desktop mock.',
    'Using a golden-ratio display step as a phone heading.',
    'Treating rem as if the root were the base size when the root is still 16px.',
  ],
  commonQuestions: [
    'How do I generate a modular type scale?',
    'What ratio should I use for font sizes?',
    'When does the size note appear?',
    'Are the CSS variables in rem or px?',
  ],
  usedWith: [
    { slug: 'px-to-rem-converter', reason: 'Convert one size when the root font size is not 16px', strength: 0.8 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'aspect-ratio-calculator', reason: 'Size a frame once the type ramp is chosen', strength: 0.4 },
    { slug: 'color-shades-generator', reason: 'Build the color tokens that sit beside the type ramp', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'type scale generator',
    'modular scale',
    'font size scale calculator',
    'golden ratio typography',
    'css type scale',
  ],
  entityAliases: ['modular scale', 'type ramp'],
  inputs: ['number'],
  outputs: ['text'],
  difficulty: 'beginner',
  audience: ['designers', 'developers'],
};
