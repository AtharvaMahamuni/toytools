import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-to-schema',
  title: 'JSON to JSON Schema',
  category: 'prep',
  summary: 'Build a JSON Schema from the types in one example, without required fields or guessed formats.',
  primaryConcepts: ['JSON Schema'],
  secondaryConcepts: ['json types', 'example schema', 'object properties'],
  intentGroups: {
    informational: ['What can one JSON example tell a schema?', 'What is an integer versus a number here?'],
    howTo: ['How to draft a schema from a sample payload', 'How to read an empty array in the result'],
    comparison: ['A type from an example vs a required field', 'JSON Schema vs JSON validation'],
    misconception: ['A string example is not a format', 'Presence in one object does not mean required'],
    troubleshooting: ['Invalid JSON produces no schema', 'Mixed array items become a union of types'],
  },
  realWorldUseCases: [
    'Drafting a schema from a payload a model returned',
    'Seeing the shape of a minified JSON blob before you write checks',
    'Confirming an example is an object of strings and numbers',
  ],
  commonMistakes: [
    'Treating the result as a complete contract',
    'Expecting a person-name format from a string',
    'Expecting required because the key was in the sample',
  ],
  commonQuestions: [
    'What does JSON to JSON Schema infer?',
    'Are fields marked required?',
    'Is the JSON uploaded?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Pretty-print the example before reading the schema', strength: 0.7 },
    { slug: 'json-schema-validator', reason: 'Check another value against the schema you just drafted', strength: 0.8 },
  ],
  alternatives: [
    { slug: 'json-validator', reason: 'Check that the text is JSON before drafting a schema' },
  ],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['json schema', 'schema from json'],
  entityAliases: ['json schema generator'],
  inputs: ['json'],
  outputs: ['json'],
  difficulty: 'beginner',
  audience: ['developers'],
};
