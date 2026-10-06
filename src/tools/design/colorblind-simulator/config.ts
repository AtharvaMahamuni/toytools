import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'colorblind-simulator',
  name: 'Colorblind Simulator',
  seoTitle: 'Colorblind Simulator: Protanopia, Deuteranopia, Tritanopia',
  description:
    'Color blindness simulator and palette check for protanopia and deuteranopia. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Seven simulations of one palette, side by side.',
  categorySlug: 'design-tools',
  tags: ['colorblind simulator', 'color blindness simulator', 'deuteranopia simulator', 'protanopia color check', 'colorblind palette checker'],
  updatedAt: '2026-10-07',
  addedOn: '2026-10-07',
  trustVariant: 'private',
  engine: 'color',
  pattern: 'color-convert',
  family: 'color-vision',
  inputs: ['text'],
  outputs: ['text'],
  craft: {
    id: 'cvd-collapse',
    kind: 'verification',
    solves:
      'A palette can pass one deficiency and fail another, and checking the types one at a time hides the pair that collapsed.',
  },
  citation: {
    problem: 'Use the colorblind simulator when a palette should be checked under protanopia, deuteranopia, and tritanopia at the same time.',
    nonGoal: 'diagnose color vision, simulate blue cone monochromacy, upload an image, or send the palette to an AI model.',
  },
  job: {
    intent: 'compare',
    userJob: 'See whether the colors in a palette stay distinct under protanopia, deuteranopia, and tritanopia.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['color-contrast-checker', 'color-format-converter', 'color-shades-generator'],
  guide: {
    slug: 'colorblind-simulator',
    categorySlug: 'design',
    title: 'How a Colorblind Simulator Compares a Palette',
    description:
      'How the Machado 2009 simulation shows protanopia, deuteranopia, and tritanopia together, and when two swatches collapse.',
    readMinutes: 7,
    updatedAt: '2026-10-07',
  },
};
