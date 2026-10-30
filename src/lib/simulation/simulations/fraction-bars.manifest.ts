// Declarative manifest for Fraction Bars.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import fractionBars from './fraction-bars';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Fraction Bars Calculator',
    slug: 'fraction-bars-calculator',
    processorId: 'fraction-bars',
    domain: 'math-lab',
    category: 'applied-math',
    family: 'fractions',
    difficulty: 'beginner',
    schoolLevel: 'elementary',
    estimatedLearningTime: '6 min',
    prerequisites: ['counting equal parts'],
    nextTopics: ['adding fractions', 'mixed numbers'],
    curriculumTags: ['fractions', 'equivalent fractions'],
    learningObjectives: [
      'See two fractions take the same length when they name the same amount',
      'Add 1/2 and 1/3 on one shared whole',
      'Read an improper fraction as more than one whole',
    ],
    keyTakeaways: [
      '2/4 and 1/2 shade the same length',
      '1/2 + 1/3 = 5/6, and the shaded length matches',
      '5/4 fills one whole and part of a second whole',
    ],
    references: [
      {
        label: 'Common Core 3.NF and 4.NF: fractions as numbers on a shared whole, and adding with like units',
        url: 'https://www.thecorestandards.org/Math/Content/4/NF/',
      },
    ],
  },
  concepts: {
    primary: ['fraction bars'],
    secondary: ['equivalent fractions', 'adding fractions', 'fraction circles'],
    related: ['fraction strips', 'visual fraction model'],
    aliases: [
      'fraction bars',
      'fraction strips',
      'visual fraction model',
      'fraction circles',
      'equivalent fractions model',
    ],
  },
  equations: [
    {
      id: 'length',
      symbol: 'L',
      expression: 'L = n / d',
      description: 'Shaded length of one fraction, in wholes. Equal values share that length even when the part counts differ.',
      variables: [
        { symbol: 'n', label: 'Numerator', unit: '', paramId: 'numA' },
        { symbol: 'd', label: 'Denominator', unit: '', paramId: 'denA' },
      ],
    },
  ],
  educational: {
    summary: 'Drag equal parts of one whole and watch two fractions, and their sum, take up the same length.',
    intentGroups: {
      informational: ['What is a fraction bar?', 'What is a visual fraction model?'],
      howTo: ['How do fraction strips show equal parts?', 'How do you add 1/2 and 1/3 on a bar?'],
      comparison: ['Fraction bars vs the fraction calculator', 'Fraction circles vs fraction strips'],
      misconception: ['Equivalent fractions are not different lengths', '1/2 + 1/3 is not 2/5'],
      troubleshooting: ['What if the drag stops between the lines?'],
    },
    commonMistakes: [
      'Drawing 2/4 shorter than 1/2',
      'Adding the denominators to make 2/5',
      'Leaving a slice that is not an equal part',
    ],
    realWorldUseCases: [
      'Seeing why one half and two quarters match',
      'Adding one half and one third on one whole',
      'Checking a picture before the fraction calculator',
    ],
    audience: ['students learning fractions', 'teachers'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Visual Fraction Bars, Strips and Circles',
    description:
      'Equivalent fractions model on one shared whole. Runs entirely on your device. Nothing is uploaded.',
    tagline: 'Drag the shaded edge. Both fractions share one whole.',
    keywords: [
      'strips',
      'visual',
      'model',
      'circles',
      'equivalent',
    ],
  },
  presentation: {
    tags: [
      'strips',
      'visual',
      'model',
      'circles',
      'equivalent',
    ],
    updatedAt: '2026-10-31',
    trustVariant: 'offline',
  },
  examples: [
    {
      title: 'Two quarters',
      body: '2/4 and 1/2 shade the same length. The bars are the same width, so the picture and the value agree.',
    },
    {
      title: 'Half plus a third',
      body: '1/2 + 1/3 = 5/6. The shaded length matches. The page does not draw 2/5.',
    },
    {
      title: 'Five quarters',
      body: '5/4 fills one whole bar and one quarter of the next. That is two wholes on the page, the second one partly shaded.',
    },
  ],
  faq: [
    {
      question: 'What is a fraction bar?',
      answer:
        'A fraction bar is one whole cut into equal parts, with some of those parts shaded. The denominator is the number of parts. The numerator is how many are shaded.',
    },
    {
      question: 'Why do 2/4 and 1/2 look the same length?',
      answer:
        'They name the same amount of the same whole. Two of four equal parts cover the same length as one of two equal parts. The bars on this page share that width.',
    },
    {
      question: 'How does 1/2 + 1/3 become 5/6?',
      answer:
        'The wholes match, so the parts have to match too. Half of six parts is three, a third of six parts is two, and three plus two is five. The sum bar is 5/6 of the same whole. It is not 2/5.',
    },
    {
      question: 'What if the drag stops between the lines?',
      answer:
        'It does not stay there. The edge snaps to the nearest equal part, so the picture is still a fraction of one whole.',
    },
    {
      question: 'Where is 5/4?',
      answer:
        'Five quarters is more than one whole. The page draws one full bar and a second bar with one of four parts shaded.',
    },
    {
      question: 'Can I subtract?',
      answer:
        'Yes, when the first fraction is at least as long as the second. If it is shorter, the result stays at zero. The page does not shade a negative length.',
    },
    {
      question: 'Does this multiply, divide, or take a mixed number?',
      answer:
        'No. Multiply, divide, and a typed mixed number stay on the fraction calculator. This page is the shared-whole picture.',
    },
    {
      question: 'Does this page upload the fractions?',
      answer: 'No. The bars, the circles, and the sum are computed in the browser. Nothing is uploaded.',
    },
  ],
  guide: {
    slug: 'how-fraction-bars-work',
    title: 'How Fraction Bars Work',
    description:
      'How a shared whole makes 2/4 match 1/2, and how 1/2 + 1/3 becomes 5/6 on the same length.',
    readMinutes: 6,
    updatedAt: '2026-10-31',
    quickAnswer:
      'A fraction bar shades equal parts of one whole. 2/4 and 1/2 cover the same length. 1/2 + 1/3 covers 5/6 of that same whole, which is the formula n/d for each piece.',
    sections: [
      {
        id: 'whole',
        heading: 'What Is A Fraction Bar?',
        body:
          'A fraction bar is one rectangle that stands for one whole. The ticks cut it into equal parts. Shading counts those parts. A visual fraction model is that picture: the length is the amount, and the lines are only how you count it. Fraction bars on this page keep that width fixed, so two pictures of the same amount match.',
      },
      {
        id: 'strips',
        heading: 'How Do Fraction Strips Show Equal Parts?',
        body:
          'Fraction strips are the same bars laid in a row, one denominator per strip. For example, a halves strip and a quarters strip are the same length, so two quarters sit exactly on top of one half. The drag snaps to those ticks. It will not leave a slice that is not an equal part.',
      },
      {
        id: 'equivalent',
        heading: 'What Is An Equivalent Fractions Model?',
        body:
          'An equivalent fractions model puts both names on one whole. 2/4 and 1/2 shade the same length. Drawing 2/4 shorter than 1/2 is the mistake this page refuses. Seeing why one half and two quarters match is the comparison preset.',
      },
      {
        id: 'add',
        heading: 'How Do You Add 1/2 And 1/3 On A Bar?',
        body:
          'Adding fractions with unlike denominators starts from one shared whole. The formula is n/d for each fraction, then one common count of parts. 1/2 is 3/6 and 1/3 is 2/6, so the sum is 5/6. The shaded length matches. Adding the denominators to make 2/5 draws a shorter bar than the two pieces you started with. For example, the result row on Half plus a third is 5/6 of the same whole, not a new shorter whole. Adding one half and one third on one whole is that picture.',
      },
      {
        id: 'circles',
        heading: 'Where Do Fraction Circles Fit?',
        body:
          'Fraction circles vs fraction strips is the same cut on a different shape. The circle is split into the same number of equal slices, and the shaded slices are the same share of one whole. Circle view does not change the value.',
      },
      {
        id: 'calculator',
        heading: 'Where Does The Fraction Calculator Fit?',
        body:
          'Fraction bars vs the fraction calculator is picture versus arithmetic. Stay here to see the length. Open the fraction calculator to multiply, divide, or type a mixed number. Checking a picture before the fraction calculator is the handoff: if the bars already disagree with the number you meant, the steps will too.',
      },
    ],
    mistakes: [
      {
        heading: 'Drawing 2/4 Shorter Than 1/2',
        body: 'Drawing 2/4 shorter than 1/2 treats the part count as the length. The wholes have to match first. Equivalent fractions are not different lengths.',
      },
      {
        heading: 'Adding The Denominators',
        body: 'Adding the denominators to make 2/5 is 1/2 + 1/3 drawn as if the wholes were different sizes. 1/2 + 1/3 is not 2/5. The sum needs a shared part size, which is sixths.',
      },
      {
        heading: 'Leaving An Unequal Slice',
        body: 'Leaving a slice that is not an equal part means the picture stopped between the ticks. The edge snaps, so the shaded region is still n of d equal parts.',
      },
    ],
  },
  relationships: {
    usedWith: [
      { slug: 'fraction-calculator', reason: 'The arithmetic steps for the length this page draws', strength: 0.9 },
      { slug: 'unit-circle-calculator', reason: 'Another drag on a circle that snaps to a position you can read', strength: 0.4 },
      { slug: 'percentage-calculator', reason: 'A percent is a fraction of 100 on the same idea of one whole', strength: 0.4 },
    ],
  },
  citation: {
    problem: 'Drag equal parts of one whole and see two fractions, and their sum, take up the same length.',
    nonGoal: 'multiply or divide fractions, or take a typed mixed number.',
  },
  job: {
    intent: 'analyze',
    userJob: 'Drag equal parts of one whole and see two fractions, and their sum, take up the same length.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  paramBehavior: fractionBars.paramBehavior,
  aspect: fractionBars.aspect,
  params: fractionBars.params,
  presets: fractionBars.presets,
  formula: fractionBars.formula,
};
