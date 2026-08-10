import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'uuid-generator',
  title: 'UUID Generator',
  category: 'generate',
  summary:
    'Generate random version 4 UUIDs in the browser: one or many at once, with optional hyphens and uppercase, ready to copy.',
  primaryConcepts: ['UUID generation', 'unique identifiers'],
  secondaryConcepts: ['uuid version 4', 'guid', 'rfc 4122', 'random identifiers', 'primary keys'],
  intentGroups: {
    informational: [
      'what is a uuid',
      'how a version 4 uuid is structured',
      'how likely a uuid collision is',
    ],
    howTo: ['generate a uuid', 'generate many uuids at once', 'remove hyphens from a uuid'],
    comparison: ['uuid vs auto-increment id', 'uuid v4 vs v1', 'uuid vs guid'],
    misconception: ['uuids are guaranteed unique', 'uuids are sequential', 'uuids are secret'],
    troubleshooting: ['uuid rejected by a database column', 'uuid case sensitivity'],
  },
  realWorldUseCases: [
    'Assigning a primary key to a new database row',
    'Naming a file or object so it never clashes',
    'Correlating logs across services with a request id',
    'Generating a stable id for a record created offline',
  ],
  commonMistakes: [
    'Assuming a UUID is secret or hard to guess',
    'Using a UUID as a security token',
    'Storing a UUID as text when a native UUID type exists',
    'Expecting UUIDs to sort in creation order',
  ],
  commonQuestions: [
    'What is a UUID?',
    'Are UUIDs guaranteed to be unique?',
    'What version does this generate?',
    'Can I generate many at once?',
    'Does it work offline?',
  ],
  usedWith: [],
  alternatives: [
    { slug: 'random-string-generator', reason: 'A random token when you need control over length and alphabet' },
  ],
  nextSteps: [
    { slug: 'password-generator', reason: 'Create a strong secret to go with the identifier' },
  ],
  workflowStage: ['transform'],
  keywords: ['uuid generator', 'guid generator', 'uuid v4', 'random uuid', 'unique identifier'],
  entityAliases: ['guid generator', 'uuid maker', 'unique id generator'],
  inputs: ['options'],
  outputs: ['uuid'],
  difficulty: 'beginner',
  audience: ['developers'],
};
