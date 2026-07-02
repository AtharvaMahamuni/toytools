import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'remove-emoji',
  title: 'Remove Emoji',
  category: 'text-utilities',
  summary: 'Strip every emoji and its invisible companion characters from text, keeping words, numbers, punctuation, and spacing intact.',
  primaryConcepts: ['emoji removal'],
  secondaryConcepts: ['unicode emoji', 'zwj sequences', 'variation selectors', 'text cleanup'],
  intentGroups: {
    informational: ['What counts as an emoji in Unicode?', 'Why is one emoji several characters?'],
    howTo: ['How to remove emoji from text', 'How to clean user-generated content of emoji'],
    comparison: ['Removing emoji vs removing all symbols', 'Emoji removal vs accent removal'],
    misconception: ['Text symbols like the trademark sign are not emoji', 'Deleting one character does not remove a whole emoji'],
    troubleshooting: ['Invisible characters left after deleting emoji', 'Double spaces after removal'],
  },
  realWorldUseCases: [
    'Cleaning user-generated content before storing or exporting it',
    'Preparing chat or social text for formal documents',
    'Normalizing strings before matching or deduplication',
    'Importing text into systems that cannot store emoji',
  ],
  commonMistakes: [
    'Deleting emoji by hand and leaving invisible joiners behind',
    'Stripping all non-ASCII characters and destroying accented words too',
  ],
  commonQuestions: [
    'What exactly does this tool remove?',
    'Are symbols like the trademark sign removed?',
    'Will accented letters or non-English text be affected?',
  ],
  usedWith: [
    { slug: 'remove-extra-spaces', reason: 'Collapse the doubled spaces emoji leave behind', strength: 0.8 },
    { slug: 'normalize-whitespace', reason: 'Flatten all leftover whitespace in one pass', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'remove-accents', reason: 'Fold accented letters instead of stripping emoji' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Tidy the spacing after emoji are gone', priority: 1 },
    { slug: 'word-counter', reason: 'Re-count the cleaned text', priority: 2 },
  ],
  workflowStage: ['transform'],
  keywords: ['remove emoji', 'emoji remover', 'strip emoji', 'delete emoji from text', 'clean emoji'],
  entityAliases: ['emoji remover', 'emoji cleaner', 'strip emoji'],
  inputs: ['text with emoji'],
  outputs: ['text without emoji'],
  difficulty: 'beginner',
  audience: ['writers', 'developers', 'data teams'],
};
