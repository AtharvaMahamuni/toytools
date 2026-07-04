// Finance domain concepts — finance's data for the platform concept registry. Models the ideas behind
// the tools and how they relate, strengthening the knowledge graph, guides, FAQs, and research links.

import { buildConceptRegistry, type Concept } from '@lib/concepts/types';

export const FINANCE_CONCEPTS: Concept[] = [
  {
    id: 'compound-interest',
    term: 'Compound interest',
    definition: 'Interest calculated on both the original principal and the accumulated interest, so growth accelerates over time.',
    relatedConcepts: ['time-value-of-money', 'cagr', 'rule-of-72', 'inflation'],
    aliases: ['compounding', 'interest on interest'],
  },
  {
    id: 'time-value-of-money',
    term: 'Time value of money',
    definition: 'The principle that a sum today is worth more than the same sum in the future because it can earn returns.',
    relatedConcepts: ['compound-interest', 'inflation', 'real-return'],
    aliases: ['TVM'],
  },
  {
    id: 'inflation',
    term: 'Inflation',
    definition: 'The general rise in prices over time, which reduces the purchasing power of money.',
    relatedConcepts: ['real-return', 'time-value-of-money', 'purchasing-power'],
    aliases: ['rising prices', 'cost of living'],
  },
  {
    id: 'purchasing-power',
    term: 'Purchasing power',
    definition: 'How much a fixed amount of money can actually buy, which inflation erodes over time.',
    relatedConcepts: ['inflation', 'real-return'],
  },
  {
    id: 'real-return',
    term: 'Real return',
    definition: 'An investment return adjusted for inflation, showing the true gain in purchasing power.',
    relatedConcepts: ['inflation', 'compound-interest'],
    aliases: ['inflation-adjusted return'],
  },
  {
    id: 'cagr',
    term: 'CAGR',
    definition: 'Compound annual growth rate: the constant yearly rate that takes a value from start to end over a period.',
    relatedConcepts: ['compound-interest', 'rule-of-72', 'roi', 'annualized-return'],
    aliases: ['compound annual growth rate'],
  },
  {
    id: 'roi',
    term: 'Return on investment',
    definition: 'The percentage gain or loss on an investment relative to what it cost, ignoring how long the money was invested.',
    relatedConcepts: ['cagr', 'annualized-return', 'compound-interest'],
    aliases: ['ROI', 'investment return'],
  },
  {
    id: 'annualized-return',
    term: 'Annualized return',
    definition: 'A return restated as the constant yearly rate that would produce the same overall result over the holding period.',
    relatedConcepts: ['roi', 'cagr'],
    aliases: ['annual return', 'per-year return'],
  },
  {
    id: 'rule-of-72',
    term: 'Rule of 72',
    definition: 'A shortcut estimating doubling time by dividing 72 by the annual percentage growth rate.',
    relatedConcepts: ['compound-interest', 'cagr'],
  },
  {
    id: 'emergency-fund',
    term: 'Emergency fund',
    definition: 'Cash savings, usually three to six months of expenses, set aside to cover unexpected costs or loss of income.',
    relatedConcepts: ['savings-goal'],
    aliases: ['rainy day fund', 'safety net'],
  },
  {
    id: 'savings-goal',
    term: 'Savings goal',
    definition: 'A target amount to reach by a date, used to work out how much to set aside each month.',
    relatedConcepts: ['emergency-fund', 'compound-interest'],
  },
];

export const FINANCE_CONCEPT_MAP = buildConceptRegistry(FINANCE_CONCEPTS);
