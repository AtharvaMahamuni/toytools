import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'px-to-rem-converter',
  title: 'PX to REM Converter',
  category: 'design-tools',
  summary: 'Convert px to rem, em, pt, and percent against a configurable root font size, with one-tap copy for each unit.',
  primaryConcepts: ['css unit conversion'],
  secondaryConcepts: ['pixels', 'rem unit', 'em unit', 'point unit', 'root font size', 'responsive typography'],
  intentGroups: {
    informational: ['What is a rem in CSS?', 'How does the root font size affect rem?'],
    howTo: ['How to convert px to rem', 'How to convert rem back to px'],
    comparison: ['rem vs em', 'px vs rem for accessibility'],
    misconception: ['1rem is not always 16px', 'em and rem are not interchangeable when nested'],
    troubleshooting: ['My rem values do not match my design', 'My 62.5 percent root trick gives odd numbers'],
  },
  realWorldUseCases: [
    'Converting a pixel-based design spec into rem for scalable CSS',
    'Translating a points measurement from a design tool into web pixels',
    'Building a spacing scale in rem from pixel values',
    'Checking what a rem value resolves to at a custom root size',
  ],
  commonMistakes: [
    'Assuming 1rem is always 16px regardless of the root font size',
    'Using em for global spacing and getting compounding from nested elements',
  ],
  commonQuestions: [
    'How do I convert px to rem?',
    'What is the difference between rem and em?',
    'What root font size should I use?',
  ],
  usedWith: [
    { slug: 'px-to-dp-converter', reason: 'Convert the same pixel values into Android dp and sp', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'px-to-dp-converter', reason: 'When the target is native mobile units, not CSS' },
  ],
  nextSteps: [
    { slug: 'aspect-ratio-calculator', reason: 'Size elements while keeping a fixed ratio', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['px to rem', 'rem to px', 'px to em', 'css unit converter', 'root font size', 'pixels to rem'],
  entityAliases: ['px rem converter', 'rem calculator', 'css unit converter'],
};
