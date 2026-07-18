import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sentence-case-converter',
  title: 'Sentence Case Converter',
  category: 'text-utilities',
  summary: 'Capitalize only the first letter of each sentence, the clean style modern UIs and headlines prefer.',
  primaryConcepts: ['sentence case'],
  secondaryConcepts: ['first-letter capitalization', 'UI copy', 'modern headlines', 'proper nouns'],
  intentGroups: {
    informational: ['What is sentence case?', 'Why do product teams prefer sentence case?'],
    howTo: ['How to convert a heading to sentence case', 'How to fix text that is in random caps'],
    comparison: ['Sentence case vs title case', 'Sentence case vs lowercase'],
    misconception: ['Sentence case still keeps proper nouns capitalized', 'It is not the same as lowercasing everything'],
    troubleshooting: ['A proper noun got lowercased', 'Capitalization after abbreviations looked off'],
  },
  realWorldUseCases: [
    'Writing UI labels, buttons, and menu items in a modern style',
    'Converting shouty all-caps text back to readable form',
    'Standardizing headings to sentence case across a document',
    'Cleaning up text pasted in inconsistent capitalization',
  ],
  commonMistakes: [
    'Expecting it to preserve every proper noun automatically',
    'Confusing sentence case with simply making text lowercase',
  ],
  commonQuestions: [
    'Why do product teams prefer sentence case for UI copy?',
    'Are proper nouns still capitalized in sentence case?',
    'Is sentence case the same as making everything lowercase?',
  ],
  usedWith: [
    { slug: 'title-case-converter', reason: 'Compare against headline-style capitalization', strength: 0.6 },
    { slug: 'sentence-counter', reason: 'Verify sentence boundaries after recasing', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'title-case-converter', reason: 'Capitalize every major word instead' },
    { slug: 'lowercase-converter', reason: 'Flatten everything to lowercase' },
  ],
  nextSteps: [
    { slug: 'find-replace', reason: 'Fix any proper nouns the recasing lowercased', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['sentence case converter', 'capitalize first letter', 'sentence capitalization', 'fix all caps', 'ui copy case'],
  entityAliases: ['sentence case'],
  inputs: ['text'],
  outputs: ['sentence-cased text'],
  difficulty: 'beginner',
  audience: ['product writers', 'designers', 'editors'],
};
