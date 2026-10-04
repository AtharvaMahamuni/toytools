import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'color-shades-generator',
  title: 'Color Shades Generator',
  category: 'design-tools',
  summary:
    'Build a 50 to 950 tint and shade scale from one color in OKLCH, and copy it as CSS custom properties.',
  primaryConcepts: ['tints and shades'],
  secondaryConcepts: ['OKLCH', 'Tailwind color scale', 'CSS custom properties', 'WCAG contrast on white'],
  intentGroups: {
    informational: [
      'what a 50 to 950 color palette contains',
      'why OKLCH ramps stay more even than HSL',
      'which stop is the brand stop',
    ],
    howTo: [
      'generate tailwind color shades from one hex',
      'copy a color scale as CSS variables',
      'reduce chroma so a light stop stays in gamut',
    ],
    comparison: [
      'tints versus shades',
      'OKLCH lightness versus HSL lightness',
    ],
    misconception: [
      'a generated ramp matches a published Tailwind palette',
      'every stop is safe as text on white',
    ],
    troubleshooting: [
      'why a pale stop looks grayer than the base',
      'why the contrast note appears on a light brand',
    ],
  },
  realWorldUseCases: [
    'Turning one brand hex into a token ramp before a component library is named.',
    'Checking whether the stop nearest that brand can carry body text on white.',
    'Copying --shade-50 through --shade-950 into a stylesheet without a design-tool account.',
  ],
  commonMistakes: [
    'Expecting the hex values to match a Tailwind version.',
    'Using a failing brand stop for body text because the swatch looked fine in the row.',
    'Keeping full chroma at stop 50 and clipping the hex outside sRGB.',
  ],
  commonQuestions: [
    'How do I generate a 50 to 950 color palette from one hex?',
    'What is the difference between tints and shades?',
    'Why is the scale in OKLCH instead of HSL?',
    'When does the note about contrast on white appear?',
  ],
  usedWith: [
    { slug: 'color-contrast-checker', reason: 'Score a chosen foreground and background pair', strength: 0.8 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'color-format-converter', reason: 'Read the same color as HEX, RGB, HSL, or OKLCH', strength: 0.7 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'color shades generator',
    'tints and shades',
    'color scale generator',
    'tailwind color shades',
    '50 to 950 color palette',
  ],
  entityAliases: ['OKLCH palette generator', 'shade scale'],
  inputs: ['text'],
  outputs: ['text'],
  difficulty: 'beginner',
  audience: ['designers', 'developers'],
};
