// Declarative manifest for the Ohm's Law Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in ohms-law.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import ohmsLaw from './ohms-law';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: "Ohm's Law Simulator",
    slug: 'ohms-law-simulator',
    processorId: 'ohms-law',
    domain: 'physics',
    category: 'physics',
    family: 'electricity',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['voltage', 'current', 'resistance'],
    nextTopics: ['electrical power', 'series and parallel circuits'],
    curriculumTags: ['electricity'],
    learningObjectives: [
      'State Ohm\'s law I = V / R',
      'Predict how current changes when voltage or resistance changes',
      'Explain electrical power as P = V times I',
    ],
    keyTakeaways: [
      "Ohm's law is I = V / R",
      'Raising voltage raises current; raising resistance lowers it',
      'Power dissipated is P = V times I, which heats the resistor',
    ],
  },
  concepts: {
    primary: ["Ohm's law"],
    secondary: ['voltage', 'current', 'resistance', 'electrical power', 'circuit'],
    aliases: ["Ohm's law", 'I = V / R', 'V = I R', 'current voltage resistance'],
  },
  equations: [
    {
      id: 'ohms-law',
      symbol: 'I',
      expression: 'I = V / R',
      description: 'Current equals voltage divided by resistance.',
      variables: [
        { symbol: 'I', label: 'Current', unit: 'A', measurementId: 'current' },
        { symbol: 'V', label: 'Voltage', unit: 'V', paramId: 'voltage' },
        { symbol: 'R', label: 'Resistance', unit: 'Ω', paramId: 'resistance' },
      ],
    },
    {
      id: 'power',
      symbol: 'P',
      expression: 'P = V times I',
      description: 'Electrical power equals voltage times current.',
      variables: [
        { symbol: 'P', label: 'Power', unit: 'W', measurementId: 'power' },
        { symbol: 'V', label: 'Voltage', unit: 'V', paramId: 'voltage' },
        { symbol: 'I', label: 'Current', unit: 'A', measurementId: 'current' },
      ],
    },
  ],
  educational: {
    summary:
      "Set the voltage and resistance and watch the current and power update live through Ohm's law, with charge carriers flowing round a circuit.",
    intentGroups: {
      informational: ["What is Ohm's law?", 'What is electrical resistance?', 'What is electric current?'],
      howTo: ['How to calculate current from voltage and resistance', 'How to find power from voltage and current'],
      comparison: ['Voltage vs current', 'High vs low resistance'],
      misconception: ['Voltage is not the same as current', 'Higher resistance means less current, not more'],
      troubleshooting: ['Why the current drops when I raise the resistance', 'Why a low resistance overheats the resistor'],
    },
    commonMistakes: [
      'Confusing voltage with current',
      'Thinking more resistance gives more current',
      'Forgetting that power rises steeply as resistance falls',
    ],
    realWorldUseCases: [
      'Choosing a series resistor to protect an LED',
      'Understanding why a short circuit draws a dangerous current',
      'Sizing a resistor by the power it must dissipate',
      'Learning circuit basics before series and parallel networks',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: "Ohm's Law Simulator: I = V / R",
    description:
      "See Ohm's law come alive. Set the voltage and resistance and watch the current, power, and charge flow update live in an interactive circuit.",
    keywords: ["Ohm's law", 'I = V / R', 'voltage current resistance', 'electrical power', 'circuit simulator', 'ohms law calculator'],
  },
  presentation: {
    tags: ["Ohm's law", 'I = V / R', 'voltage', 'current', 'resistance', 'electrical power', 'circuit simulator', 'electronics'],
    updatedAt: '2026-07-12',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'LED with a series resistor', body: 'A 5 V supply through a 100 ohm resistor limits the current to 0.05 A, keeping an LED safe.' },
    { title: 'Flashlight bulb', body: 'A 3 V cell driving a 6 ohm filament pushes 0.5 A and glows at about 1.5 W.' },
    { title: 'Near short circuit', body: 'Drop the resistance to 2 ohms at 12 V and the current leaps to 6 A, dumping 72 W of heat.' },
    { title: 'Power scaling', body: 'Because P = V times I, halving the resistance at fixed voltage doubles both the current and the power.' },
  ],
  faq: [
    {
      question: "What is Ohm's law?",
      answer:
        "Ohm's law states that the current through a resistor equals the voltage across it divided by its resistance: I = V / R. Voltage (V) is the push, resistance (R) is the opposition, and current (I) is the resulting flow of charge. Rearranged, it also reads V = I times R or R = V / I. The simulator runs this live, so nudging either slider updates the current instantly.",
    },
    {
      question: 'How do voltage and resistance change the current?',
      answer:
        'Current rises with voltage and falls with resistance. Double the voltage and the current doubles; double the resistance and the current halves. That is the whole content of I = V / R: current is directly proportional to voltage and inversely proportional to resistance. Drag each slider in the simulator and watch the current reading respond in opposite directions.',
    },
    {
      question: 'What is electrical power in the circuit?',
      answer:
        'Power is the rate at which the resistor turns electrical energy into heat, and it equals voltage times current: P = V times I. Because I = V / R, this is also P = V squared / R, so power climbs steeply as resistance falls. The resistor in the simulator glows brighter as the power rises, which is why a near short circuit is dangerous.',
    },
    {
      question: 'Why does a low resistance draw so much current?',
      answer:
        'With little to oppose the flow, the same voltage pushes far more charge each second. At 12 V a 2 ohm resistance draws 6 A, while a 100 ohm resistance draws only 0.12 A. The power, P = V times I, rises even faster, so a very low resistance overheats quickly. The simulator shows the carriers speeding up and the resistor glowing as you lower the resistance.',
    },
    {
      question: 'Is the current the same everywhere in the loop?',
      answer:
        'Yes. In a single series loop the current is the same at every point, because charge is not created or destroyed along the way. The carriers in the simulator move round the whole loop at one speed set by I = V / R. Voltage, by contrast, is dropped across the resistor, which is where the energy is delivered.',
    },
    {
      question: 'Does the simulator send my data anywhere?',
      answer:
        'No. Everything runs in your browser with a canvas and simple arithmetic. Nothing is uploaded or stored remotely, and the simulator keeps working offline after the page loads.',
    },
  ],
  guide: {
    slug: 'how-ohms-law-works',
    title: "How Ohm's Law Works: I = V / R",
    description:
      "A visual guide to Ohm's law: what voltage, current, and resistance each mean, why I = V / R, how power P = V times I heats the resistor, and how to size a resistor.",
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      "Ohm's law says the current through a resistor is the voltage across it divided by its resistance: I = V / R. Voltage is the electrical push, resistance is the opposition to flow, and current is the resulting stream of charge. For example, 9 volts across 30 ohms gives a current of 9 / 30 = 0.3 amps. Raising the voltage raises the current, while raising the resistance lowers it. Open this circuit simulator, drag a slider, and watch the current and power update as the charge carriers speed up or slow down.",
    sections: [
      {
        id: 'how-it-works',
        heading: "How Ohm's Law Works",
        body:
          'The canvas draws a single loop with a battery on the left and a resistor on top. Charge carriers circulate round the loop, and their speed tracks the current. For example, that is why I = V / R: the battery voltage sets how hard the charge is pushed, the resistance sets how much it is held back, and the current is what results. Raise the voltage and the carriers speed up; raise the resistance and they slow to a crawl.',
      },
      {
        id: 'the-three-quantities',
        heading: 'Voltage, Current, and Resistance',
        body:
          'The voltage current resistance relationship is the heart of the circuit, and Ohm\'s law ties the three together as I = V / R, which rearranges to V = I R. Unlike voltage, which is the push from the battery, current is the flow that results, and resistance is what holds it back. To calculate the current from voltage and resistance, divide the voltage by the resistance; used this way the simulator doubles as an ohms law calculator that also shows the charge moving.',
        bullets: [
          'Voltage (V), in volts: the push from the battery that drives charge round the loop. More voltage means more current.',
          'Resistance (R), in ohms: how strongly the resistor opposes the flow. More resistance means less current.',
          'Current (I), in amps: the flow of charge, equal to V / R. It is the same at every point in a single loop.',
        ],
      },
      {
        id: 'power',
        heading: 'Power and Heat',
        body:
          'The resistor turns electrical energy into heat at a rate P = V times I, which is also P = V squared / R. To find the power from voltage and current, multiply the two together. For example, that is why power climbs so steeply as resistance falls: halving the resistance at a fixed voltage doubles the current and doubles the power. In the simulator the resistor glows brighter as the power rises, which is how you can see that a near short circuit dissipates dangerous amounts of heat.',
      },
      {
        id: 'examples',
        heading: 'Worked Examples',
        body:
          'For example, to protect an LED you might put 5 V across a 100 ohm resistor, so to calculate the current you divide voltage by resistance to get I = V / R = 0.05 A, a safe value. For example, a flashlight bulb of 6 ohms on a 3 V cell draws 0.5 A and glows at P = V times I = 1.5 W. For example, drop the resistance to 2 ohms at 12 V in the simulator and the current jumps to 6 A while the power reaches 72 W, showing why low resistance is risky.',
      },
    ],
    mistakes: [
      {
        heading: 'Confusing voltage with current',
        body:
          'Voltage is the push and current is the flow; they are not the same thing. A high voltage does not guarantee a high current if the resistance is also high. In the simulator, hold the voltage fixed and raise the resistance: the voltage reading stays put while the current falls, proving the two are distinct.',
      },
      {
        heading: 'Thinking more resistance gives more current',
        body:
          'Resistance opposes flow, so more of it means less current, not more. Because I = V / R, resistance sits in the denominator: doubling it halves the current. Drag the resistance slider up and watch the current reading drop and the carriers slow down.',
      },
      {
        type: 'note',
        heading: 'Try it yourself',
        body:
          'Load the Flashlight bulb preset for a bright, high-current circuit, then switch to LED plus resistor to see the current fall by a factor of ten. Drop the resistance toward the short-circuit preset and watch the resistor glow as the power climbs. Everything runs in your browser and works offline.',
      },
    ],
  },
  relationships: {
    usedWith: [
      { slug: 'frequency-period-simulator', reason: 'Both turn a core physics equation into a live, adjustable readout', strength: 0.5 },
    ],
    nextSteps: [
      { slug: 'wave-speed-simulator', reason: 'Explore another everyday physics law interactively', priority: 1 },
    ],
  },
  paramBehavior: ohmsLaw.paramBehavior,
  aspect: ohmsLaw.aspect,
  params: ohmsLaw.params,
  presets: ohmsLaw.presets,
  formula: ohmsLaw.formula,
};
