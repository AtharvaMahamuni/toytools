import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'triangle-solver',
  title: 'Triangle Solver',
  category: 'applied-math',
  summary:
    'Solve a triangle from any three parts with the law of sines, the law of cosines, and a figure drawn to scale.',
  primaryConcepts: ['law of sines'],
  secondaryConcepts: [
    'law of cosines',
    'Pythagorean theorem',
    'ambiguous case',
    'SSA',
    'ASA and AAS',
    'triangle inequality',
  ],
  intentGroups: {
    informational: [
      'what the law of sines and the law of cosines each need',
      'why three angles do not fix a triangle',
      'what the ambiguous SSA case is',
    ],
    howTo: [
      'solve a triangle from three sides',
      'find a missing angle with the law of cosines',
      'check a 3-4-5 triangle against the Pythagorean theorem',
    ],
    comparison: [
      'law of sines versus law of cosines',
      'one SSA triangle versus two',
    ],
    misconception: [
      'AAA determines a unique triangle',
      'SSA always has exactly one answer',
    ],
    troubleshooting: [
      'why three lengths fail the triangle inequality',
      'why an obtuse angle needs the longest opposite side',
    ],
  },
  realWorldUseCases: [
    'Finishing a homework triangle when the sheet gives SAS, ASA, or SSS and asks for the rest.',
    'Checking a 3-4-5 layout on a small build before trusting a square corner.',
    'Seeing both SSA triangles when a word problem gives two sides and a non-included angle.',
  ],
  commonMistakes: [
    'Entering three angles and expecting a side length.',
    'Taking only the acute SSA answer and missing the obtuse triangle.',
    'Pairing a side with the wrong opposite angle.',
  ],
  commonQuestions: [
    'How do I solve a triangle when I know only three parts?',
    'What is the ambiguous case in a triangle?',
    'Why will three angles not solve the triangle?',
    'How does the Pythagorean theorem show up here?',
  ],
  usedWith: [
    { slug: 'unit-circle-calculator', reason: 'Plot an angle in standard position after converting from radians', strength: 0.6 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'quadratic-equation-solver', reason: 'Solve a quadratic that showed up beside the triangle problem', strength: 0.4 },
    { slug: 'fraction-calculator', reason: 'Keep a side ratio exact instead of decimal', strength: 0.4 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'triangle calculator',
    'solve triangle',
    'law of cosines calculator',
    'law of sines calculator',
    'pythagorean theorem calculator',
  ],
  entityAliases: ['ambiguous case calculator', 'SSS SAS ASA triangle solver'],
  inputs: ['number'],
  outputs: ['metric'],
  difficulty: 'beginner',
  audience: ['students', 'teachers'],
};
