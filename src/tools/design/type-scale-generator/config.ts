import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'type-scale-generator',
  name: 'Type Scale Generator',
  seoTitle: 'Type Scale Generator: Modular Font Sizes in rem',
  description:
    'A CSS type ramp for typography: modular font sizes from a base and a ratio, golden ratio included, in rem. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Font sizes from a ratio, in rem and CSS variables.',
  categorySlug: 'design-tools',
  tags: ['type scale generator', 'modular scale', 'font size scale', 'golden ratio typography', 'css type scale', 'rem'],
  updatedAt: '2026-10-05',
  addedOn: '2026-10-02',
  trustVariant: 'private',
  engine: 'units',
  pattern: 'unit-convert',
  family: 'type-scale',
  inputs: ['number'],
  outputs: ['text'],
  craft: {
    id: 'type-scale-bounds',
    kind: 'guardrail',
    solves:
      'A modular step under 12px or a display size past 64px still gets printed, and a phone cannot read either one.',
  },
  citation: {
    problem: 'Use Type Scale Generator when a base size and a ratio should become rem steps and CSS variables.',
    nonGoal: 'match a published design-system ramp, pick a font family, or send the sizes to an AI model.',
  },
  job: {
    intent: 'generate',
    userJob: 'Generate a modular type scale from a base size and a ratio, as rem values and CSS variables.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['px-to-rem-converter', 'aspect-ratio-calculator'],
  guide: {
    slug: 'type-scale-generator',
    categorySlug: 'design',
    title: 'How to Build a Modular Type Scale in CSS',
    description:
      'How a base size and a ratio become caption-to-display steps in rem, and when a step is too small or too large for a phone.',
    readMinutes: 6,
    updatedAt: '2026-10-05',
  },
};
