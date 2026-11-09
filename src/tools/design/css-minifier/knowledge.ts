import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'css-minifier',
  title: 'CSS Minifier and Beautifier',
  category: 'design-tools',
  summary: 'Minify CSS for smaller payloads or beautify minified CSS so it is readable again, in the browser.',
  primaryConcepts: ['CSS minification'],
  secondaryConcepts: ['beautify css', 'unminify css', 'css formatter', 'css beautifier'],
  intentGroups: {
    informational: ['What does minifying CSS remove?', 'What can minifying not remove safely?'],
    howTo: ['How to minify CSS in the browser', 'How to unminify CSS'],
    comparison: ['Browser minify vs build-pipeline minify', 'Beautify vs format in an IDE'],
    misconception: ['Minify rewrites selectors', 'Minify removes unused rules'],
    troubleshooting: ['CSS looks wrong after minify', 'Quoted content changed'],
  },
  realWorldUseCases: [
    'Shrinking a hand-written stylesheet before embed',
    'Expanding a minified vendor file to debug a rule',
    'Checking how many bytes comments cost',
  ],
  commonMistakes: [
    'Expecting unused-rule elimination from a tokenizer',
    'Minifying the only copy of a stylesheet you still edit',
  ],
  commonQuestions: [
    'What does minifying CSS remove?',
    'Is my CSS sent to a server?',
    'What does beautify do?',
  ],
  usedWith: [
    { slug: 'px-to-rem-converter', reason: 'Convert units before shipping the stylesheet', strength: 0.5 },
    { slug: 'json-minifier', reason: 'Minify JSON payloads the same way', strength: 0.45 },
  ],
  alternatives: [
    { slug: 'json-minifier', reason: 'Minify JSON instead of CSS' },
  ],
  nextSteps: [
    { slug: 'color-format-converter', reason: 'Convert colour values used in the stylesheet', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['minify css', 'css beautifier', 'unminify css', 'beautify css'],
  entityAliases: ['css formatter', 'css minify'],
  inputs: ['css stylesheet text'],
  outputs: ['minified or beautified css'],
  difficulty: 'beginner',
};
