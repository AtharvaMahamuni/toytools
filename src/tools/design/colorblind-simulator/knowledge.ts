import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'colorblind-simulator',
  title: 'Colorblind Simulator',
  category: 'design-tools',
  summary:
    'See one palette under protanopia, deuteranopia, tritanopia, and the anomaly types at the same time.',
  primaryConcepts: ['colorblind simulator'],
  secondaryConcepts: ['deuteranopia simulator', 'protanopia color check', 'tritanopia', 'Machado 2009'],
  intentGroups: {
    informational: [
      'what a color blindness simulator shows',
      'which cone type protanopia, deuteranopia, and tritanopia each remove',
      'why two mid reds and greens can collapse while pure red and pure green do not',
    ],
    howTo: [
      'check a palette for colorblindness',
      'compare protanopia and deuteranopia on the same colors',
      'read the note that names a collapsed pair',
    ],
    comparison: [
      'protanopia versus deuteranopia',
      'dichromacy versus anomalous trichromacy',
    ],
    misconception: [
      'pure red and pure green always look the same under deuteranopia',
      'a colorblind simulator can diagnose color vision',
    ],
    troubleshooting: [
      'why the collapse note stays hidden',
      'why a swatch looks gray under achromatopsia',
    ],
  },
  realWorldUseCases: [
    'Checking a status palette of red, green, and blue before shipping a dashboard.',
    'Comparing the same hex values under protanopia and deuteranopia without uploading a screenshot.',
    'Seeing which labeled simulation made two stops hard to tell apart.',
  ],
  commonMistakes: [
    'Checking one deficiency, deciding the palette is fine, and missing a collapse under another.',
    'Expecting #ff0000 and #00ff00 to become the same color. They differ in lightness, so the model still separates them.',
    'Treating the page as a vision test. It simulates a published model. It does not examine anyone.',
  ],
  commonQuestions: [
    'How do I check a palette in a colorblind simulator?',
    'What is the difference between protanopia and deuteranopia?',
    'Why do some red and green pairs stay apart?',
    'When does the collapse note appear?',
  ],
  usedWith: [
    { slug: 'color-contrast-checker', reason: 'Score a pair for WCAG after the simulation shows they are still distinct', strength: 0.7 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'color-shades-generator', reason: 'Build a 50 to 950 ramp, then bring the stops back here', strength: 0.5 },
    { slug: 'color-format-converter', reason: 'Turn an hsl() value into hex before simulating it', strength: 0.4 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'colorblind simulator',
    'color blindness simulator',
    'deuteranopia simulator',
    'protanopia color check',
    'colorblind palette checker',
  ],
  entityAliases: ['CVD simulator', 'Machado color vision simulation'],
  inputs: ['text'],
  outputs: ['text'],
  difficulty: 'beginner',
  audience: ['designers', 'developers'],
};
