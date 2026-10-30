// Declarative manifest for the Radioactive Decay Calculator.
// No em-dashes. Half-lives are ICRP Publication 38 values as printed in IAEA EPR-D Table 26.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import radioactiveDecay from './radioactive-decay';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Radioactive Decay Calculator',
    slug: 'radioactive-decay-calculator',
    processorId: 'radioactive-decay',
    domain: 'physics',
    category: 'physics',
    family: 'nuclear-physics',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '7 min',
    prerequisites: ['exponents', 'what a half-life means'],
    nextTopics: ['decay chains', 'reactor period'],
    curriculumTags: ['nuclear physics', 'exponential decay'],
    learningObjectives: [
      'Read the expected parent count from N = N0 * 2^(-h)',
      'See one sample of nuclei miss that curve',
      'Keep the screen clock separate from the real half-life',
    ],
    keyTakeaways: [
      'At one half-life the expected parent count is half, and one run can miss it',
      'A stable daughter is the nuclei that have already decayed',
      'The dots move on a screen scale, not through 5730 years',
    ],
    references: [
      {
        label: 'IAEA EPR-D Table 26, half-lives from ICRP Publication 38: F-18 109.77 min, I-131 8.04 d, Co-60 5.27 a, C-14 5730 a',
        url: 'https://www-pub.iaea.org/MTCD/Publications/PDF/EPR-D-values_F_web.pdf',
      },
    ],
  },
  concepts: {
    primary: ['radioactive decay'],
    secondary: ['half-life', 'exponential decay', 'parent and daughter'],
    related: ['nuclear reactor', 'screen clock'],
    aliases: [
      'radioactive decay',
      'half life calculator',
      'parent daughter decay',
      'radioactive decay curve',
      'exponential decay nuclei',
      'radioactive decay calculator',
    ],
  },
  equations: [
    {
      id: 'half-life',
      symbol: 'N',
      expression: 'N = N0 * 2^(-h)',
      description: 'Expected parent nuclei left after h half-lives. One sample is a count around that curve, not the curve itself.',
      variables: [
        { symbol: 'N', label: 'Expected parent', unit: 'nuclei', measurementId: 'expected' },
        { symbol: 'h', label: 'Screen half-lives', unit: '', measurementId: 'halves' },
      ],
    },
  ],
  educational: {
    summary: 'Watch a sample of nuclei decay and read the half-life, the expected count, and how far this run sits from that curve.',
    intentGroups: {
      informational: ['What is a half-life?', 'What is a radioactive decay curve?'],
      howTo: ['How does exponential decay of nuclei work?', 'How do you read parent and daughter counts?'],
      comparison: ['Expected count vs this run', 'Screen clock vs the real half-life'],
      misconception: ['The live count is not forced to half', 'The animation is not the real half-life'],
      troubleshooting: ['Why this run missed 200', 'Why carbon-14 does not finish in seconds'],
    },
    commonMistakes: [
      'Forcing the live count to equal exactly half at one half-life',
      'Labeling the on-screen animation with the real half-life',
      'Turning one count into a dose, a weapon yield, or an age',
    ],
    realWorldUseCases: [
      'Seeing why one sample of nuclei misses the expected curve',
      'Comparing fluorine-18 with carbon-14 on a compressed clock',
      'Reading parent and daughter counts beside the curve',
    ],
    audience: ['students', 'teachers'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'The Half Life Curve for Exponential Decay',
    description:
      'Exponential decay of nuclei. Half life curve, parent and daughter. Runs entirely on your device. Nothing is uploaded.',
    tagline: 'Watch the sample thin out. The curve says what the count should do.',
    keywords: ['half life', 'curve', 'exponential', 'nuclei', 'parent', 'daughter'],
  },
  presentation: {
    tags: ['half life', 'curve', 'exponential', 'nuclei', 'parent', 'daughter'],
    updatedAt: '2026-10-31',
    trustVariant: 'offline',
  },
  examples: [
    {
      title: 'One half-life',
      body: 'After one screen half-life the curve says 200 parent nuclei are left from 400. This run is allowed to land somewhere else. The caption names both numbers.',
    },
    {
      title: 'Fluorine-18',
      body: 'One half-life of fluorine-18 is 109.77 minutes. The dots still move in a few seconds of screen time. The label says the screen is not that clock.',
    },
    {
      title: 'Carbon-14',
      body: 'One half-life of carbon-14 is 5730 years. The same screen scale is used, so the sample is not finishing in a few seconds of real time.',
    },
  ],
  faq: [
    {
      question: 'What is a half-life?',
      answer:
        'A half-life is the time in which the expected parent count falls by half. It is a property of the isotope. It is not a promise that this particular sample will land on exactly half.',
    },
    {
      question: 'Why is the count not exactly 200 at one half-life?',
      answer:
        'Each nucleus decays on its own. The formula N = N0 * 2^(-h) is the expected count. One sample of 400 nuclei scatters around it. Forcing the live count to equal exactly half at one half-life would hide that miss.',
    },
    {
      question: 'What is the radioactive decay curve?',
      answer:
        'The radioactive decay curve is the smooth expected count, N0 times 2 to the power of minus h. The jagged line is this run. The gap is how far the sample sits from the curve.',
    },
    {
      question: 'What does parent daughter decay mean here?',
      answer:
        'Parent daughter decay on this page is one species becoming one stable daughter. Fluorine-18 becomes oxygen-18, iodine-131 becomes xenon-131, cobalt-60 becomes nickel-60, and carbon-14 becomes nitrogen-14. Parent plus daughter stays 400. There is no further chain.',
    },
    {
      question: 'Is the animation running in real time?',
      answer:
        'No. The screen clock is a compressed scale, in half-lives per second on this page. Labeling the on-screen animation with the real half-life would make carbon-14 look like it finishes in a few seconds. The readout names the real half-life and says this screen is not that clock.',
    },
    {
      question: 'Which half-lives are used?',
      answer:
        'Fluorine-18 is 109.77 minutes, iodine-131 is 8.04 days, cobalt-60 is 5.27 years, and carbon-14 is 5730 years. Those are the ICRP Publication 38 values printed in IAEA EPR-D Table 26.',
    },
    {
      question: 'Does this compute a dose, a yield, or an age?',
      answer:
        'No. Turning one count into a dose, a weapon yield, or an age is a different job, and this page does not do it. It shows the parent count, the stable daughter count, and the curve.',
    },
    {
      question: 'Does this page upload the sample?',
      answer: 'No. The sample, the curve, and the half-life label are computed in the browser. Nothing is uploaded.',
    },
  ],
  guide: {
    slug: 'how-radioactive-decay-works',
    title: 'How Radioactive Decay Works',
    description: 'How one sample of nuclei falls off the half-life curve, and why the screen clock is not the real half-life.',
    readMinutes: 7,
    updatedAt: '2026-10-31',
    quickAnswer:
      'The expected parent count is N0 times 2 to the power of minus the number of half-lives. One sample of 400 nuclei can miss that curve. The dots move on a screen clock, not through the real half-life.',
    sections: [
      {
        id: 'what',
        heading: 'What Is Radioactive Decay?',
        body:
          'Radioactive decay is one nucleus becoming a different nucleus, on its own clock. A half-life is how long it takes the expected count of parent nuclei to fall by half. A half life calculator that only prints that expected number hides what one sample actually does. This radioactive decay calculator keeps both.',
      },
      {
        id: 'formula',
        heading: 'How Does The Formula Work?',
        body:
          'The formula is N = N0 * 2^(-h). N0 is 400. h is the number of half-lives on the screen clock. At h = 1 the expected parent count is 200. Exponential decay nuclei follow that same rule at every later half-life: two half-lives leave a quarter, three leave an eighth. How it works for one nucleus is a coin flip with that chance, not a schedule.',
      },
      {
        id: 'miss',
        heading: 'Why Can This Run Miss The Curve?',
        body:
          'The radioactive decay curve is the expected count. This run is 400 separate nuclei, so the live count wanders. The live count is not forced to half. Forcing the live count to equal exactly half at one half-life would make every sample look perfect. Seeing why one sample of nuclei misses the expected curve is the point of the caption: it names the expected count and the count this run has. For example, a run can read Expected 200. This run has 186.',
      },
      {
        id: 'daughter',
        heading: 'What Is Parent Daughter Decay Here?',
        body:
          'Parent daughter decay here means each parent that decays leaves one stable daughter. Reading parent and daughter counts beside the curve is the second line on the canvas. The two counts add to 400. The daughter is oxygen-18, xenon-131, nickel-60, or nitrogen-14, depending on the isotope. There is no chain past that.',
      },
      {
        id: 'clock',
        heading: 'Why Is The Screen Clock Not The Real Half-Life?',
        body:
          'Labeling the on-screen animation with the real half-life is the mistake this page refuses. One half-life of fluorine-18 is 109.77 minutes. One half-life of carbon-14 is 5730 years. The dots still move in seconds, because the screen clock is a scale in half-lives per second. Screen clock vs the real half-life is that label. Comparing fluorine-18 with carbon-14 on a compressed clock shows the shape is the same and the real times are not. For example, carbon-14 is not finishing in a few seconds of real time.',
      },
      {
        id: 'limits',
        heading: 'What Does This Page Not Do?',
        body:
          'Turning one count into a dose, a weapon yield, or an age is outside this page. A dose needs the kind of radiation and a body. A yield is a different calculation. An age from carbon-14 needs a measured ratio and a calibration, not one count on a screen. The nuclear reactor page is the next stop when the question is a chain reaction rather than one species thinning out.',
      },
    ],
    mistakes: [
      {
        heading: 'Forcing The Count To Half',
        body: 'Forcing the live count to equal exactly half at one half-life treats the expected value as a rule the sample must obey. The curve is the expectation. The dots are one run.',
      },
      {
        heading: 'Calling Screen Time The Half-Life',
        body: 'Labeling the on-screen animation with the real half-life makes a long-lived isotope look fast. The label on the canvas says the screen clock is not the real half-life.',
      },
      {
        heading: 'Reading A Dose Or An Age',
        body: 'Turning one count into a dose, a weapon yield, or an age asks this picture to do a job it does not have the inputs for. Stay with the parent count, the daughter count, and the curve.',
      },
    ],
  },
  relationships: {
    usedWith: [
      { slug: 'nuclear-reactor-calculator', reason: 'A chain reaction whose period is a different exponential, with a rod you can move', strength: 0.7 },
      { slug: 'pendulum-period-calculator', reason: 'Another live clock on this device, with a period you can read', strength: 0.4 },
    ],
  },
  citation: {
    problem: 'Watch a sample of nuclei decay and read the half-life, the expected remaining count, and how far this run sits from that curve.',
    nonGoal: 'compute a radiation dose, a weapon yield, or the age of an object from one count.',
  },
  job: {
    intent: 'analyze',
    userJob: 'Watch a sample of nuclei decay and read the half-life, the expected remaining count, and how far this run sits from that curve.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  paramBehavior: radioactiveDecay.paramBehavior,
  aspect: radioactiveDecay.aspect,
  params: radioactiveDecay.params,
  presets: radioactiveDecay.presets,
  formula: radioactiveDecay.formula,
};
