import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'remove-accents',
  title: 'Remove Accents',
  category: 'text-utilities',
  summary: 'Strip accents and diacritics from text while keeping the base letters, converting words like cafe and naive to plain ASCII.',
  primaryConcepts: ['remove accents'],
  secondaryConcepts: ['diacritics', 'combining marks', 'unicode normalization', 'plain ASCII'],
  intentGroups: {
    informational: ['What are diacritical marks?', 'What is Unicode normalization?'],
    howTo: ['How to convert accented text to plain ASCII', 'How to strip diacritics before an import'],
    comparison: ['Removing accents vs full transliteration', 'Stripping accents vs slugifying'],
    misconception: ['It keeps the base letter rather than deleting the character', 'It does not transliterate letters without a separable accent'],
    troubleshooting: ['A special letter stayed unchanged', 'Case and spacing were preserved as expected'],
  },
  realWorldUseCases: [
    'Preparing accented names for a legacy ASCII-only database',
    'Cleaning text before generating file names or usernames',
    'Normalising data so accented and unaccented entries match',
    'Making imported CSV values compatible with strict systems',
  ],
  commonMistakes: [
    'Expecting it to transliterate letters that have no separable accent',
    'Assuming it lowercases or reformats the text (it only removes marks)',
  ],
  commonQuestions: [
    'Does it keep the base letters?',
    'Will it change letters like ß?',
    'Does it alter case or spacing?',
  ],
  usedWith: [
    { slug: 'slugify-text', reason: 'Removing accents is the first step of building a URL slug', strength: 0.7 },
    { slug: 'lowercase-converter', reason: 'Lowercase the unaccented result for consistency', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'slugify-text', reason: 'Strip accents and also hyphenate into a URL slug' },
    { slug: 'normalize-whitespace', reason: 'Normalize spacing rather than accents' },
  ],
  nextSteps: [
    { slug: 'slugify-text', reason: 'Turn the plain text into a web-safe slug', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['remove accents', 'strip diacritics', 'remove diacritical marks', 'unaccent text', 'accents to plain text'],
  entityAliases: ['accents', 'diacritics', 'diacritical marks'],
  inputs: ['text'],
  outputs: ['plain ASCII text'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts', 'writers'],
};
