import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'savings-goal-calculator',
  title: 'Savings Goal Calculator',
  category: 'money-finance',
  summary: 'Work out how much to save each month to reach a goal by a target date, allowing for investment returns.',
  primaryConcepts: ['savings goal'],
  secondaryConcepts: ['monthly saving', 'sinking fund', 'investment return', 'time horizon'],
  intentGroups: {
    informational: ['What is a savings goal?', 'How do returns reduce what I need to save?'],
    howTo: ['How much should I save each month', 'How to plan saving for a goal'],
    comparison: ['Saving with returns vs saving in cash', 'Shorter vs longer time horizon'],
    misconception: ['A higher assumed return lowers the monthly saving but adds risk', 'Starting later sharply raises the monthly amount'],
    troubleshooting: ['My monthly amount is zero', 'My required saving seems too high'],
  },
  realWorldUseCases: [
    'Planning a house down payment',
    'Saving for a wedding or a car',
    'Setting a monthly transfer to hit a target',
    'Checking if a goal is realistic in the time available',
  ],
  commonMistakes: [
    'Assuming an unrealistic rate of return',
    'Forgetting to count current savings toward the goal',
  ],
  commonQuestions: [
    'How much should I save each month?',
    'How do investment returns change what I need to save?',
    'What happens if I start saving later?',
  ],
  usedWith: [
    { slug: 'compound-interest-calculator', reason: 'See how the balance compounds toward the goal', strength: 0.8 },
    { slug: 'emergency-fund-calculator', reason: 'Fund emergencies before other goals', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'compound-interest-calculator', reason: 'Project growth forward instead of solving for a monthly amount' },
  ],
  nextSteps: [
    { slug: 'emergency-fund-calculator', reason: 'Make sure emergencies are covered first', priority: 1 },
    { slug: 'inflation-calculator', reason: 'Adjust the goal for future prices', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['savings goal calculator', 'how much to save', 'monthly savings', 'savings target', 'sinking fund'],
  entityAliases: ['savings goal', 'savings target', 'monthly saving'],
  inputs: ['goal', 'current savings', 'rate', 'years'],
  outputs: ['monthly saving'],
  difficulty: 'beginner',
  audience: ['savers', 'finance'],
};
