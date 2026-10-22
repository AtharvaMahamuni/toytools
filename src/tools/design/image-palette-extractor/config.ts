import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'image-palette-extractor',
  name: 'Image Palette Extractor',
  seoTitle: 'Image Palette Extractor: Colors from a Photo',
  description:
    'Extract a dominant color palette from a photo. Get colors from an image, then copy the colors as CSS.',
  tagline: 'Dominant colors from a photo, each with its share of the pixels.',
  categorySlug: 'design-tools',
  tags: [
    'image color palette',
    'extract colors from image',
    'get palette from photo',
    'dominant color from image',
    'image to palette',
    'median cut',
  ],
  updatedAt: '2026-10-21',
  addedOn: '2026-10-21',
  trustVariant: 'private',
  engine: 'color',
  pattern: 'color-convert',
  family: 'image-palette',
  inputs: ['image'],
  outputs: ['text'],
  craft: {
    id: 'palette-pixel-share',
    kind: 'orientation',
    solves:
      'A large background returns several near-identical stops and the subject color is missing, and nothing says which stop is the wall.',
  },
  methodology: {
    name: 'Median cut in OKLab',
    detail:
      'Nearest-neighbor samples are split by median cut, then stops closer than a small OKLab distance are merged. A display-p3 sample is converted to sRGB and marked when a channel is clamped.',
  },
  citation: {
    problem: 'Use the Image Palette Extractor to pull the dominant colors out of a picture on this device and copy them as CSS.',
    nonGoal: 'upload the picture, fetch a remote image, or send the sample to a server.',
  },
  job: {
    intent: 'extract',
    userJob: 'Pull the dominant colors out of a picture on this device and copy them as CSS.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'high',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  relatedTools: ['color-format-converter', 'color-shades-generator'],
  guide: {
    slug: 'image-palette-extractor',
    categorySlug: 'design',
    title: 'How to Extract Colors from an Image',
    description:
      'How median cut keeps a logo color, what the pixel share means, and when a hex is a clamped sRGB value.',
    readMinutes: 6,
    updatedAt: '2026-10-21',
  },
};
