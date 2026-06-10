// Shared test fixtures for the knowledge layer. Kept out of *.test.ts so multiple suites
// (schema, registry, graph, queries, entity-matcher, recommendations) reuse one factory.

import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from './types';

/** Build a valid Knowledge object with sensible defaults; override any field. */
export function makeKnowledge(
  overrides: Partial<Knowledge> & Pick<Knowledge, 'slug'>,
): Knowledge {
  return {
    schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
    title: overrides.slug,
    category: 'developer-tools',
    summary: `${overrides.slug} summary`,
    primaryConcepts: [overrides.slug],
    secondaryConcepts: [],
    intentGroups: {
      informational: [],
      howTo: [],
      comparison: [],
      misconception: [],
      troubleshooting: [],
    },
    realWorldUseCases: [],
    commonMistakes: [],
    commonQuestions: [],
    usedWith: [],
    alternatives: [],
    nextSteps: [],
    workflowStage: ['transform'],
    keywords: [],
    entityAliases: [],
    ...overrides,
  };
}
