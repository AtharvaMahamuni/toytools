import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'markup-calculator',
  title: 'Markup Calculator',
  category: 'number-utilities',
  summary: 'Work out markup percentage from cost and price, or the price for a target markup.',
  primaryConcepts: ['markup percentage'],
  secondaryConcepts: ['cost price', 'selling price', 'cost-plus pricing', 'profit'],
  intentGroups: {
    informational: ['What is markup?', 'What is the markup formula?'],
    howTo: ['How to calculate markup from cost and price', 'How to set a price from a target markup'],
    comparison: ['Markup vs margin', 'Markup vs profit'],
    misconception: ['Markup and margin are not the same percentage', 'A 100% markup is not a 100% margin'],
    troubleshooting: ['My markup looks higher than my margin', 'Cost of zero makes markup undefined'],
  },
  realWorldUseCases: [
    'Pricing a product as cost plus a fixed markup',
    'Checking the markup a supplier or competitor applies',
    'Converting a target margin into the markup to enter in a POS',
    'Estimating profit before setting a retail price',
  ],
  commonMistakes: [
    'Confusing markup (over cost) with margin (over price)',
    'Entering a margin target into a markup field, which inflates the price',
  ],
  commonQuestions: [
    'What is the difference between markup and margin?',
    'How do I price an item for a 50% markup?',
    'Why is markup always larger than the equivalent margin?',
  ],
  usedWith: [
    { slug: 'margin-calculator', reason: 'Compare the markup against the resulting margin', strength: 0.8 },
    { slug: 'percentage-calculator', reason: 'Do the underlying percentage math directly', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'margin-calculator', reason: 'Price by margin (percent of selling price) instead' },
    { slug: 'discount-calculator', reason: 'Work out a sale price reduction instead' },
  ],
  nextSteps: [
    { slug: 'margin-calculator', reason: 'See the margin your markup produces', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['markup calculator', 'markup percentage', 'markup formula', 'cost plus pricing', 'price from markup'],
  entityAliases: ['markup', 'mark up', 'markup percent'],
  inputs: ['number', 'number'],
  outputs: ['markup percentage or selling price'],
  difficulty: 'beginner',
  audience: ['retailers', 'small business owners', 'finance'],
};
