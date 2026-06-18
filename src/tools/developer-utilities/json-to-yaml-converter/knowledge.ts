import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-to-yaml-converter',
  title: 'JSON to YAML Converter',
  category: 'developer-utilities',
  summary: 'Convert JSON to YAML and YAML to JSON for Kubernetes, Docker Compose, Ansible, and CI/CD configs. Smart quoting, literal blocks, and formatting options.',
  primaryConcepts: ['json to yaml', 'yaml to json', 'data format conversion'],
  secondaryConcepts: ['yaml', 'json', 'kubernetes', 'docker compose', 'ansible', 'configuration', 'devops', 'serialization', 'indentation'],
  intentGroups: {
    informational: [
      'What is the difference between JSON and YAML?',
      'Is YAML a superset of JSON?',
      'Why does YAML use indentation instead of brackets?',
    ],
    howTo: [
      'How to convert JSON to YAML for Kubernetes',
      'How to convert a JSON API response to YAML',
      'How to turn YAML config back into JSON',
      'How to create a Docker Compose file from JSON data',
    ],
    comparison: [
      'JSON vs YAML for configuration files',
      'When to use YAML instead of JSON',
      'YAML vs JSON for Kubernetes manifests',
    ],
    misconception: [
      'YAML indentation is optional like JSON whitespace',
      'Tabs are valid indentation in YAML',
      'All YAML values are strings by default',
    ],
    troubleshooting: [
      'YAML parse error after converting from JSON',
      'String values parsed as numbers in YAML',
      'Boolean values losing their quotes in YAML',
      'Tab characters causing YAML parse errors',
    ],
  },
  realWorldUseCases: [
    'Converting a JSON API response to a Kubernetes deployment manifest',
    'Generating a Docker Compose file from a JSON service definition',
    'Transforming JSON variable files into Ansible YAML variables',
    'Preparing JSON configuration for a GitHub Actions workflow file',
    'Converting a JSON OpenAPI spec section into YAML for readability',
  ],
  commonMistakes: [
    'Using tab characters for YAML indentation (tabs are not allowed)',
    'Leaving numeric-looking strings unquoted in YAML output',
    'Misaligning indentation in nested YAML structures',
    'Expecting YAML documents without --- to be invalid',
  ],
  commonQuestions: [
    'Why are some string values quoted in the YAML output?',
    'What does the --- marker do at the top of a YAML file?',
    'Can I convert YAML back to JSON with this tool?',
    'How does this tool handle multi-line string values?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format and inspect JSON before converting to YAML', strength: 0.8 },
    { slug: 'json-validator', reason: 'Validate JSON syntax is correct before converting', strength: 0.9 },
    { slug: 'json-tree-viewer', reason: 'Explore the JSON structure before converting', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'yaml-to-json-converter', reason: 'Convert the other direction — YAML back to JSON' },
    { slug: 'json-to-csv-converter', reason: 'Convert JSON to CSV for tabular data instead' },
  ],
  nextSteps: [
    { slug: 'yaml-to-json-converter', reason: 'Convert the YAML back to JSON when needed', priority: 1 },
    { slug: 'json-validator', reason: 'Validate JSON before converting', priority: 2 },
    { slug: 'json-formatter', reason: 'Inspect and format the source JSON', priority: 3 },
  ],
  workflowStage: ['transform', 'export'],
  keywords: [
    'json to yaml', 'yaml to json', 'convert json to yaml', 'json yaml converter',
    'yaml converter online', 'json to yaml online', 'yaml to json converter',
    'kubernetes yaml', 'docker compose yaml', 'ansible yaml',
  ],
  entityAliases: ['json yaml converter', 'yaml json converter', 'json to yml converter', 'yaml to json tool'],
};
