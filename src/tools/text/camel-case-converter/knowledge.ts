import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'camel-case-converter',
  title: 'camelCase Converter',
  category: 'text-utilities',
  summary: 'Convert text to camelCase, the identifier style used for variables and keys in JavaScript and JSON.',
  primaryConcepts: ['camelCase'],
  secondaryConcepts: ['identifier naming', 'JavaScript variables', 'JSON keys', 'PascalCase'],
  intentGroups: {
    informational: ['What is camelCase?', 'Where is camelCase used in code?'],
    howTo: ['How to convert a label to a camelCase variable name', 'How to turn a phrase into a JSON key'],
    comparison: ['camelCase vs PascalCase', 'camelCase vs snake_case'],
    misconception: ['camelCase starts lowercase; capitalized first letter is PascalCase', 'Acronyms need a casing decision (Id vs ID)'],
    troubleshooting: ['Numbers split my identifier oddly', 'An acronym kept all caps unexpectedly'],
  },
  realWorldUseCases: [
    'Naming variables and functions in JavaScript or Java',
    'Generating JSON property keys from human labels',
    'Converting column headers into code-friendly field names',
    'Turning a feature description into an identifier',
  ],
  commonMistakes: [
    'Capitalizing the first letter, which makes it PascalCase instead',
    'Leaving spaces or punctuation that break the identifier',
  ],
  commonQuestions: [
    'What is the difference between camelCase and PascalCase?',
    'How are acronyms and numbers handled?',
    'Can I convert snake_case into camelCase here?',
  ],
  usedWith: [
    { slug: 'snake-case-converter', reason: 'Switch between code naming styles', strength: 0.7 },
    { slug: 'find-replace', reason: 'Apply the new identifier across a snippet', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'snake-case-converter', reason: 'Use snake_case for Python or SQL instead' },
    { slug: 'kebab-case-converter', reason: 'Use kebab-case for URLs and CSS class names' },
  ],
  nextSteps: [
    { slug: 'snake-case-converter', reason: 'Produce a snake_case variant for other languages', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['camelcase converter', 'camel case', 'variable name', 'json key case', 'identifier case'],
  entityAliases: ['camelcase', 'camel case'],
  inputs: ['text'],
  outputs: ['camelCase text'],
  difficulty: 'intermediate',
  audience: ['developers', 'data engineers'],
};
