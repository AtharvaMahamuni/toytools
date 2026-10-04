import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'color-shades-generator',
  name: 'Color Shades Generator',
  seoTitle: 'Tailwind Color Shades: Tints, 50 to 900',
  description:
    'A color scale of tints and shades you can copy as a 50 to 900 palette of CSS variables.',
  tagline: 'A 50 to 950 OKLCH scale, copied as CSS variables.',
  categorySlug: 'design-tools',
  tags: ['color shades generator', 'tints and shades', 'tailwind color shades', 'oklch palette'],
  updatedAt: '2026-10-02',
  addedOn: '2026-10-02',
  trustVariant: 'private',
  engine: 'color',
  pattern: 'color-convert',
  family: 'color-scale',
  inputs: ['text'],
  outputs: ['text'],
  craft: {
    id: 'shade-on-white',
    kind: 'guardrail',
    solves:
      'A 500 stop that looks fine in the row can fail WCAG 4.5 on white, and a scale that never says so ships an unreadable brand color.',
  },
  citation: {
    problem: 'Use Color Shades Generator when one color should become a 50 to 950 OKLCH scale of CSS variables.',
    nonGoal: 'match a published Tailwind build byte for byte, score contrast on every background, or send the color to an AI model.',
  },
  job: {
    intent: 'generate',
    userJob: 'Build a 50 to 950 tint and shade scale from one color, in OKLCH, and copy it as CSS.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['color-format-converter', 'color-contrast-checker'],
  guide: {
    slug: 'color-shades-generator',
    categorySlug: 'design',
    title: 'How to Build a 50 to 950 Color Scale in OKLCH',
    description:
      'How a tint and shade scale holds hue in OKLCH, why chroma drops at the ends, and when the brand stop fails on white.',
    readMinutes: 6,
    updatedAt: '2026-10-02',
  },
};
