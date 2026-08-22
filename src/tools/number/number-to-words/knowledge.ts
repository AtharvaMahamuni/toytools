import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'number-to-words',
  title: 'Number to Words',
  category: 'number-utilities',
  summary: 'Spell any number out in English words or read words back into digits, with the hyphens, the short scale and the decimal reading handled for you.',
  primaryConcepts: ['Numbers in words'],
  secondaryConcepts: ['short scale', 'hyphenated compounds', 'amount in words', 'cheque', 'decimal reading'],
  intentGroups: {
    informational: ['What is the short scale?', 'How are decimals read aloud?'],
    howTo: ['How to write a number in words', 'How to write an amount on a cheque'],
    comparison: ['American style against British style', 'Short scale against long scale'],
    misconception: ['Not every compound takes a hyphen', 'A billion has not always meant the same thing'],
    troubleshooting: ['My amount had a currency symbol in it', 'The number is too large to spell'],
  },
  realWorldUseCases: [
    'Writing the amount line on a cheque so the figure cannot be altered',
    'Spelling a contract figure out longhand beside the digits',
    'Checking whether a legal document hyphenates twenty-one correctly',
    'Reading a large figure aloud without losing count of the zeros',
  ],
  commonMistakes: [
    'Hyphenating four-thousand, when only compound tens take the hyphen',
    'Reading 4.75 as four point seventy-five instead of digit by digit',
    'Pasting an amount with a currency symbol and thousands separators still attached',
  ],
  commonQuestions: [
    'Where does the hyphen go in a number written out?',
    'Should I write one hundred and five or one hundred five?',
    'How do I write an amount on a cheque?',
  ],
  usedWith: [
    { slug: 'roman-numeral-converter', reason: 'The other longhand way of writing a number', strength: 0.6 },
    { slug: 'percentage-calculator', reason: 'Work the figure out before spelling it', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'roman-numeral-converter', reason: 'When the document wants numerals rather than English' },
  ],
  nextSteps: [
    { slug: 'title-case-converter', reason: 'Case the spelled amount for a formal document', strength: 0.5 },
    { slug: 'binary-converter', reason: 'The same value in base two', strength: 0.3 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'number to words',
    'spell out numbers',
    'write numbers in words',
    'amount in words',
    'words to number',
    'short scale',
  ],
  entityAliases: ['number speller', 'amount in words'],
  inputs: ['number', 'words'],
  outputs: ['words', 'number'],
  difficulty: 'beginner',
  audience: ['writers', 'accountants', 'students'],
};
