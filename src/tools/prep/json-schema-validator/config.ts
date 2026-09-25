import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-schema-validator',
  name: 'JSON Schema Validator',
  seoTitle: 'Validate JSON Against a Schema',
  description:
    'Validate JSON against a schema in your browser. Checks type, properties, required, items, additionalProperties, enum, const, and length and number bounds. Other keywords are named as not checked. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Checks the keywords this page lists.',
  categorySlug: 'prep',
  tags: ['json schema validator', 'validate json schema', 'schema check'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'structured-data',
  pattern: 'structured-schema',
  family: 'json',
  keywords: ['check json schema', 'schema validator'],
  inputs: ['json'],
  outputs: ['text'],
  citation: {
    problem: 'Use JSON Schema Validator when someone needs to check JSON against a schema without uploading either one.',
    nonGoal: 'check every JSON Schema keyword or send the JSON to an AI model.',
  },
  craft: {
    id: 'schema-unchecked',
    kind: 'guardrail',
    solves: 'A schema can say Valid while a keyword this page does not implement, such as format, was never looked at.',
  },
};
