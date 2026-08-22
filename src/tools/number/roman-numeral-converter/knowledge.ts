import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'roman-numeral-converter',
  title: 'Roman Numeral Converter',
  category: 'number-utilities',
  summary: 'Convert numbers to Roman numerals and back, read the non-standard spellings found on clocks and monuments, and get the modern form offered in one tap.',
  primaryConcepts: ['Roman numerals'],
  secondaryConcepts: ['subtractive notation', 'MCMXCIX', 'clock faces', 'vinculum', 'numeral date'],
  intentGroups: {
    informational: ['What is subtractive notation?', 'What year is MCMXCIX?'],
    howTo: ['How to convert a number to a Roman numeral', 'How to read a Roman numeral date'],
    comparison: ['Roman numerals against the decimal system', 'Additive spelling against subtractive'],
    misconception: ['IC is not a valid way to write 99', 'Clock faces do not use standard numerals'],
    troubleshooting: ['My numeral was rejected', 'The result is over 3999'],
  },
  realWorldUseCases: [
    'Reading the copyright year off a film credit or a book title page',
    'Writing a chapter number or an appendix label for a document',
    'Checking a tattoo or engraving date before it becomes permanent',
    'Working out which Super Bowl or monarch a numeral refers to',
  ],
  commonMistakes: [
    'Writing IC for 99 instead of XCIX, which no Roman ever used',
    'Copying the IIII from a clock face and expecting it to round trip',
    'Assuming numerals go past 3999 without the overbar the notation needs',
  ],
  commonQuestions: [
    'What year is MCMXCIX?',
    'Why do clock faces use IIII instead of IV?',
    'Why do Roman numerals stop at 3999?',
  ],
  usedWith: [
    { slug: 'number-to-words', reason: 'The other way of writing a number out longhand', strength: 0.7 },
    { slug: 'binary-converter', reason: 'The same number in another notation', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'number-to-words', reason: 'When you want the number spelled in English instead' },
  ],
  nextSteps: [
    { slug: 'number-to-words', reason: 'Spell the converted value out in words', strength: 0.6 },
    { slug: 'scientific-calculator', reason: 'Do arithmetic on the decimal value', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'roman numeral converter',
    'roman numerals',
    'number to roman numeral',
    'roman numeral date',
    'subtractive notation',
    'MCMXCIX',
  ],
  entityAliases: ['roman numeral translator'],
  inputs: ['number', 'roman numeral'],
  outputs: ['roman numeral', 'number'],
  difficulty: 'beginner',
  audience: ['students', 'writers', 'everyone'],
};
