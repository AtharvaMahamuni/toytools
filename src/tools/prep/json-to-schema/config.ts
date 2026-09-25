import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-to-schema',
  name: 'JSON to JSON Schema',
  seoTitle: 'Schema from a JSON Example',
  description:
    'Build a JSON Schema from the types in one example. Does not mark fields required. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Types from this example. Not a required-field list.',
  categorySlug: 'prep',
  tags: ['json schema', 'json to schema', 'schema from json', 'infer schema'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-to-schema',
  keywords: ['json schema generator', 'example to schema'],
  inputs: ['json'],
  outputs: ['json'],
  relatedTools: ['json-formatter', 'json-validator', 'json-schema-validator'],
  guide: {
    slug: 'what-is-json-schema-from-an-example',
    categorySlug: 'prep',
    title: 'What a JSON Example Can Tell a Schema',
    description: 'Draft a schema from the types in one JSON example. Required fields are not inferred. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },
  citation: {
    problem: 'Use JSON to JSON Schema when someone needs a schema draft from an example, without uploading the JSON.',
    nonGoal: 'decide that a field is required or send the JSON to an AI model.',
  },
  craft: {
    id: 'json-to-schema-repair',
    kind: 'recovery',
    solves: 'JSON.parse names a character offset the user has to count to by hand, and a trailing comma or smart quotes are the usual cause.',
  },
};
