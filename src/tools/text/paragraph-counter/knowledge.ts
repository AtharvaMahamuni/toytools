import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'paragraph-counter',
  title: 'Paragraph Counter',
  category: 'text-utilities',
  summary: 'Count paragraphs by detecting blank-line breaks, helping you check document structure and pacing.',
  primaryConcepts: ['paragraph count'],
  secondaryConcepts: ['blank-line break', 'document structure', 'block of text', 'pacing'],
  intentGroups: {
    informational: ['What separates one paragraph from the next?', 'How are blank lines interpreted?'],
    howTo: ['How to count paragraphs in an essay', 'How to check structure before publishing'],
    comparison: ['Paragraph count vs line count', 'Paragraphs vs sections'],
    misconception: ['A single line break is not always a new paragraph', 'List items may not count as paragraphs'],
    troubleshooting: ['Soft line wraps changed my count', 'Trailing blank lines added an empty paragraph'],
  },
  realWorldUseCases: [
    'Confirming an essay meets a minimum paragraph requirement',
    'Balancing pacing so no single paragraph dominates a page',
    'Checking that a blog post is broken into scannable blocks',
    'Reviewing structure of imported or pasted content',
  ],
  commonMistakes: [
    'Treating every line break as a paragraph break',
    'Leaving trailing blank lines that register as empty paragraphs',
  ],
  commonQuestions: [
    'What separates one paragraph from the next?',
    'Do bullet points in a list count as separate paragraphs?',
    'Why did my paragraph count change when I pasted from Word?',
  ],
  usedWith: [
    { slug: 'sentence-counter', reason: 'See how many sentences sit in each paragraph', strength: 0.6 },
    { slug: 'line-counter', reason: 'Compare paragraph blocks against raw line count', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'line-counter', reason: 'Count raw lines instead of paragraph blocks' },
    { slug: 'sentence-counter', reason: 'Measure structure by sentence rather than block' },
  ],
  nextSteps: [
    { slug: 'remove-blank-lines', reason: 'Strip extra blank lines that distort the paragraph count', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['paragraph counter', 'count paragraphs', 'paragraphs in text', 'document structure', 'essay paragraphs'],
  entityAliases: ['paragraph count', 'paragraphs'],
  inputs: ['text'],
  outputs: ['paragraph count'],
  difficulty: 'beginner',
  audience: ['writers', 'students', 'editors', 'bloggers'],
};
