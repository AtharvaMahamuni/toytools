import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'aspect-ratio-calculator',
  title: 'Aspect Ratio Calculator',
  category: 'design-tools',
  summary: 'Lock a ratio like 16:9 and solve the missing width or height, with a live preview and the simplified ratio of any pair.',
  primaryConcepts: ['aspect ratio'],
  secondaryConcepts: ['width to height ratio', 'resolution', 'resize proportionally', 'ratio simplification', 'widescreen', 'image dimensions'],
  intentGroups: {
    informational: ['What is an aspect ratio?', 'What ratio is 1920x1080?'],
    howTo: ['How to calculate height from width at a ratio', 'How to resize while keeping the ratio'],
    comparison: ['16:9 vs 4:3', '21:9 ultrawide vs 16:9'],
    misconception: ['A bigger resolution is not a different aspect ratio', 'Aspect ratio is independent of absolute size'],
    troubleshooting: ['My image looks stretched after resizing', 'My ratio does not simplify to what I expected'],
  },
  realWorldUseCases: [
    'Finding the height for a video frame at a fixed width',
    'Resizing an image without distorting it',
    'Identifying the simplified ratio of a resolution',
    'Sizing a responsive embed to a chosen ratio',
  ],
  commonMistakes: [
    'Changing both width and height freely and breaking the intended ratio',
    'Confusing resolution (absolute pixels) with aspect ratio (their proportion)',
  ],
  commonQuestions: [
    'How do I calculate height for 16:9?',
    'What aspect ratio is 1920x1080?',
    'How do I keep the ratio when resizing?',
  ],
  usedWith: [
    { slug: 'px-to-rem-converter', reason: 'Convert the resulting pixel sizes into CSS units', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'px-to-dp-converter', reason: 'When sizing native mobile screens in dp' },
  ],
  nextSteps: [
    { slug: 'px-to-rem-converter', reason: 'Express the dimensions in rem for responsive CSS', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['aspect ratio calculator', '16:9 calculator', 'ratio calculator', 'resize keep aspect ratio', 'image dimension calculator'],
  entityAliases: ['aspect ratio', 'ratio calculator', 'resolution calculator'],
};
