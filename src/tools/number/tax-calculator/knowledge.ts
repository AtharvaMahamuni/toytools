import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'tax-calculator',
  title: 'Tax Calculator',
  category: 'number-utilities',
  summary: 'Add sales tax or VAT to a price, or back it out of a tax-inclusive total, with the tax shown.',
  primaryConcepts: ['sales tax'],
  secondaryConcepts: ['vat', 'tax rate', 'tax-inclusive price', 'reverse tax'],
  intentGroups: {
    informational: ['How is sales tax calculated?', 'What is a tax-inclusive price?'],
    howTo: ['How to add tax to a price', 'How to remove tax from a total'],
    comparison: ['Adding tax vs removing tax', 'Sales tax vs VAT'],
    misconception: ['Removing tax is not subtracting the same percentage', 'Tax is on the net price, not the gross'],
    troubleshooting: ['My reverse-tax total is off by a cent', 'Which figure is the rate applied to?'],
  },
  realWorldUseCases: [
    'Working out the final price a customer pays',
    'Backing out tax from a receipt to find the pre-tax amount',
    'Quoting a VAT-inclusive price from a net figure',
    'Checking the tax line on an invoice',
  ],
  commonMistakes: [
    'Removing tax by subtracting the rate instead of dividing by 1 plus the rate',
    'Applying the rate to a tax-inclusive total when adding tax',
  ],
  commonQuestions: [
    'How do I add sales tax to a price?',
    'How do I find the price before tax from a total?',
    'Why is reverse tax not just subtracting the percentage?',
  ],
  usedWith: [
    { slug: 'percentage-calculator', reason: 'Do the underlying percentage math directly', strength: 0.6 },
    { slug: 'discount-calculator', reason: 'Apply a discount before or after tax', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'percentage-calculator', reason: 'For general percent-of and percent-change math' },
    { slug: 'discount-calculator', reason: 'For price reductions rather than tax' },
  ],
  nextSteps: [
    { slug: 'discount-calculator', reason: 'Combine a discount with the tax calculation', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['tax calculator', 'sales tax calculator', 'vat calculator', 'add tax', 'reverse vat'],
  entityAliases: ['sales tax', 'vat', 'gst'],
  inputs: ['number', 'number'],
  outputs: ['total with or without tax, plus tax amount'],
  difficulty: 'beginner',
  audience: ['shoppers', 'small business owners', 'freelancers'],
};
