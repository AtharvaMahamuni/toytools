import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-to-schema',
  name: 'JSON to JSON Schema',
  seoTitle: 'Schema from a JSON Example',
  description:
    'Generate a JSON Schema from one JSON example. Records the types that are present: string, number, integer, boolean, null, object, and array. Does not mark fields required or guess what a value means. Runs entirely on your device. Nothing is uploaded.',
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
