import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'word-frequency-counter',
  title: 'Word Frequency Counter',
  category: 'text-utilities',
  summary: 'Count how many times each word appears in a text, with percentages, frequency or alphabetical sorting, and a stop-word filter.',
  primaryConcepts: ['word frequency'],
  secondaryConcepts: ['stop words', 'keyword density', 'tokenization', 'unique words'],
  intentGroups: {
    informational: ['What is word frequency analysis?', 'What are stop words?'],
    howTo: ['How to count word occurrences in a text', 'How to find the most used words'],
    comparison: ['Word frequency vs word count', 'Raw counts vs percentage share'],
    misconception: ['Case differences do not make different words', 'High frequency does not mean high importance'],
    troubleshooting: ['Unique word count differs between tools', 'Common words drown out the meaningful ones'],
  },
  realWorldUseCases: [
    'Catching overused words before publishing a draft',
    'Checking keyword density in an article for SEO',
    'Profiling vocabulary in a document or corpus',
    'Mining customer feedback for recurring terms',
  ],
  commonMistakes: [
    'Reading raw counts instead of percentage share when comparing texts of different lengths',
    'Leaving stop words in and concluding "the" is the theme',
  ],
  commonQuestions: [
    'What does a word frequency counter do?',
    'What does the hide common words filter remove?',
    'What is keyword density?',
  ],
  usedWith: [
    { slug: 'word-counter', reason: 'Get the overall totals next to the per-word breakdown', strength: 0.8 },
    { slug: 'remove-duplicate-lines', reason: 'Deduplicate list data before counting terms', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'word-counter', reason: 'Totals and reading time instead of a per-word table' },
  ],
  nextSteps: [
    { slug: 'word-counter', reason: 'Check length and reading time of the same text', priority: 1 },
    { slug: 'find-replace', reason: 'Replace the overused words the ranking exposed', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['word frequency counter', 'word frequency', 'count word occurrences', 'most used words', 'keyword density'],
  entityAliases: ['word frequency analysis', 'word occurrence counter', 'frequency counter'],
  inputs: ['text'],
  outputs: ['word frequency table', 'unique word count'],
  difficulty: 'beginner',
  audience: ['writers', 'seo specialists', 'students'],
};
