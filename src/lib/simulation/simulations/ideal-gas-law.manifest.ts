// Declarative manifest for the Ideal Gas Law Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in ideal-gas-law.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import idealGasLaw from './ideal-gas-law';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Ideal Gas Law Calculator',
    slug: 'ideal-gas-law-calculator',
    processorId: 'ideal-gas-law',
    domain: 'physics',
    category: 'physics',
    family: 'thermodynamics',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['pressure', 'temperature', 'volume'],
    nextTopics: ['kinetic theory of gases', 'thermodynamic processes'],
    curriculumTags: ['thermodynamics'],
    learningObjectives: [
      'State the ideal gas law PV = nRT',
      'Predict how pressure changes when volume or temperature changes',
      'Explain gas pressure in terms of particle collisions',
    ],
    keyTakeaways: [
      'The ideal gas law is PV = nRT',
      'At fixed temperature, pressure and volume are inversely related',
      'Heating a gas at fixed volume raises its pressure',
    ],
  },
  concepts: {
    primary: ['ideal gas law'],
    secondary: ['pressure', 'volume', 'temperature', 'moles', 'kinetic theory'],
    aliases: ['ideal gas law', 'PV = nRT', 'gas laws', 'Boyle\'s law'],
  },
  equations: [
    {
      id: 'ideal-gas-law',
      symbol: 'P',
      expression: 'P V = n R T',
      description: 'Pressure times volume equals amount times the gas constant times temperature.',
      variables: [
        { symbol: 'P', label: 'Pressure', unit: 'kPa', measurementId: 'pressure' },
        { symbol: 'V', label: 'Volume', unit: 'L', paramId: 'volume' },
        { symbol: 'n', label: 'Amount', unit: 'mol', paramId: 'amount' },
        { symbol: 'T', label: 'Temperature', unit: 'K', paramId: 'temperature' },
      ],
    },
  ],
  educational: {
    summary:
      'Watch a box of gas particles and see how pressure, volume, and temperature are linked through the ideal gas law PV = nRT.',
    intentGroups: {
      informational: ['What is the ideal gas law?', 'What is gas pressure?', 'What is a mole of gas?'],
      howTo: ['How to calculate the pressure of a gas', 'How to find the volume from the ideal gas law'],
      comparison: ['Pressure vs volume', 'High vs low temperature'],
      misconception: ['Pressure comes from particle collisions, not weight', 'Temperature must be in kelvin, not celsius'],
      troubleshooting: ['Why compressing a gas raises its pressure', 'Why heating a sealed gas raises its pressure'],
    },
    commonMistakes: [
      'Using celsius instead of kelvin in the ideal gas law',
      'Thinking pressure comes from the weight of the gas',
      'Forgetting that pressure and volume are inversely related',
    ],
    realWorldUseCases: [
      'Understanding why a bike pump warms up as you compress the air',
      'Seeing why a sealed can bursts when heated',
      'Explaining how a hot air balloon rises',
      'Introducing the kinetic theory of gases',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Ideal Gas Law Calculator: PV = nRT',
    description:
      'See the ideal gas law come alive. Set the temperature, volume, and amount and watch the pressure and the gas particles respond through PV = nRT.',
    keywords: ['ideal gas law', 'PV = nRT', 'gas pressure', 'gas laws', 'Boyle\'s law', 'gas law simulator'],
  },
  presentation: {
    tags: ['ideal gas law calculator', 'ideal gas law', 'PV = nRT', 'gas pressure', 'volume', 'temperature', 'Boyle\'s law', 'thermodynamics', 'gas simulator'],
    updatedAt: '2026-07-12',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Bike pump', body: 'Push the piston in and the same gas in a smaller volume climbs in pressure, and the air warms up.' },
    { title: 'Sealed can in the sun', body: 'Heat a fixed volume of gas and the pressure rises, which is why aerosol cans warn against heat.' },
    { title: 'Hot air balloon', body: 'Warming the gas lowers its density at fixed pressure, so the balloon floats upward.' },
    { title: 'Boyle isotherm', body: 'At fixed temperature, halving the volume doubles the pressure, tracing the P-V hyperbola on the graph.' },
  ],
  faq: [
    {
      question: 'What is the ideal gas law?',
      answer:
        'The ideal gas law states that PV = nRT: pressure times volume equals the amount of gas in moles times the gas constant R times the absolute temperature. Rearranged, the pressure is P = nRT / V. It ties together the four things that describe a gas, and it holds well for real gases at everyday pressures. The simulator runs it live, so changing any slider updates the pressure instantly.',
    },
    {
      question: 'Why does compressing a gas raise its pressure?',
      answer:
        'Squeezing the same amount of gas into a smaller volume packs the particles closer, so they strike the walls more often. Because P = nRT / V, halving the volume at fixed temperature doubles the pressure. This inverse link between pressure and volume is Boyle\'s law, and you can trace it as the P-V hyperbola on the graph while dragging the piston.',
    },
    {
      question: 'Why does heating a sealed gas raise its pressure?',
      answer:
        'Heating the gas makes the particles move faster, so they hit the walls harder and more often. At fixed volume and amount, pressure is proportional to the absolute temperature, so doubling the kelvin temperature doubles the pressure. That is why a sealed can left in the sun can burst. The simulator shows the particles speeding up as you raise the temperature.',
    },
    {
      question: 'Do I use celsius or kelvin in the ideal gas law?',
      answer:
        'Always kelvin. The ideal gas law needs an absolute temperature, where zero means no thermal motion, so you must convert celsius to kelvin by adding 273.15 first. Using celsius gives nonsense, including negative or zero pressures. The simulator works in kelvin throughout to keep the relationship correct.',
    },
    {
      question: 'What causes gas pressure?',
      answer:
        'Pressure comes from countless particle collisions with the container walls, not from the weight of the gas. Each impact gives the wall a tiny push, and the collective effect over the whole surface is the pressure. More particles, faster particles, or a smaller box all increase the collision rate and therefore the pressure, exactly as PV = nRT predicts.',
    },
    {
      question: 'Does the simulator send my data anywhere?',
      answer:
        'No. Everything runs in your browser with a canvas and simple arithmetic. Nothing is uploaded or stored remotely, and the simulator keeps working offline after the page loads.',
    },
  ],
  guide: {
    slug: 'how-the-ideal-gas-law-works',
    title: 'How the Ideal Gas Law Works: PV = nRT',
    description:
      'A visual guide to the ideal gas law: what pressure, volume, temperature, and moles mean, why PV = nRT, and how heating or compressing a gas changes it.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      'The ideal gas law says PV = nRT: the pressure times the volume of a gas equals the amount in moles times the gas constant R times the absolute temperature. Rearranged, the pressure is P = nRT / V. For example, one mole of gas at 300 K in 25 litres sits near 100 kPa. Squeeze the volume or raise the temperature and the pressure climbs. Temperature must be in kelvin. Open this simulator, drag the piston or a slider, and watch the pressure and the gas particles respond live.',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How the Ideal Gas Law Works',
        body:
          'The canvas draws a box of gas particles with a movable piston. The particles bounce around and strike the walls, and the sum of those collisions is the pressure. For example, that is why PV = nRT holds: more particles, faster particles, or a smaller box all increase the collision rate. Raise the temperature and the particles speed up; drag the piston in and they crowd together. Each change pushes the pressure in the direction the equation predicts.',
      },
      {
        id: 'the-four-quantities',
        heading: 'Pressure, Volume, Temperature, and Amount',
        body: 'Four quantities describe the gas, and the ideal gas law links them.',
        bullets: [
          'Pressure (P), in kilopascals: the force per area from particle collisions with the walls.',
          'Volume (V), in litres: the space the gas fills, set here by the piston.',
          'Temperature (T), in kelvin: how fast the particles move. It must be absolute, never celsius.',
          'Amount (n), in moles: how many particles there are, which sets how many the box holds.',
        ],
      },
      {
        id: 'calculate',
        heading: 'Calculating Pressure and Volume',
        body:
          'To calculate the pressure of a gas, rearrange to P = nRT / V: multiply the amount by the gas constant and the kelvin temperature, then divide by the volume. To find the volume from the ideal gas law instead, use V = nRT / P. For example, one mole at 300 K in 25 litres gives a pressure near 100 kPa, and doubling the temperature to 600 K doubles that pressure. The simulator does the arithmetic live as you move each slider.',
      },
      {
        id: 'pressure-and-volume',
        heading: 'Pressure vs Volume and Temperature',
        body:
          'At a fixed temperature, pressure and volume are inversely related: halve the volume and the pressure doubles, tracing Boyle\'s law as a hyperbola. For example, a bike pump warms and stiffens as you push the piston in. At a fixed volume, pressure instead rises in step with the absolute temperature, which is why a sealed can heated in the sun can burst. Comparing high vs low temperature in the simulator shows the particles speeding up and the pressure climbing.',
      },
    ],
    mistakes: [
      {
        heading: 'Using celsius instead of kelvin',
        body:
          'The ideal gas law needs an absolute temperature, so you must convert celsius to kelvin by adding 273.15 first. Unlike a difference in temperature, the value that goes into PV = nRT has to start from absolute zero. Feeding in celsius gives wrong, sometimes negative, pressures. The simulator uses kelvin throughout.',
      },
      {
        heading: 'Thinking pressure comes from the gas weight',
        body:
          'Gas pressure comes from particle collisions with the walls, not from the weight of the gas pressing down. That is why pressure pushes outward in every direction equally. More or faster particles, or a smaller box, raise the collision rate and the pressure, exactly as the equation predicts.',
      },
      {
        type: 'note',
        heading: 'Try it yourself',
        body:
          'Load the Compressed preset to see a small volume at high pressure, then switch to Heated gas to watch temperature drive the pressure up instead. Drag the piston to trace the P-V curve on the graph. Everything runs in your browser and works offline. To explore heat flow next, try the heat transfer simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: idealGasLaw.paramBehavior,
  aspect: idealGasLaw.aspect,
  params: idealGasLaw.params,
  presets: idealGasLaw.presets,
  formula: idealGasLaw.formula,
};
