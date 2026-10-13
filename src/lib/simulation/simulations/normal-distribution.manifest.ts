// Declarative manifest for the Normal Distribution Visualizer (Applied Math). Single source
// of truth for its config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior
// is in normal-distribution.ts. No em dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import normalDistribution from './normal-distribution';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Normal Distribution Visualizer',
    slug: 'normal-distribution-visualizer',
    processorId: 'normal-distribution',
    domain: 'math-lab',
    category: 'applied-math',
    family: 'statistics',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['mean', 'standard deviation'],
    nextTopics: ['z table', 'sampling distribution'],
    curriculumTags: ['statistics'],
    learningObjectives: [
      'Compute a z-score from a mean, a standard deviation, and a bound',
      'Read the shaded left-tail area as the standard normal CDF at that z',
      'Separate each empirical band from the shaded left tail',
    ],
    keyTakeaways: [
      'z = (bound - mean) / sigma, and sigma never drops to zero',
      'The shaded left area and the right area add to 1',
      'The 68 percent band is the middle of the curve, not the left tail up to z = 1',
    ],
  },
  concepts: {
    primary: ['normal distribution calculator'],
    secondary: ['z-score', 'empirical rule', 'bell curve', 'standard deviation', 'left tail'],
    aliases: ['bell curve', 'z score calculator', 'empirical rule', 'normal curve'],
  },
  equations: [
    {
      id: 'z-score',
      symbol: 'z',
      expression: 'z = (x - μ) / σ',
      description: 'The z-score counts how many standard deviations the bound sits from the mean.',
      variables: [
        { symbol: 'z', label: 'z-score', unit: '', measurementId: 'z' },
        { symbol: 'x', label: 'Bound', unit: '', paramId: 'bound' },
        { symbol: 'μ', label: 'Mean', unit: '', paramId: 'mean' },
        { symbol: 'σ', label: 'Standard deviation', unit: '', paramId: 'sigma' },
      ],
    },
    {
      id: 'left-tail',
      symbol: 'Φ',
      expression: 'left area = Φ(z) and right area = 1 - Φ(z)',
      description: 'The shaded left area is the standard normal CDF at z. The right area is one minus that value.',
      variables: [
        { symbol: 'Φ', label: 'Left area', unit: '', measurementId: 'leftArea' },
        { symbol: 'z', label: 'z-score', unit: '', measurementId: 'z' },
      ],
    },
  ],
  educational: {
    summary: 'Drag the mean and sigma, then a bound. Read z and the shaded probability on a live bell curve.',
    intentGroups: {
      informational: ['What is a normal distribution?', 'What is a z-score?'],
      howTo: ['How to shade a probability on a normal curve', 'How to read a z-score from a mean and a bound'],
      comparison: ['Normal distribution vs the empirical rule', 'z-score vs shaded area'],
      misconception: ['A z-score of 1 is not a probability of 1', 'The 68 percent band is not the left tail up to one sigma'],
      troubleshooting: ['Why the shaded area and the z-score disagree', 'Why a zero standard deviation gets refused'],
    },
    commonMistakes: [
      'Reading a z-score of 1 as if it were the shaded probability',
      'Treating the 68 percent band as the left tail area',
    ],
    realWorldUseCases: [
      'Checking a statistics homework z-score against the shaded area',
      'Showing a class why 68 percent is the middle band and not the left tail',
      'Comparing one bound on a normal curve with a list of sample numbers',
      'Estimating a left-tail probability before a longer statistics course',
    ],
    audience: ['students', 'teachers', 'math learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Normal Distribution Calculator: z-Score and Area',
    description:
      'Slide the mean and sigma, then drag a bound on the bell curve to read z, the area under the normal curve, and the empirical rule.',
    tagline: 'Drag a bound on the bell curve and read the shaded probability.',
    keywords: ['normal distribution calculator', 'z-score', 'empirical rule', 'bell curve', 'standard deviation', 'shaded area'],
  },
  presentation: {
    tags: ['normal distribution calculator', 'normal distribution', 'z-score', 'empirical rule', 'bell curve', 'standard deviation', 'shaded area', 'left tail', 'area under normal curve'],
    updatedAt: '2026-10-09',
    trustVariant: 'offline',
  },
  examples: [
    { title: 'One sigma', body: 'Mean 0 and sigma 1 with bound 1 give z = 1 and a left area near 0.84.' },
    { title: 'Half the curve', body: 'Bound 0 on that same curve shades a left area of 0.5, exactly half.' },
    { title: 'Two sigma', body: 'Bound 2 with mean 0 and sigma 1 selects empirical band 2, the 95 percent middle.' },
    { title: 'Center drag', body: 'A drag at the middle of the canvas sets the bound to 0, because the axis runs from -4 to 4.' },
  ],
  faq: [
    {
      question: 'What is a normal distribution?',
      answer:
        'A normal distribution is a bell curve fixed by a mean and a standard deviation. Most of the area sits near the mean, and both tails thin out. Sigma sets the width while the mean slides the peak left or right. With mean 0 and sigma 1, this is the standard normal curve.',
    },
    {
      question: 'What is the difference between a z-score and the shaded area?',
      answer:
        'The z-score counts standard deviations from the mean to the bound. The shaded area is the probability of landing at or below that bound. For example, bound 1 on the standard normal gives z = 1. The left area there is near 0.84, not 1.',
    },
    {
      question: 'Why does a zero standard deviation get refused?',
      answer:
        'A standard deviation of zero would divide the z-score by zero. The sigma slider therefore stops at 0.2, which keeps a real width. That floor is how a zero width was refused. Raise sigma and the bell widens while z shrinks.',
    },
    {
      question: 'How do the 68, 95, and 99.7 bands work?',
      answer:
        'These bands are memory aids for area near the mean, not a second shaded tail. About 68 percent of the area lies within one sigma of the mean. About 95 percent lies within two sigma, and about 99.7 percent lies within three. A bound of 2 with mean 0 and sigma 1 selects band 2.',
    },
    {
      question: 'Where does this bell curve get used?',
      answer:
        'Checking a statistics homework z-score against the shaded area takes one drag of the bound. Showing a class why 68 percent is the middle band and not the left tail fits here. Comparing one bound on a normal curve with a list of sample numbers belongs beside the statistics visualizer. Estimating a left-tail probability before a longer statistics course is the edge of this page.',
    },
    {
      question: 'What does a drag on the canvas change?',
      answer:
        'A horizontal drag moves only the bound, while mean and sigma stay on the sliders. The middle of the canvas is bound 0, because the axis runs from -4 to 4. On the standard normal, bound 0 shades a left area of 0.5.',
    },
    {
      question: 'What numbers show up at the default setting?',
      answer:
        'The page opens on mean 0 and sigma 1 with the bound at 1, so z = 1. The shaded left area is near 0.84 and the right area is near 0.16. Those two areas add to 1 on every curve.',
    },
  ],
  guide: {
    slug: 'how-a-normal-distribution-works',
    title: 'How a Normal Distribution Works',
    description: 'How a mean and a sigma turn a bound into a z-score and a shaded area on the bell curve.',
    readMinutes: 5,
    updatedAt: '2026-10-09',
    quickAnswer: [
      'A normal distribution is a bell curve fixed by a mean and a sigma.',
      'The z-score is the bound minus the mean, divided by sigma. For example, mean 0 and sigma 1 at bound 1 give z = 1, with area near 0.84. This normal distribution calculator shades the left tail for the bound you set. Drag the bound and the shade follows it across the curve.',
    ].join('\n\n'),
    sections: [
      {
        id: 'what-is-a-normal-distribution',
        heading: 'What is a normal distribution?',
        body: [
          'A normal distribution is a symmetric bell curve set by its mean and its standard deviation.',
          'Values near the mean are common and values in the tails are rare. For example, class heights and repeated measurements follow this shape. Sigma controls the width and the mean slides the peak.',
        ].join('\n\n'),
      },
      {
        id: 'z-score-and-shaded-area',
        heading: 'How does the z-score become the shaded area?',
        body: [
          'Divide the distance from the mean by sigma, then read the left-tail probability as the shade.',
          'The formula for that distance is z = (bound - mean) / sigma. For example, mean 2 and sigma 2 with bound 4 give z = 1. The shaded left area is near 0.84 and the right area is what remains. The two areas add to 1.',
        ].join('\n\n'),
      },
      {
        id: 'empirical-rule-bands',
        heading: 'How do the 68, 95, and 99.7 bands work?',
        body: [
          'Each band is the share of area within a whole number of sigma of the mean.',
          'About 68 percent lies within one sigma. About 95 percent lies within two sigma, and about 99.7 percent lies within three. A bound of 2 on the standard normal selects band 2. Unlike the shade, the band is a label and not a probability.',
        ].join('\n\n'),
      },
      {
        id: 'why-area-and-z-disagree',
        heading: 'Why do the shaded area and the z-score disagree?',
        body: [
          'They disagree because z counts distance and the shade counts probability.',
          'A z-score of 1 is one sigma above the mean, while the left area is near 0.84. The normal distribution vs the empirical rule is the same kind of split. The curve is the full model and the rule is only three middle bands.',
        ].join('\n\n'),
      },
    ],
    mistakes: [
      {
        heading: 'Reading z as a probability',
        body: [
          'Reading a z-score of 1 as if it were the shaded probability is the common mistake.',
          'A z-score of 1 means one sigma above the mean. The left area on the standard normal is near 0.84.',
        ].join('\n\n'),
      },
      {
        heading: 'Treating 68 percent as the left tail',
        body: [
          'Treating the 68 percent band as the left tail area will not match the shade.',
          'That band is the middle slice from one sigma below the mean to one sigma above it. The left tail up to z = 1 is near 0.84 instead.',
        ].join('\n\n'),
      },
      {
        type: 'note',
        heading: 'Sigma cannot be zero',
        body: [
          'A zero width was refused, so sigma stops at 0.2.',
          'Nothing is uploaded, and the math runs on your device.',
        ].join('\n\n'),
      },
    ],
  },
  citation: {
    problem: 'Drag the mean, the standard deviation, and a bound on a bell curve and read the shaded probability.',
    nonGoal: 'replace a statistics course or fit a distribution to a data set.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Drag the mean, the standard deviation, and a bound on a bell curve and read the shaded probability.',
    repeatability: 'medium',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  relationships: {
    usedWith: [
      {
        slug: 'statistics-visualizer',
        reason: 'Paste a list of numbers there for the sample mean and spread, then read one tail on this curve',
        strength: 0.8,
      },
    ],
  },
  paramBehavior: normalDistribution.paramBehavior,
  aspect: normalDistribution.aspect,
  params: normalDistribution.params,
  presets: normalDistribution.presets,
  formula: normalDistribution.formula,
};
