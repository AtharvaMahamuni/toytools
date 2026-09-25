import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'llms-txt-generator',
  title: 'llms.txt Generator',
  category: 'prep',
  summary: 'Write a short site description in the H1 and blockquote layout ToyTools publishes.',
  primaryConcepts: ['llms.txt'],
  secondaryConcepts: ['site description', 'crawler policy', 'machine-readable links'],
  intentGroups: {
    informational: ['What does an llms.txt file contain?', 'Is llms.txt an official standard?'],
    howTo: ['How to list tools in an llms.txt file', 'How to leave out an empty section'],
    comparison: ['A short llms.txt vs a full tool inventory', 'A convention vs a formal standard'],
    misconception: ['Generating the file does not publish it', 'The layout is not an official standard'],
    troubleshooting: ['A relative URL did not join to the site', 'An empty heading appeared'],
  },
  realWorldUseCases: [
    'Drafting a site description before you upload it yourself',
    'Listing a handful of important pages with absolute URLs',
    'Leaving contact out when you have none',
  ],
  commonMistakes: [
    'Treating the download as a published file',
    'Expecting the page to invent a tool list',
    'Calling the layout an official standard',
  ],
  commonQuestions: [
    'What does the llms.txt Generator produce?',
    'Is this an official llms.txt standard?',
    'How do I list tools?',
    'Does ToyTools upload the description or call a model?',
  ],
  usedWith: [
    { slug: 'prompt-packer', reason: 'Assemble a prompt, then describe the site that hosts the tool', strength: 0.3 },
  ],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['export'],
  keywords: ['llms.txt', 'site description'],
  entityAliases: ['llms txt generator'],
  inputs: ['text'],
  outputs: ['text'],
  difficulty: 'beginner',
  audience: ['site owners'],
};
