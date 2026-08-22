import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'binary-converter',
  name: 'Binary Converter',
  seoTitle: 'Binary Converter: Decimal to Binary and Back',
  description: 'Convert a number to base 2 and binary back to a number, with hex, octal and the bit count alongside. Exact past 2^53, and it cleans up 0b prefixes.',
  tagline: 'Decimal to binary and back, with hex and octal alongside.',
  categorySlug: 'number-utilities',
  tags: ['binary converter', 'decimal to binary', 'binary to decimal', 'number to binary', 'binary calculator', 'base converter', 'hex and binary'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'numeral',
  processorId: 'number-base',
  craft: {
    id: 'base-recover',
    kind: 'recovery',
    solves:
      'Binary is almost never copied bare. It arrives as 0b1010 out of source, as 1010 1100 out of a datasheet, or as 1010_1100 out of a literal, and all three are a parse failure in a tool whose entire job is reading binary. Decimals arrive carrying thousands separators for the same reason.',
  },
  relatedTools: ['binary-text-converter', 'hex-encoder-decoder', 'roman-numeral-converter', 'number-to-words'],
  keywords: ['base 2', 'bit width', 'hex and octal'],
  inputs: ['number', 'binary'],
  outputs: ['binary', 'number'],
  guide: {
    slug: 'binary-converter',
    categorySlug: 'number',
    title: 'Decimal, Binary and Hex, and Why Bit Width Matters',
    description: 'How place value works in base two, why one hex digit is exactly four bits, what leading zeros are for, and how this differs from converting text to binary.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
