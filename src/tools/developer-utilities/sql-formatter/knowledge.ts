import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sql-formatter',
  title: 'SQL Formatter',
  category: 'developer-utilities',
  summary: 'Pretty-print messy SQL with uppercase keywords and indented clauses, entirely in the browser.',
  primaryConcepts: ['SQL formatting'],
  secondaryConcepts: ['pretty print sql', 'sql beautifier', 'format sql', 'beautify sql'],
  intentGroups: {
    informational: ['What does the SQL Formatter change?', 'Which SQL dialects are supported?'],
    howTo: ['How to format a one-line SQL query', 'How to pretty-print SQL with joins'],
    comparison: ['SQL formatter vs uploading to a web service', 'Pretty-print vs minify SQL'],
    misconception: ['Formatting changes query meaning', 'Keyword case matters to the database'],
    troubleshooting: ['Unclosed quoted string in SQL', 'Password warning while formatting SQL'],
  },
  realWorldUseCases: [
    'Cleaning a one-line query copied from an application log',
    'Making a long JOIN readable before a code review',
    'Checking a query from a ticket without pasting it into an upload site',
  ],
  commonMistakes: [
    'Pasting a query that still contains a live password into an online formatter that uploads text',
    'Expecting the formatter to rewrite or optimise the query plan',
  ],
  commonQuestions: [
    'What does the SQL Formatter change?',
    'Is my query sent to a server?',
    'Why should I avoid pasting queries with credentials into upload sites?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format JSON results returned by the query', strength: 0.55 },
    { slug: 'regex-tester', reason: 'Test a LIKE or regexp pattern used in the WHERE clause', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'json-formatter', reason: 'Pretty-print JSON instead of SQL' },
  ],
  nextSteps: [
    { slug: 'json-formatter', reason: 'Format the JSON payload the query returns', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['sql formatter', 'format sql', 'pretty print sql', 'sql beautifier'],
  entityAliases: ['sql pretty print', 'beautify sql'],
  inputs: ['sql query text'],
  outputs: ['formatted sql'],
  difficulty: 'beginner',
};
