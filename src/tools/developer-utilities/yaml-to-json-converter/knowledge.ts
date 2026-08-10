import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'yaml-to-json-converter',
  title: 'YAML to JSON Converter',
  category: 'developer-utilities',
  summary: 'Convert YAML to JSON for APIs, JSON Schema validation, and tooling without a YAML parser. Expands anchors and serializes timestamps as ISO strings.',
  primaryConcepts: ['YAML to JSON', 'data format conversion'],
  secondaryConcepts: ['yaml', 'json', 'kubernetes', 'docker compose', 'ansible', 'configuration', 'devops', 'serialization', 'json schema'],
  intentGroups: {
    informational: [
      'What is the difference between YAML and JSON?',
      'Is YAML a superset of JSON?',
      'What happens to comments when converting YAML to JSON?',
    ],
    howTo: [
      'How to convert a YAML config to JSON for an API',
      'How to turn a Kubernetes manifest into JSON',
      'How to convert YAML to JSON for JSON Schema validation',
    ],
    comparison: [
      'YAML vs JSON for APIs',
      'When to use JSON instead of YAML',
      'YAML anchors vs JSON references',
    ],
    misconception: [
      'YAML and JSON are interchangeable without any data loss',
      'JSON keeps YAML comments',
      'YAML timestamps survive as dates in JSON',
    ],
    troubleshooting: [
      'YAML parse error from tab indentation',
      'Anchors and aliases expanding unexpectedly in JSON',
      'Dates becoming strings after conversion',
      'Unquoted special characters breaking YAML parsing',
    ],
  },
  realWorldUseCases: [
    'Converting a YAML Kubernetes manifest to JSON for a tool that expects JSON',
    'Turning a YAML config into JSON to validate against a JSON Schema',
    'Passing a YAML settings file to an API endpoint that accepts JSON',
    'Processing a YAML file in a language or library without YAML support',
    'Importing YAML data into a database or system that stores JSON',
  ],
  commonMistakes: [
    'Indenting the YAML input with tab characters, which is invalid and fails to parse',
    'Expecting comments to be preserved in the JSON output',
    'Assuming YAML timestamps stay as dates rather than strings',
    'Leaving special characters unquoted, causing parse errors',
  ],
  commonQuestions: [
    'Are YAML comments kept in the JSON output?',
    'How are anchors and aliases handled?',
    'What happens to YAML dates in JSON?',
    'Can I convert the JSON back to YAML?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format and inspect the JSON output', strength: 0.8 },
    { slug: 'json-validator', reason: 'Validate the resulting JSON syntax', strength: 0.9 },
    { slug: 'json-tree-viewer', reason: 'Explore the converted JSON structure', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'json-to-yaml-converter', reason: 'Convert the other direction — JSON to YAML' },
    { slug: 'json-to-csv-converter', reason: 'Convert JSON to CSV for tabular data instead' },
  ],
  nextSteps: [
    { slug: 'json-formatter', reason: 'Format the JSON output for readability', priority: 1 },
    { slug: 'json-validator', reason: 'Validate the resulting JSON', priority: 2 },
    { slug: 'json-to-yaml-converter', reason: 'Round-trip back to YAML when needed', priority: 3 },
  ],
  workflowStage: ['transform', 'export'],
  keywords: [
    'yaml to json', 'convert yaml to json', 'yaml json converter',
    'json converter online', 'yaml to json online', 'yaml to json converter',
    'kubernetes yaml to json', 'docker compose to json', 'yaml parser',
  ],
  entityAliases: ['yaml json converter', 'yml to json converter', 'yaml to json tool', 'json from yaml'],
};
