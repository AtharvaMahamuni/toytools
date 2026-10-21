import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'loan-calculator',
  title: 'Loan Calculator',
  category: 'money-finance',
  summary:
    'Monthly payment and total interest for a fixed-rate loan, with a down payment and an extra payment that shortens the term.',
  primaryConcepts: ['loan calculator', 'EMI calculator'],
  secondaryConcepts: ['monthly payment', 'amortization', 'home loan', 'mortgage payment', 'extra payment'],
  intentGroups: {
    informational: ['What is a loan EMI?', 'How does fixed-rate amortization work?'],
    howTo: [
      'How to calculate a monthly loan payment',
      'How to see the interest an extra payment saves',
    ],
    comparison: ['Loan EMI vs compound interest', 'Home loan payment vs a personal loan'],
    misconception: [
      'A rate of 2 means 2% a year, not 2% a month',
      'An extra payment is taken off the principal, not off the next installment',
    ],
    troubleshooting: [
      'Why a very high yearly rate never pays the balance down',
      'Why the down payment leaves nothing to borrow',
    ],
  },
  realWorldUseCases: [
    'Checking the EMI on a personal loan before signing',
    'Comparing a 20 year and a 30 year home loan on the same price',
    'Seeing how much interest an extra monthly payment saves',
    'Separating the amount borrowed from a down payment',
  ],
  commonMistakes: [
    'Typing a monthly rate such as 2 into the yearly percent field',
    'Reading the term as months when the field is in years',
    'Treating an extra payment as a discount on the next installment',
  ],
  commonQuestions: [
    'How is the monthly payment calculated?',
    'What does a 2% rate mean on this page?',
    'Does an extra payment reduce interest?',
    'Does a home loan use a different formula?',
  ],
  usedWith: [
    { slug: 'compound-interest-calculator', reason: 'Compare the cost of borrowing with growth on a lump sum', strength: 0.7 },
    { slug: 'sip-calculator', reason: 'See what the same monthly amount could become if invested', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'compound-interest-calculator', reason: 'Start from a lump sum you are growing, not a balance you are paying down' },
  ],
  nextSteps: [
    { slug: 'sip-calculator', reason: 'Project the monthly payment as an investment instead', priority: 1 },
    { slug: 'compound-interest-calculator', reason: 'See compound growth on money you do not borrow', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'loan calculator',
    'emi calculator',
    'monthly payment calculator',
    'loan interest calculator',
    'loan emi calculator',
    'home loan calculator',
    'mortgage calculator',
    'amortization',
  ],
  entityAliases: ['emi', 'equated monthly installment', 'home loan', 'mortgage payment'],
  inputs: ['price or amount borrowed', 'down payment', 'yearly interest rate', 'term in years', 'extra monthly payment'],
  outputs: ['monthly payment', 'total interest', 'payoff time', 'interest saved'],
  difficulty: 'beginner',
  audience: ['borrowers', 'home buyers', 'personal finance'],
};
