import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'color-format-converter',
  title: 'Color Format Converter',
  category: 'design-tools',
  summary: 'Convert a color between HEX, RGB, HSL, HSV, OKLCH, and CMYK at once, with an alpha-aware preview and one-tap copy.',
  primaryConcepts: ['color format conversion'],
  secondaryConcepts: ['hex color', 'rgb color', 'hsl color', 'oklch color', 'cmyk color', 'alpha channel'],
  intentGroups: {
    informational: ['What does a HEX color encode?', 'What is the OKLCH color space?'],
    howTo: ['How to convert HEX to RGB', 'How to convert RGB to HSL', 'How to get an OKLCH value from a hex code'],
    comparison: ['HSL vs OKLCH for building shades', 'RGB vs CMYK for screen and print'],
    misconception: ['sRGB to CMYK math does not match a print proof', 'HSL lightness is not perceptual lightness'],
    troubleshooting: ['My color name is not recognized', 'My CMYK looks off compared to my printer'],
  },
  realWorldUseCases: [
    'Turning a hex brand color into rgb() for a CSS variable',
    'Getting an OKLCH value to build a perceptual shade scale',
    'Reading the HSL of a color to tweak its hue or saturation',
    'Copying an approximate CMYK reference for a print mockup',
  ],
  commonMistakes: [
    'Treating the sRGB-to-CMYK conversion as a print-accurate proof',
    'Assuming two HSL colors with equal lightness look equally bright',
  ],
  commonQuestions: [
    'How do I convert HEX to RGB?',
    'What is OKLCH and when should I use it?',
    'Does this converter support alpha transparency?',
  ],
  usedWith: [
    { slug: 'color-contrast-checker', reason: 'Check the converted color against its background for accessibility', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'color-contrast-checker', reason: 'When the goal is WCAG contrast rather than format conversion' },
  ],
  nextSteps: [
    { slug: 'color-contrast-checker', reason: 'Verify the color meets WCAG contrast', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['color format converter', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'hex to oklch', 'rgb to cmyk', 'css color converter'],
  entityAliases: ['color converter', 'colour converter', 'hex converter'],
};
