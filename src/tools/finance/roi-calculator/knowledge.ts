import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'roi-calculator',
  title: 'ROI Calculator',
  category: 'money-finance',
  summary: 'Work out the percentage return on an investment from its cost and final value, with the annualized rate for the holding period.',
  primaryConcepts: ['return on investment'],
  secondaryConcepts: ['annualized return', 'net gain', 'holding period', 'investment performance'],
  intentGroups: {
    informational: ['What is ROI?', 'What counts as a good return on investment?'],
    howTo: ['How to calculate ROI from cost and sale price', 'How to annualize a return'],
    comparison: ['ROI vs CAGR', 'Total return vs annualized return'],
    misconception: ['A big ROI is not impressive without knowing the holding period', 'ROI before fees and taxes overstates the real result'],
    troubleshooting: ['My ROI looks wrong after adding dividends', 'Why the annualized figure disappears on a total loss'],
  },
  realWorldUseCases: [
    'Checking what a stock position actually returned after selling',
    'Comparing a property sale against what an index fund would have done',
    'Judging whether a side project repaid the money put into it',
    'Restating a multi-year gain as a yearly rate for comparison',
  ],
  commonMistakes: [
    'Comparing raw ROI figures across different holding periods',
    'Leaving fees, taxes, and dividends out of the cost and final value',
  ],
  commonQuestions: [
    'How is ROI calculated?',
    'What is the difference between ROI and annualized return?',
    'Does ROI account for how long I held the investment?',
  ],
  usedWith: [
    { slug: 'cagr-calculator', reason: 'Restate the same growth as a clean annual rate', strength: 0.9 },
    { slug: 'inflation-calculator', reason: 'Check what the gain is worth in real purchasing power', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'cagr-calculator', reason: 'Start from start and end values when you care about the yearly rate' },
  ],
  nextSteps: [
    { slug: 'cagr-calculator', reason: 'Turn the total return into an annual growth rate', priority: 1 },
    { slug: 'compound-interest-calculator', reason: 'Project what the proceeds could grow into next', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['roi calculator', 'return on investment', 'investment return', 'annualized return', 'net gain'],
  entityAliases: ['roi', 'return on investment', 'investment return'],
  inputs: ['amount invested', 'final value', 'holding period'],
  outputs: ['roi percentage', 'net gain', 'annualized return'],
  difficulty: 'beginner',
  audience: ['investors', 'finance'],
};
