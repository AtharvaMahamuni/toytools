import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-diff',
  title: 'JSON Diff',
  category: 'developer-utilities',
  summary:
    'Compare two JSON documents by path and see what was added, removed, or changed, without uploading either side.',
  primaryConcepts: ['JSON diff'],
  secondaryConcepts: ['array order', 'object key order', 'parse error'],
  intentGroups: {
    informational: ['what a JSON diff is', 'which paths a structural diff names'],
    howTo: ['how to compare two JSON documents', 'how to read a changed path'],
    comparison: ['JSON diff versus text diff', 'JSON diff versus CSV diff'],
    misconception: ['object key order is a change', '1 and 1.0 are different numbers'],
    troubleshooting: ['one side is not valid JSON', 'a blank side is reported as a parse error'],
  },
  realWorldUseCases: [
    'Comparing two API responses before and after a deploy',
    'Checking a config file after an editor reordered keys',
    'Reviewing a payload two services claim is the same',
    'Spotting an array that one side sorted',
  ],
  commonMistakes: [
    'Treating reordered object keys as a data change',
    'Treating 1 and 1.0 as different numbers',
    'Uploading private JSON to a server-side comparison site',
  ],
  commonQuestions: [
    'What is a JSON diff?',
    'Why does object key order not count as a change?',
    'Does array order count as a change?',
    'What happens if one side is not valid JSON?',
  ],
  usedWith: [
    { slug: 'csv-diff', reason: 'Compare tabular exports the same way, by row instead of by path', strength: 0.7 },
    { slug: 'json-formatter', reason: 'Pretty-print one side after the values are the ones you wanted', strength: 0.6 },
    { slug: 'json-validator', reason: 'See a single document syntax error before you compare two', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'json-formatter', reason: 'Choose this when the job is indentation, not a comparison' },
    { slug: 'csv-diff', reason: 'Choose this when the files are CSV rows rather than JSON values' },
  ],
  nextSteps: [
    { slug: 'json-validator', reason: 'Validate the side that failed to parse before you try the diff again', priority: 1 },
    { slug: 'json-formatter', reason: 'Format the reconciled document once the paths match', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['json diff', 'compare json'],
  entityAliases: ['json compare'],
  inputs: ['left json', 'right json'],
  outputs: ['added paths', 'removed paths', 'changed paths'],
  difficulty: 'beginner',
  audience: ['developers'],
};
