import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'color-contrast-checker',
  title: 'WCAG Color Contrast Checker',
  category: 'design-tools',
  summary: 'Check text and background colors against WCAG AA and AAA for normal and large text, with a live preview and an accessible-color fix.',
  primaryConcepts: ['wcag color contrast'],
  secondaryConcepts: ['contrast ratio', 'relative luminance', 'wcag aa', 'wcag aaa', 'large text threshold', 'web accessibility'],
  intentGroups: {
    informational: ['What is a WCAG contrast ratio?', 'What contrast do AA and AAA require?'],
    howTo: ['How to check color contrast for accessibility', 'How to fix text that fails contrast'],
    comparison: ['AA vs AAA contrast requirements', 'Normal text vs large text thresholds'],
    misconception: ['Passing contrast does not make a page fully accessible', 'Contrast is symmetric, so text and background order does not change the ratio'],
    troubleshooting: ['My light gray text fails on white', 'My brand color will not pass AA'],
  },
  realWorldUseCases: [
    'Checking body text color against its background before shipping a design',
    'Proving a UI meets WCAG AA for an accessibility audit',
    'Finding the nearest accessible shade of a brand color',
    'Comparing button label contrast across states',
  ],
  commonMistakes: [
    'Assuming a passing contrast ratio means the whole interface is accessible',
    'Using normal-text thresholds for text that qualifies as large, or the reverse',
  ],
  commonQuestions: [
    'What contrast ratio do I need to pass WCAG?',
    'What counts as large text?',
    'My colors fail. How do I fix them?',
  ],
  usedWith: [
    { slug: 'color-format-converter', reason: 'Convert a passing color into the format your CSS needs', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'color-format-converter', reason: 'When the goal is format conversion rather than contrast' },
  ],
  nextSteps: [
    { slug: 'color-format-converter', reason: 'Turn the accessible color into rgb() or oklch()', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['color contrast checker', 'wcag contrast checker', 'contrast ratio', 'wcag aa', 'wcag aaa', 'accessible color'],
  entityAliases: ['contrast checker', 'a11y contrast', 'wcag contrast'],
};
