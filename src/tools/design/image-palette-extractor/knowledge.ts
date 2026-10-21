import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'image-palette-extractor',
  title: 'Image Palette Extractor',
  category: 'design-tools',
  summary:
    'Pull a dominant color palette from a photo on this device, with each stop share, and copy it as CSS.',
  primaryConcepts: ['image color palette'],
  secondaryConcepts: ['pixel share', 'display-p3'],
  intentGroups: {
    informational: ['how median cut picks a palette'],
    howTo: ['extract colors from an image', 'read the pixel share on a swatch'],
    comparison: ['a palette versus an average of the picture'],
    misconception: ['a background should return several similar stops'],
    troubleshooting: ['why a hex is marked clamped'],
  },
  realWorldUseCases: [
    'Pulling a logo red out of a product photo before it is averaged away.',
    'Copying CSS custom properties from a picture that stays on this device.',
    'Seeing which stop is the wall, because its pixel share is most of the picture.',
  ],
  commonMistakes: [
    'Treating the average of a region as the palette, so the logo red never appears.',
    'Reading five near-identical grays as five colors when they are one wall.',
    'Copying a clamped hex from a wide-gamut photo and assuming it is the original sample.',
  ],
  commonQuestions: [
    'How do I extract colors from an image?',
    'Why does a background become one color?',
    'What does the pixel share mean?',
    'Why is a hex marked as clamped?',
    'Does this page upload the picture?',
  ],
  usedWith: [
    { slug: 'color-format-converter', reason: 'Turn a copied hex into RGB, HSL, or OKLCH', strength: 0.6 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'color-shades-generator', reason: 'Build a ramp from one stop you kept', strength: 0.5 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'extract colors from image',
    'get palette from photo',
    'dominant color from image',
    'image to palette',
    'image color palette',
  ],
  entityAliases: ['median cut'],
  inputs: ['a local image file'],
  outputs: ['CSS custom properties'],
  difficulty: 'beginner',
  audience: ['designers', 'developers'],
};
