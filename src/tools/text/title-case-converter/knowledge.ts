import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'title-case-converter',
  title: 'Title Case Converter',
  category: 'text-utilities',
  summary: 'Capitalize the first letter of each major word, the way headlines and titles are styled.',
  primaryConcepts: ['title case'],
  secondaryConcepts: ['headline capitalization', 'minor words', 'style guide', 'capitalize each word'],
  intentGroups: {
    informational: ['What is title case?', 'Which words stay lowercase in title case?'],
    howTo: ['How to title-case a headline', 'How to format a book or article title'],
    comparison: ['Title case vs sentence case', 'AP style vs Chicago style title case'],
    misconception: ['Title case is not simply capitalizing every word', 'Short words like "of" and "the" usually stay lowercase'],
    troubleshooting: ['A small word was capitalized when it should not be', 'Hyphenated words capitalized unexpectedly'],
  },
  realWorldUseCases: [
    'Formatting article and blog post headlines',
    'Styling book, song, or movie titles',
    'Making navigation labels and headings consistent',
    'Cleaning up titles pasted in random casing',
  ],
  commonMistakes: [
    'Capitalizing minor words (articles, short prepositions, conjunctions)',
    'Assuming all style guides title-case the same way',
  ],
  commonQuestions: [
    'Which words are left lowercase?',
    'Does it follow AP or Chicago style?',
    'How are hyphenated words treated?',
  ],
  usedWith: [
    { slug: 'sentence-case-converter', reason: 'Compare against modern sentence-style headlines', strength: 0.6 },
    { slug: 'word-counter', reason: 'Check headline length while styling it', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'sentence-case-converter', reason: 'Capitalize only the first word instead' },
    { slug: 'uppercase-converter', reason: 'Use all caps for a louder heading' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Normalize spacing in the finished title', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['title case converter', 'capitalize each word', 'headline case', 'title capitalization', 'heading case'],
  entityAliases: ['title case', 'headline case'],
  inputs: ['text'],
  outputs: ['title-cased text'],
  difficulty: 'beginner',
  audience: ['writers', 'editors', 'marketers', 'bloggers'],
};
