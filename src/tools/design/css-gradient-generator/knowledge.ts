import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'css-gradient-generator',
  title: 'Perceptual Gradient Generator',
  category: 'design-tools',
  summary:
    'Build a two-stop CSS gradient in OKLCH, copy the declaration, and see when an sRGB mix goes gray.',
  primaryConcepts: ['OKLCH CSS gradient', 'perceptual gradient'],
  secondaryConcepts: ['linear gradient', 'sRGB midpoint', 'gradient css code'],
  intentGroups: {
    informational: [
      'what an OKLCH CSS gradient is',
      'why an sRGB blend of blue and yellow goes gray',
    ],
    howTo: [
      'copy a linear gradient that interpolates in OKLCH',
      'sample hex stops for browsers that lack OKLCH interpolation',
    ],
    comparison: [
      'difference between an OKLCH gradient and an sRGB gradient',
    ],
    misconception: [
      'the hex samples are not the declaration to paste',
    ],
    troubleshooting: [
      'what to do when the middle of a saturated pair looks muddy',
    ],
  },
  realWorldUseCases: [
    'Copying an OKLCH linear gradient into a stylesheet.',
    'Checking whether blue to yellow goes muddy in sRGB.',
    'Sampling hex stops when a browser does not interpolate in OKLCH.',
  ],
  commonMistakes: [
    'Copying an sRGB blend when the middle has gone gray.',
    'Assuming the hex samples are the declaration to paste.',
    'Uploading stops to a generator that stores them.',
  ],
  commonQuestions: [
    'What is an OKLCH CSS gradient?',
    'How do I copy linear gradient CSS code?',
    'Why does an sRGB blend go gray in the middle?',
    'What is the difference between an OKLCH gradient and an sRGB gradient?',
    'Does this upload my color stops?',
    'Can the copied CSS live in a stylesheet?',
  ],
  usedWith: [
    { slug: 'color-shades-generator', reason: 'Build a 50 to 950 scale from one of these stops', strength: 0.7 },
    { slug: 'color-contrast-checker', reason: 'Score text on one of the sampled stops', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'color-format-converter', reason: 'When the job is one color in several notations, not a blend' },
  ],
  nextSteps: [
    { slug: 'color-shades-generator', reason: 'Turn one stop into a tint and shade scale', strength: 0.6 },
  ],
  workflowStage: ['transform', 'export'],
  keywords: [
    'css gradient generator oklch',
    'css gradient generator',
    'oklch gradient',
    'linear gradient generator',
    'perceptual gradient',
    'gradient css code',
  ],
  entityAliases: ['OKLCH'],
};
