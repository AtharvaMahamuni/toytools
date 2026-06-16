import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-tree-viewer',
  title: 'JSON Tree Viewer',
  category: 'developer-utilities',
  summary: 'View JSON as a collapsible tree. Explore nested structure, search keys and values, and copy the path or value of any node.',
  primaryConcepts: ['json tree viewer', 'json visualization'],
  secondaryConcepts: ['json explorer', 'nested json', 'json path', 'collapsible tree', 'json structure', 'jsonpath'],
  intentGroups: {
    informational: ['What is a JSON tree viewer?', 'What does the tree show about JSON structure?'],
    howTo: ['How to find a key in a large JSON file', 'How to copy the path to a JSON value', 'How to explore a nested API response'],
    comparison: ['Tree viewer vs formatter', 'Dot path vs JSONPath'],
    misconception: ['A viewer does not change the JSON', 'Array indices are not object keys'],
    troubleshooting: ['Invalid JSON shows no tree', 'Large JSON is slow to render'],
  },
  realWorldUseCases: [
    'Inspecting a deeply nested API response while debugging',
    'Finding the exact path to a value to reference it in code',
    'Understanding the shape of an unfamiliar JSON config file',
    'Checking which fields are present across a large payload',
  ],
  commonMistakes: [
    'Pasting invalid JSON and expecting a tree to render',
    'Confusing array indices with object keys when reading a path',
    'Expecting the viewer to edit or reformat the data',
  ],
  commonQuestions: [
    'How do I find a specific key in a large JSON file?',
    'What is the difference between a dot path and a JSONPath?',
    'Can I view very large JSON files?',
  ],
  usedWith: [
    { slug: 'json-validator', reason: 'Confirm the JSON is valid before exploring it', strength: 0.9 },
    { slug: 'json-formatter', reason: 'Pretty-print the same data as text', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'json-formatter', reason: 'Read formatted JSON as plain text instead of a tree' },
  ],
  nextSteps: [
    { slug: 'json-formatter', reason: 'Format the data for sharing or diffing', priority: 1 },
    { slug: 'json-minifier', reason: 'Compact the data before shipping it', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['json tree viewer', 'json viewer', 'json visualizer', 'view json online', 'json explorer', 'json tree', 'collapsible json'],
  entityAliases: ['json viewer', 'json visualizer', 'json explorer', 'json tree'],
};
