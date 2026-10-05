import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'triangle-solver',
  name: 'Triangle Solver',
  seoTitle: 'Triangle Calculator: Law of Sines and Cosines',
  description:
    'Solve SSS, SAS, ASA, AAS or SSA triangles with trig: the law of sines, cosines, or the Pythagorean theorem. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Enter any three parts and see the triangle drawn to scale.',
  categorySlug: 'applied-math',
  tags: [
    'triangle calculator',
    'law of sines',
    'law of cosines',
    'pythagorean theorem',
    'ambiguous case',
  ],
  updatedAt: '2026-10-05',
  addedOn: '2026-10-02',
  trustVariant: 'private',
  engine: 'math',
  pattern: 'math-calculate',
  family: 'triangles',
  processorId: 'triangle',
  inputs: ['number'],
  outputs: ['metric'],
  craft: {
    id: 'triangle-ssa-pair',
    kind: 'orientation',
    solves:
      'Two sides and a non-included angle can fit two triangles, and a solver that prints only the acute one hides the obtuse triangle.',
  },
  citation: {
    problem: 'Use Triangle Solver when three sides or angles should produce the missing parts on a figure drawn to scale.',
    nonGoal: 'compute area or perimeter, take angles in radians, or send the measurements to an AI model.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Enter any three parts of a triangle and see the other sides and angles drawn to scale.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['unit-circle-calculator', 'quadratic-equation-solver', 'fraction-calculator'],
  guide: {
    slug: 'triangle-solver',
    categorySlug: 'applied-math',
    title: 'How to Solve a Triangle from Three Parts',
    description:
      'Which three parts determine a triangle, how the law of sines and the law of cosines are used, and why SSA can return two answers.',
    readMinutes: 7,
    updatedAt: '2026-10-05',
  },
};
