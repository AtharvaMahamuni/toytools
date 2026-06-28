import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'snake-case-converter',
  title: 'snake_case Converter',
  category: 'text-utilities',
  summary: 'Convert text to snake_case, the underscore-separated style common in Python, SQL, and config keys.',
  primaryConcepts: ['snake_case'],
  secondaryConcepts: ['underscore separator', 'Python naming', 'database columns', 'SCREAMING_SNAKE_CASE'],
  intentGroups: {
    informational: ['What is snake_case?', 'Where is snake_case the convention?'],
    howTo: ['How to convert a label to a snake_case column name', 'How to make an env-var-friendly key'],
    comparison: ['snake_case vs camelCase', 'snake_case vs SCREAMING_SNAKE_CASE'],
    misconception: ['snake_case is lowercase; all-caps is the constant variant', 'Spaces become underscores, not hyphens'],
    troubleshooting: ['Hyphens were not converted to underscores', 'Numbers attached to the wrong word'],
  },
  realWorldUseCases: [
    'Naming Python variables and functions',
    'Creating database column and table names',
    'Building configuration or environment-variable keys',
    'Normalizing spreadsheet headers into code fields',
  ],
  commonMistakes: [
    'Producing uppercase when a plain lowercase key was intended',
    'Mixing underscores and hyphens in the same identifier',
  ],
  commonQuestions: [
    'How is snake_case different from kebab-case?',
    'Does it lowercase everything automatically?',
    'How are existing underscores or hyphens handled?',
  ],
  usedWith: [
    { slug: 'camel-case-converter', reason: 'Switch between code naming styles', strength: 0.7 },
    { slug: 'find-replace', reason: 'Roll the new key through a file', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'camel-case-converter', reason: 'Use camelCase for JavaScript or JSON' },
    { slug: 'kebab-case-converter', reason: 'Use kebab-case for URLs and CSS' },
  ],
  nextSteps: [
    { slug: 'camel-case-converter', reason: 'Produce a camelCase variant for front-end code', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['snake case converter', 'snake_case', 'underscore case', 'python variable name', 'database column name'],
  entityAliases: ['snake case', 'snake_case', 'underscore case'],
  inputs: ['text'],
  outputs: ['snake_case text'],
  difficulty: 'intermediate',
  audience: ['developers', 'data engineers', 'analysts'],
};
