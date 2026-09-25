import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-schema-validator',
  title: 'JSON Schema Validator',
  category: 'prep',
  summary: 'Check JSON against a listed set of schema keywords, and name the keywords that are not checked.',
  primaryConcepts: ['JSON Schema validation'],
  secondaryConcepts: ['required properties', 'json types', 'schema keywords'],
  intentGroups: {
    informational: ['Which JSON Schema keywords does this page check?', 'What does Valid mean here?'],
    howTo: ['How to validate JSON against a schema locally', 'How to read a missing required property'],
    comparison: ['Syntax validation vs schema validation', 'A checked keyword vs one this page skips'],
    misconception: ['Valid does not mean every keyword was applied', 'This page is not a model judging the data'],
    troubleshooting: ['Schema pane is not valid JSON', 'format was ignored'],
  },
  realWorldUseCases: [
    'Checking a model reply against a small schema before you trust the shape',
    'Seeing which required field is missing',
    'Confirming a number is an integer and inside a bound',
  ],
  commonMistakes: [
    'Reading Valid as a full draft 2020-12 pass',
    'Putting the data in the schema pane',
    'Expecting format or pattern to be enforced',
  ],
  commonQuestions: [
    'Which schema keywords are checked?',
    'What happens to an unknown keyword?',
    'Is the JSON uploaded?',
  ],
  usedWith: [
    { slug: 'json-to-schema', reason: 'Draft a schema from an example, then check another value', strength: 0.8 },
    { slug: 'json-formatter', reason: 'Pretty-print either pane before you read an error path', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'json-validator', reason: 'Check JSON syntax only, with no schema' },
  ],
  nextSteps: [],
  workflowStage: ['validate'],
  keywords: ['json schema validator', 'validate json'],
  entityAliases: ['schema checker'],
  inputs: ['json'],
  outputs: ['text'],
  difficulty: 'intermediate',
  audience: ['developers'],
};
