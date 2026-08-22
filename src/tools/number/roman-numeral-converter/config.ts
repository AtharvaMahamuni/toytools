import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'roman-numeral-converter',
  name: 'Roman Numeral Converter',
  seoTitle: 'Roman Numeral Converter: Numbers to Roman and Back',
  description: 'Convert Roman numerals to numbers and back, from I to MMMCMXCIX. Reads a roman numeral date off a clock face or a film credit, then modernises it.',
  tagline: 'Numbers to Roman numerals and back, from I to MMMCMXCIX.',
  categorySlug: 'number-utilities',
  tags: ['roman numeral converter', 'roman numerals', 'convert roman numerals', 'number to roman numeral', 'roman numeral translator', 'roman numeral date', 'what year is MCMXCIX'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'numeral',
  processorId: 'roman',
  craft: {
    id: 'roman-canonical',
    kind: 'recovery',
    solves:
      'Numerals in the wild are not written the way a converter expects. Clock faces print IIII, Roman inscriptions print VIIII and old title pages print MDCCCCX. Each one reads back as the right number and then fails to round trip, so the reader carries a spelling nobody uses into whatever they were writing.',
  },
  relatedTools: ['number-to-words', 'binary-converter', 'scientific-calculator'],
  keywords: ['MCMXCIX', 'numeral', 'subtractive notation'],
  inputs: ['number', 'roman numeral'],
  outputs: ['roman numeral', 'number'],
  guide: {
    slug: 'roman-numeral-converter',
    categorySlug: 'number',
    title: 'Reading and Writing Roman Numerals Without Guessing',
    description: 'The six subtractive pairs, why IIII appears on clock faces, why the system stops at 3999, and how to read a copyright date off a film credit.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
