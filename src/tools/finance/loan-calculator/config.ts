import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'loan-calculator',
  name: 'Loan Calculator',
  seoTitle: 'Loan Calculator: EMI, Mortgage and Amortization',
  description:
    'Work out the monthly payment or EMI on a home loan, the total interest, and what an extra payment saves. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Monthly payment, total interest, and what an extra payment saves.',
  categorySlug: 'money-finance',
  tags: [
    'loan calculator',
    'emi calculator',
    'monthly payment calculator',
    'loan interest calculator',
    'home loan calculator',
    'mortgage calculator',
  ],
  updatedAt: '2026-10-21',
  addedOn: '2026-10-21',
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'interest',
  processorId: 'loan',
  relatedTools: ['compound-interest-calculator', 'sip-calculator'],
  craft: {
    id: 'loan-rate-unit',
    kind: 'guardrail',
    solves:
      'A monthly rate such as 2 typed into the yearly field makes the interest nearly disappear, and nothing says the field is a percent per year.',
  },
  methodology: {
    name: 'Standard fixed-rate amortization',
    detail:
      'The payment clears the balance in equal months at a yearly rate divided by twelve. An extra payment reduces principal and is not taken off the next installment.',
  },
  citation: {
    problem:
      'Use the Loan Calculator to work out the monthly payment and the interest on a fixed-rate loan, on this device.',
    nonGoal: 'quote a lender rate, include taxes or insurance, or send the loan amount to a server.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Work out the monthly payment and the interest on a fixed-rate loan, on this device.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'medium',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  guide: {
    slug: 'loan-calculator',
    categorySlug: 'finance',
    title: 'How a Fixed-Rate Loan Payment Works',
    description:
      'The monthly payment formula, what a down payment changes, and how an extra payment cuts interest.',
    readMinutes: 6,
    updatedAt: '2026-10-21',
  },
};
