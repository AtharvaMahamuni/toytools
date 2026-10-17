import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'css-gradient-generator',
  name: 'Perceptual Gradient Generator',
  seoTitle: 'Perceptual Gradient Generator: OKLCH CSS Code',
  description:
    'Build a linear CSS gradient in OKLCH and copy the perceptual gradient CSS code. The strip warns when an sRGB mix goes muddy.',
  tagline: 'An OKLCH linear gradient, copied as CSS code.',
  categorySlug: 'design-tools',
  tags: [
    'css gradient generator oklch',
    'css gradient generator',
    'oklch gradient',
    'linear gradient generator',
    'perceptual gradient',
    'gradient css code',
  ],
  updatedAt: '2026-10-17',
  addedOn: '2026-10-17',
  trustVariant: 'private',
  engine: 'color',
  pattern: 'color-convert',
  family: 'perceptual-gradient',
  inputs: ['text'],
  outputs: ['text'],
  craft: {
    id: 'oklch-srgb-mid',
    kind: 'orientation',
    solves:
      'An sRGB blend of two saturated stops goes gray in the middle, and the strip looks fine until that blend is copied.',
  },
  methodology: {
    name: 'OKLCH interpolation',
    detail:
      'The two stops are blended in OKLCH, and the copied declaration names that space so the browser does the same blend.',
  },
  citation: {
    problem: 'Use Perceptual Gradient Generator when two colors should become an OKLCH CSS gradient you can copy.',
    nonGoal: 'apply a vendor easing curve or upload the color stops.',
  },
  job: {
    intent: 'generate',
    userJob: 'Build a CSS gradient that interpolates in OKLCH and copy the declaration.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['color-format-converter', 'color-shades-generator', 'color-contrast-checker'],
  guide: {
    slug: 'css-gradient-generator',
    categorySlug: 'design',
    title: 'How to Build an OKLCH CSS Gradient',
    description:
      'Why an sRGB mix of blue and yellow goes gray, and the linear-gradient CSS the page copies.',
    readMinutes: 6,
    updatedAt: '2026-10-17',
  },
};
