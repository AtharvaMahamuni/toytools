import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'binary-converter',
  title: 'Binary Converter',
  category: 'number-utilities',
  summary: 'Convert a number to base two and back exactly, with hex, octal and the bit count alongside, and the prefixes and separators binary arrives wearing cleaned off.',
  primaryConcepts: ['Binary numbers'],
  secondaryConcepts: ['base 2', 'bit width', 'hexadecimal', 'place value', 'leading zeros'],
  intentGroups: {
    informational: ['What is base 2?', 'What does bit width mean?'],
    howTo: ['How to convert decimal to binary', 'How to read binary back as a number'],
    comparison: ['Binary numbers against binary text', 'Binary against hexadecimal'],
    misconception: ['Leading zeros are not decoration', 'A binary number is not the same as a byte'],
    troubleshooting: ['My binary had a 0b prefix', 'The digits were separated by spaces'],
  },
  realWorldUseCases: [
    'Reading a permission mask or a feature flag out of a config file',
    'Checking a register value from a datasheet against what the code writes',
    'Working out which bits changed between two values during debugging',
    'Teaching place value by watching the bits shift as the number doubles',
  ],
  commonMistakes: [
    'Dropping the leading zeros, which makes two byte values impossible to line up',
    'Reaching for this when the job is converting text to bits, which is a different tool',
    'Trusting a converter that rounds past 2^53, where whole numbers stop being exact',
  ],
  commonQuestions: [
    'How do I convert a decimal number to binary?',
    'Why is hexadecimal used instead of binary?',
    'What is the difference between binary numbers and binary text?',
  ],
  usedWith: [
    { slug: 'hex-encoder-decoder', reason: 'Move the same value into and out of hex', strength: 0.7 },
    { slug: 'binary-text-converter', reason: 'When the input is characters rather than a number', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'binary-text-converter', reason: 'When you want the bits of a string, not of a number' },
  ],
  nextSteps: [
    { slug: 'hex-encoder-decoder', reason: 'Shorten the same bits into hex', strength: 0.6 },
    { slug: 'number-to-words', reason: 'Spell the decimal value out longhand', strength: 0.3 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'binary converter',
    'decimal to binary',
    'binary to decimal',
    'base 2',
    'bit width',
    'hex and octal',
  ],
  entityAliases: ['base converter', 'binary calculator'],
  inputs: ['number', 'binary'],
  outputs: ['binary', 'number'],
  difficulty: 'beginner',
  audience: ['developers', 'students'],
};
