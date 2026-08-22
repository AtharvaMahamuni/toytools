import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'character-map',
  title: 'Character Map',
  category: 'text-utilities',
  summary: 'Search hundreds of special characters by name, tap to copy the glyph, and take the HTML entity, CSS escape or JavaScript escape with it.',
  primaryConcepts: ['Special characters'],
  secondaryConcepts: ['code point', 'HTML entity', 'CSS escape', 'unicode', 'symbol picker'],
  intentGroups: {
    informational: ['What is a code point?', 'What is an HTML entity?'],
    howTo: ['How to copy a special character', 'How to write a symbol in CSS content'],
    comparison: ['Pasting the glyph against pasting an escape', 'A character map against an emoji picker'],
    misconception: ['A symbol is a character rather than a font', 'Two identical shapes are not the same character'],
    troubleshooting: ['The character became a question mark', 'My symbol will not paste into code'],
  },
  realWorldUseCases: [
    'Dropping a proper arrow or a degree sign into a document without hunting through a menu',
    'Getting the CSS escape for a bullet before writing a content rule',
    'Finding the right currency symbol for an invoice in another country',
    'Picking Greek letters for a formula in a document that has no equation editor',
  ],
  commonMistakes: [
    'Pasting a raw glyph into a file whose encoding cannot carry it',
    'Reaching for a lookalike ASCII character instead of the real symbol',
    'Writing a CSS escape without the space that ends it',
  ],
  commonQuestions: [
    'How do I copy a special character?',
    'What is the HTML entity for this symbol?',
    'Why did my character turn into a question mark?',
  ],
  usedWith: [
    { slug: 'html-entity-encoder-decoder', reason: 'Convert a whole block of text rather than one character', strength: 0.8 },
    { slug: 'invisible-character-detector', reason: 'Check text for characters that render as nothing', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'html-entity-encoder-decoder', reason: 'When you have text to convert rather than a character to find' },
  ],
  nextSteps: [
    { slug: 'remove-accents', reason: 'Strip diacritics back out for a slug or a filename', strength: 0.5 },
    { slug: 'invisible-character-detector', reason: 'Audit the result before shipping it', strength: 0.5 },
  ],
  workflowStage: ['input', 'transform'],
  keywords: [
    'character map',
    'special characters',
    'paste symbols',
    'unicode characters',
    'symbol picker',
    'html entity',
  ],
  entityAliases: ['symbol picker', 'special character picker'],
  inputs: ['search'],
  outputs: ['character', 'escape'],
  difficulty: 'beginner',
  audience: ['writers', 'developers', 'designers'],
};
