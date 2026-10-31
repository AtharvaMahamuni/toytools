// Declarative manifest for the Cyclohexane Chair Calculator.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import cyclohexaneChair from './cyclohexane-chair';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Cyclohexane Chair Calculator',
    slug: 'cyclohexane-chair-calculator',
    processorId: 'cyclohexane-chair',
    domain: 'chemistry-lab',
    category: 'chemistry',
    family: 'organic-chemistry',
    difficulty: 'intermediate',
    schoolLevel: 'introductory-college',
    estimatedLearningTime: '7 min',
    prerequisites: ['newman projections', 'reading a skeletal structure'],
    nextTopics: ['monosubstituted cyclohexane', 'E2 elimination stereochemistry'],
    curriculumTags: ['organic chemistry', 'conformational analysis'],
    learningObjectives: [
      'Read axial and equatorial on a cyclohexane chair',
      'Keep up and down through a chair flip',
      'Turn an A-value into a population',
    ],
    keyTakeaways: [
      'A chair flip swaps axial and equatorial and leaves up and down alone',
      'Methylcyclohexane prefers the equatorial chair by 7.6 kJ/mol',
      'The two chairs are conformers, not compounds you can separate',
    ],
    references: [
      {
        label: 'Klein, Organic Chemistry: the methyl A-value is an experimental free-energy gap, about 7.6 kJ/mol',
        url: 'https://openstax.org/books/organic-chemistry/pages/4-6-axial-and-equatorial-bonds-in-cyclohexane',
      },
    ],
  },
  concepts: {
    primary: ['cyclohexane chair'],
    secondary: ['chair flip', 'axial vs equatorial', '1,3-diaxial strain', 'A-value'],
    related: ['newman projection', 'methylcyclohexane'],
    aliases: [
      'cyclohexane chair',
      'cyclohexane chair flip',
      'chair conformation calculator',
      'axial vs equatorial',
      '1,3-diaxial strain',
      'methylcyclohexane conformer',
    ],
  },
  equations: [
    {
      id: 'boltzmann',
      symbol: 'K',
      expression: 'K = e^(-dE / RT)',
      description: 'Axial population divided by equatorial population. dE is 0 for cyclohexane and 7.6 kJ/mol for a methyl group.',
      variables: [
        { symbol: 'K', label: 'Axial over equatorial', unit: '', measurementId: 'axialPopulation' },
        { symbol: 'dE', label: 'Chair gap', unit: 'kJ/mol', measurementId: 'gap' },
        { symbol: 'T', label: 'Temperature', unit: 'K', paramId: 'temperature' },
      ],
    },
  ],
  educational: {
    summary: 'Flip a cyclohexane chair and watch up stay up while axial and equatorial trade places.',
    intentGroups: {
      informational: ['What is a cyclohexane chair?', 'What is 1,3-diaxial strain?'],
      howTo: ['How do you read a cyclohexane chair?', 'How do you turn an A-value into a population?'],
      comparison: ['Axial vs equatorial methyl', 'Chair flip vs a Newman projection'],
      misconception: ['A chair flip does not swap up and down', 'The two chairs are not separable compounds'],
      troubleshooting: ['Which mistakes lose the point on a chair flip'],
    },
    commonMistakes: [
      'Inverting up and down',
      'Calling the two chairs separable isomers',
      'Drawing the methyl axial in the lower-energy chair',
    ],
    realWorldUseCases: [
      'Checking a chair drawing before an organic exam',
      'Seeing why a bulky group sits equatorial',
      'Comparing a chair flip with a Newman projection of one bond',
    ],
    audience: ['organic chemistry students', 'chemistry teachers'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Cyclohexane Chair Flip: Axial vs Equatorial',
    description:
      'Cyclohexane chair flip. Conformation, axial vs equatorial, 1,3-diaxial strain, methylcyclohexane conformer. Runs entirely on your device. Nothing is uploaded.',
    tagline: 'Flip the chair. Up stays up, and the population follows.',
    keywords: [
      'conformation',
      'axial vs equatorial',
      '1,3-diaxial strain',
      'methylcyclohexane conformer',
    ],
  },
  presentation: {
    tags: [
      'conformation',
      'axial vs equatorial',
      '1,3-diaxial strain',
      'methylcyclohexane conformer',
    ],
    updatedAt: '2026-10-31',
    trustVariant: 'offline',
  },
  examples: [
    {
      title: 'Cyclohexane',
      body: 'No substituent, so the two chairs cost the same. The flip still swaps axial and equatorial, and the population stays 50/50.',
    },
    {
      title: 'Methyl, equatorial',
      body: 'At the start of the flip the methyl is up and equatorial. That chair is lower by 7.6 kJ/mol, about 95.5 percent of the population at 298 K.',
    },
    {
      title: 'Methyl, after the flip',
      body: 'The same methyl is still up, and it is now axial. The readout says so. Nothing on the page turns up into down.',
    },
  ],
  faq: [
    {
      question: 'What is a cyclohexane chair?',
      answer:
        'A chair is the puckered shape cyclohexane sits in so the bonds can keep a tetrahedral angle. Six carbons alternate up and down around the ring. Straight up or down from a carbon is axial. Out to the side is equatorial.',
    },
    {
      question: 'What is the difference between axial and equatorial?',
      answer:
        'Axial points straight up or down from the ring. Equatorial points out to the side. A chair flip swaps those two labels on every carbon. It does not swap which face of the ring the group is on.',
    },
    {
      question: 'Does a chair flip change up into down?',
      answer:
        'No. A group that starts up is still up after the flip. What changes is axial versus equatorial. Drag the chair flip slider from 0 to 100 and the label goes from "up, now equatorial" to "up, now axial".',
    },
    {
      question: 'Why is equatorial methyl lower in energy than axial methyl?',
      answer:
        'An axial methyl crowds the two axial hydrogens on the same face. That 1,3-diaxial strain costs about 7.6 kJ/mol. Equatorial methyl points away from those hydrogens, so that chair is the lower one.',
    },
    {
      question: 'What is 1,3-diaxial strain?',
      answer:
        'It is the push between an axial substituent and the axial hydrogens two carbons away, on the same face of the ring. For a methyl group that push is the whole 7.6 kJ/mol gap between the chairs.',
    },
    {
      question: 'What percent of methylcyclohexane is equatorial at room temperature?',
      answer:
        'About 95.5 percent at 298.15 K. The gap is 7.6 kJ/mol and R is 0.008314 kJ/mol·K, so K = e^(-7.6 / RT) and the equatorial share is 1 / (1 + K). The Equatorial share readout on the page is that percent.',
    },
    {
      question: 'What happens to the population when the temperature rises?',
      answer:
        'The axial share grows, because RT gets closer to the 7.6 kJ/mol gap. Near room temperature the equatorial chair stays the majority. The two shares meet only if the gap itself is zero, which is unsubstituted cyclohexane.',
    },
    {
      question: 'Are the two chairs different compounds you can separate?',
      answer:
        'No. They are conformers of one compound. The ring flips through the half-chair many times at room temperature, so a bottle holds both chairs in the ratio the gap sets.',
    },
    {
      question: 'How is this different from a Newman projection?',
      answer:
        'A Newman projection looks end-on at one bond and reads a dihedral. A chair is the ring those bonds sit in. Use the Newman page for anti and gauche. Use this page when the question is axial, equatorial, and which face stays up.',
    },
    {
      question: 'Does this page upload the molecule?',
      answer: 'No. The flip, the gap, and the population are computed in the browser. Nothing is uploaded.',
    },
  ],
  guide: {
    slug: 'how-cyclohexane-chairs-work',
    title: 'How Cyclohexane Chairs Work',
    description:
      'How to read axial and equatorial, keep up through a chair flip, and turn a 7.6 kJ/mol methyl gap into a population.',
    readMinutes: 7,
    updatedAt: '2026-10-31',
    quickAnswer:
      'A chair flip swaps axial and equatorial on every carbon, and it does not swap up and down. Methylcyclohexane prefers the chair where the methyl is equatorial, by about 7.6 kJ/mol, which is most of the population at room temperature.',
    sections: [
      {
        id: 'read',
        heading: 'How Do You Read A Cyclohexane Chair?',
        body:
          'Axial points straight up or down. Equatorial points out to the side. The axial vs equatorial choice is which of those two directions the substituent takes. Up and down are fixed to the carbon. The flip changes the first label only. On this page the methyl marker starts out to the side and ends straight up, and the caption keeps the word up the whole way.',
      },
      {
        id: 'flip',
        heading: 'What Happens In A Chair Flip?',
        body:
          'A cyclohexane chair flip is the ring passing from one chair to the other. Drag Chair flip from 0 to 100 on methylcyclohexane. It starts equatorial-up and ends axial-up. The halfway mark is the half-chair, the high point between the wells. The boat is that high region. This chair conformation calculator does not minimise a boat, so the boat is a label on the barrier, not a third well.',
      },
      {
        id: 'methyl',
        heading: 'What Is The Difference Between Axial And Equatorial Methyl?',
        body:
          'The methylcyclohexane conformer you want on an exam is the one with the methyl equatorial. Same substituent, same up and down, different crowding. For example, 1,3-diaxial strain is two axial hydrogens on the same face of the ring. The 7.6 kJ/mol A-value is the whole difference for methyl. Cyclohexane with no substituent has a gap of 0, and the Chair gap readout says so.',
      },
      {
        id: 'population',
        heading: 'How Do You Turn That Gap Into A Population?',
        body:
          'How do you turn an A-value into a population? The formula is K = e^(-dE / RT) with dE = 7.6 kJ/mol, T = 298 K, and R = 0.008314 kJ/mol·K. The equatorial share is 1 / (1 + K), about 95.5 percent at 298.15 K, which is the Equatorial share readout. For example, if the temperature slider moves up, the axial share grows, and it does not become the majority for methyl near room temperature.',
      },
      {
        id: 'mistakes',
        heading: 'Which Mistakes Lose The Point?',
        body:
          'Inverting up and down. Calling the two chairs separable isomers. Drawing the methyl axial in the lower-energy chair. Each one is a drawing error, and the label on this page is there so the first one is visible: up stays up.',
        bullets: [
          'Checking a chair drawing before an organic exam starts with the up and down chips.',
          'Seeing why a bulky group sits equatorial is the same 7.6 kJ/mol gap, only larger for tert-butyl.',
          'Comparing a chair flip with a Newman projection of one bond keeps the ring and the end-on view as two jobs.',
        ],
      },
      {
        id: 'newman',
        heading: 'Where Do Newman Projections Fit?',
        body:
          'Newman is the end-on view of one bond. The chair is the ring those bonds sit in. Open the Newman projection calculator when the question is anti versus gauche. Stay here when the question is which face of the ring the group is on.',
      },
    ],
    mistakes: [
      {
        heading: 'Inverting Up And Down',
        body: 'Inverting up and down is the mistake that loses the exam point. A flip turns axial-up into equatorial-up. It does not turn it into axial-down.',
      },
      {
        heading: 'Calling The Chairs Separable Isomers',
        body: 'Calling the two chairs separable isomers treats a fast flip as two bottles. They are conformers of one compound.',
      },
      {
        heading: 'Drawing Methyl Axial On The Lower Chair',
        body: 'Drawing the methyl axial in the lower-energy chair reverses the 7.6 kJ/mol gap. The lower chair is the equatorial one.',
      },
    ],
  },
  relationships: {
    usedWith: [
      {
        slug: 'newman-projection-calculator',
        reason: 'Newman is the end-on view of one bond in the ring this page flips',
        strength: 0.8,
      },
      {
        slug: 'molecular-geometry-calculator',
        reason: 'Both pages turn a count of groups around an atom into a shape you can read',
        strength: 0.4,
      },
    ],
  },
  citation: {
    problem: 'Flip a cyclohexane chair and read which substituents stay up, what the strain costs, and which chair the population prefers.',
    nonGoal: 'draw an arbitrary substituted ring from a name you type, or assign R and S.',
  },
  job: {
    intent: 'analyze',
    userJob: 'Flip a cyclohexane chair and read which substituents stay up, what the 1,3-diaxial strain costs, and which chair the population prefers.',
    repeatability: 'medium',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  paramBehavior: cyclohexaneChair.paramBehavior,
  aspect: cyclohexaneChair.aspect,
  params: cyclohexaneChair.params,
  presets: cyclohexaneChair.presets,
  formula: cyclohexaneChair.formula,
};
