import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sentence-counter',
  title: 'Sentence Counter',
  category: 'text-utilities',
  summary: 'Count sentences in your text by detecting terminal punctuation, useful for readability and length checks.',
  primaryConcepts: ['sentence count'],
  secondaryConcepts: ['terminal punctuation', 'readability', 'average sentence length', 'sentence boundary detection'],
  intentGroups: {
    informational: ['What defines a sentence here?', 'How are sentence boundaries detected?'],
    howTo: ['How to count sentences in a paragraph', 'How to check average sentence length for readability'],
    comparison: ['Sentence count vs word count', 'Counting sentences vs counting clauses'],
    misconception: ['Abbreviations like "Dr." can be miscounted as sentence ends', 'A line break is not a sentence end'],
    troubleshooting: ['A decimal number split my sentence', 'An ellipsis was counted oddly'],
  },
  realWorldUseCases: [
    'Improving readability by shortening long sentences',
    'Meeting an abstract or summary length given in sentences',
    'Checking that a paragraph has enough supporting sentences',
    'Auditing AI or marketing copy for choppy or run-on rhythm',
  ],
  commonMistakes: [
    'Trusting the count blindly when text is full of abbreviations or decimals',
    'Confusing sentences with clauses joined by commas',
  ],
  commonQuestions: [
    'What punctuation ends a sentence?',
    'How are abbreviations and decimals handled?',
    'Can it measure average words per sentence?',
  ],
  usedWith: [
    { slug: 'word-counter', reason: 'Derive average words per sentence', strength: 0.7 },
    { slug: 'paragraph-counter', reason: 'See how sentences distribute across paragraphs', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'paragraph-counter', reason: 'Measure structure at the paragraph level instead' },
    { slug: 'word-counter', reason: 'Measure raw length by word rather than by sentence' },
  ],
  nextSteps: [
    { slug: 'find-replace', reason: 'Split run-on sentences after spotting them', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['sentence counter', 'count sentences', 'sentences in text', 'readability', 'average sentence length'],
  entityAliases: ['sentence count', 'sentences'],
  inputs: ['text'],
  outputs: ['sentence count'],
  difficulty: 'beginner',
  audience: ['writers', 'editors', 'students', 'teachers'],
};
