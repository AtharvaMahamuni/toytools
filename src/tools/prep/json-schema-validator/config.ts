import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-schema-validator',
  name: 'JSON Schema Validator',
  seoTitle: 'Validate JSON Against a Schema',
  description:
    'Check JSON against type, required, properties, and bounds. Other keywords are named as not checked. Runs entirely on your device. Nothing is uploaded.',
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
  relatedTools: ['json-to-schema', 'json-formatter', 'json-validator'],
  guide: {
    slug: 'how-to-validate-json-against-a-schema',
    categorySlug: 'prep',
    title: 'How to Validate JSON Against a Schema',
    description: 'Check JSON against the schema keywords this page lists. Other keywords are named, not applied. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },
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
