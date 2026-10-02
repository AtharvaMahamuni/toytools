import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'type-scale-generator',
  name: 'Type Scale Generator',
  seoTitle: 'Modular Type Scale: CSS Font Sizes and Golden Ratio',
  description:
    'A modular type scale of font sizes in px and rem, including a golden ratio, copied as CSS for typography.',
  tagline: 'Font sizes from a ratio, in rem and CSS variables.',
  categorySlug: 'design-tools',
  tags: ['modular', 'font', 'size', 'golden', 'ratio', 'typography', 'css', 'rem'],
  updatedAt: '2026-10-02',
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
    updatedAt: '2026-10-02',
  },
};
