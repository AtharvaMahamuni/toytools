import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'number-to-words',
  name: 'Number to Words',
  seoTitle: 'Number to Words Converter: Spell Any Number Out',
  description: 'Write numbers in words, or read the words back into digits. Handles decimals, negatives and amounts to quadrillions, and cleans up a pasted figure.',
  tagline: 'Spell a number out in English words, or read the words back.',
  categorySlug: 'number-utilities',
  tags: ['number to words', 'number to words converter', 'spell out numbers', 'write numbers in words', 'amount in words', 'words to number', 'number spelling'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'numeral',
  processorId: 'number-words',
  craft: {
    id: 'words-recover',
    kind: 'recovery',
    solves:
      'Amounts arrive copied out of a spreadsheet cell, an invoice line or a bank statement, wearing a currency symbol and thousands separators. Every one of those characters is a parse failure, so a tool whose only job is spelling out an amount rejects the exact shape an amount normally arrives in.',
  },
  relatedTools: ['roman-numeral-converter', 'binary-converter', 'percentage-calculator'],
  keywords: ['amount in words', 'cheque', 'short scale'],
  inputs: ['number', 'words'],
  outputs: ['words', 'number'],
  guide: {
    slug: 'number-to-words',
    categorySlug: 'number',
    title: 'Writing Numbers Out in Words',
    description: 'Where the hyphen goes, why American English drops the and, how decimals are read aloud, and what a cheque amount line has to contain.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
