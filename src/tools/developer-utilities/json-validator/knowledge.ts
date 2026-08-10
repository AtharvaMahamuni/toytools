import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-validator',
  title: 'JSON Validator',
  category: 'developer-utilities',
  summary: 'Check whether text is valid JSON and pinpoint the syntax error when it is not.',
  primaryConcepts: ['JSON validation'],
  secondaryConcepts: ['json', 'syntax check', 'json lint', 'rfc 8259'],
  intentGroups: {
    informational: ['What does JSON validation do?', 'What are the JSON syntax rules?'],
    howTo: ['How to find a JSON syntax error', 'How to validate a config file'],
    comparison: ['Syntax validation vs JSON Schema validation', 'JSON vs JavaScript object literals'],
    misconception: ['JSONC and JSON5 are not standard JSON'],
    troubleshooting: ['Trailing comma errors', 'Single quotes instead of double quotes', 'JSON.parse fails'],
  },
  realWorldUseCases: [
    'Diagnosing a 400 "invalid JSON" API error',
    'Checking a hand-edited package.json or tsconfig.json',
    'Validating a webhook payload from logs',
    'Catching JSON errors in CI before deploy',
  ],
  commonMistakes: [
    'Leaving a trailing comma after the last element',
    'Confusing syntax validation with schema validation',
  ],
  commonQuestions: [
    'Why are trailing commas invalid in JSON?',
    'Why can\'t JSON have comments?',
    'What is the difference between JSON and a JavaScript object?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format the JSON once it is valid', strength: 0.8 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'json-formatter', reason: 'Pretty-print the validated JSON', priority: 1 },
  ],
  workflowStage: ['validate'],
  keywords: ['json validator', 'validate json', 'json syntax check', 'json lint', 'check json'],
  entityAliases: ['json linter', 'json syntax checker'],
};
