import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'px-to-dp-converter',
  title: 'PX to DP Converter',
  category: 'design-tools',
  summary: 'Convert dp and sp to px across every Android density bucket, plus iOS point scales, and convert pixels back to dp.',
  primaryConcepts: ['density unit conversion'],
  secondaryConcepts: ['density-independent pixels', 'scale-independent pixels', 'android density buckets', 'ios points', 'mdpi baseline', 'screen density'],
  intentGroups: {
    informational: ['What are dp and sp on Android?', 'How do density buckets work?'],
    howTo: ['How to convert dp to px', 'How to convert px back to dp'],
    comparison: ['dp vs sp', 'Android dp vs iOS points'],
    misconception: ['dp is not a fixed number of pixels', 'sp and dp use the same pixel math but different purposes'],
    troubleshooting: ['My asset looks blurry on high-density screens', 'My pixel size does not match the design in dp'],
  },
  realWorldUseCases: [
    'Turning a dp spacing value into pixels for each Android density bucket',
    'Exporting raster assets at the right pixel size per density',
    'Handing one measurement to both Android and iOS engineers',
    'Recovering the dp value from a pixel measurement in a screenshot',
  ],
  commonMistakes: [
    'Treating dp as a fixed pixel count instead of scaling by density',
    'Using dp for text where sp is needed to respect the font-size setting',
  ],
  commonQuestions: [
    'What is the dp to px formula?',
    'What is the difference between dp and sp?',
    'How do iOS points relate to Android dp?',
  ],
  usedWith: [
    { slug: 'px-to-rem-converter', reason: 'Convert the same measurement into CSS units for the web', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'px-to-rem-converter', reason: 'When the target is CSS rem and em rather than native units' },
  ],
  nextSteps: [
    { slug: 'aspect-ratio-calculator', reason: 'Size screens and images while holding a ratio', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['px to dp', 'dp to px', 'px to sp', 'android density', 'density independent pixels', 'ios points'],
  entityAliases: ['dp converter', 'dp px converter', 'sp to px'],
};
