import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'margin-calculator',
  title: 'Margin Calculator',
  category: 'number-utilities',
  summary: 'Calculate gross margin percentage, gross profit, and markup from a cost price and selling price.',
  primaryConcepts: ['gross margin', 'gross profit'],
  secondaryConcepts: ['markup', 'profit percentage', 'retail pricing', 'markdown'],
  intentGroups: {
    informational: ['What is gross margin?', 'What is the difference between margin and markup?'],
    howTo: ['How to calculate gross margin', 'How to find profit margin from cost and price', 'How to calculate markup percentage'],
    comparison: ['Margin vs markup — which is higher?', 'Gross margin vs net margin'],
    misconception: ['Margin and markup are not the same percentage', 'A 50% markup is not a 50% margin'],
    troubleshooting: ['Margin is negative — selling below cost', 'Markup shows – when cost is zero'],
  },
  realWorldUseCases: [
    'Pricing products for retail to hit a target margin',
    'Comparing profitability across product lines',
    'Checking whether a sale price covers costs and overhead',
    'Reverse-engineering a selling price from a target margin',
  ],
  commonMistakes: [
    'Confusing margin (based on price) with markup (based on cost)',
    'Using the same percentage for both margin and markup',
    'Applying margin to cost price instead of selling price',
  ],
  commonQuestions: [
    'What is gross margin?',
    'How is margin different from markup?',
    'What is a good profit margin?',
  ],
  usedWith: [
    { slug: 'percentage-calculator', reason: 'General percentage math', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'percentage-calculator', reason: 'General-purpose percentage calculations' },
  ],
  nextSteps: [
    { slug: 'percentage-calculator', reason: 'Calculate tips, tax, or other percentages', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['margin calculator', 'gross margin calculator', 'profit margin calculator', 'markup calculator', 'gross profit', 'margin vs markup'],
  entityAliases: ['profit margin calculator', 'gross margin tool', 'markup calculator'],
};
