import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'discount-calculator',
  title: 'Discount Calculator',
  category: 'number-utilities',
  summary: 'Find the sale price and your savings from a percentage or fixed-amount discount on any price.',
  primaryConcepts: ['discount calculation', 'sale price'],
  secondaryConcepts: ['percent off', 'savings', 'markdown', 'final price'],
  intentGroups: {
    informational: ['What is the sale price after a discount?', 'How much do I save on a sale?'],
    howTo: ['How to calculate a percentage discount', 'How to work out a fixed amount off', 'How to find the final price after a discount'],
    comparison: ['Percentage off vs fixed amount off', 'Which discount saves more?'],
    misconception: ['Stacking two percentage discounts is not the same as adding them together'],
    troubleshooting: ['The final price looks too low', 'Discount larger than the price'],
  },
  realWorldUseCases: [
    'Working out the sale price of a discounted item',
    'Comparing a percent-off coupon against a fixed-dollar coupon',
    'Checking how much a seasonal sale actually saves',
    'Budgeting a purchase before heading to checkout',
  ],
  commonMistakes: [
    'Adding stacked percentage discounts instead of applying them in sequence',
    'Applying the discount to the price including tax rather than the listed price',
  ],
  commonQuestions: [
    'How do I calculate a percentage discount?',
    'What is the difference between percent off and amount off?',
    'How much will I save?',
  ],
  usedWith: [
    { slug: 'percentage-calculator', reason: 'Work out the underlying percentage math', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'percentage-calculator', reason: 'General-purpose percentage calculations' },
  ],
  nextSteps: [
    { slug: 'percentage-calculator', reason: 'Calculate other percentages like tips or tax', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['discount calculator', 'sale price calculator', 'percent off', 'how much you save', 'price after discount'],
  entityAliases: ['sale price calculator', 'percent off calculator', 'markdown calculator'],
};
