// Declarative manifest for the Wave Speed Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in wave-speed.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import waveSpeed from './wave-speed';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Wave Speed Calculator',
    slug: 'wave-speed-calculator',
    processorId: 'wave-speed',
    domain: 'physics',
    category: 'physics',
    family: 'waves',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['frequency', 'wavelength'],
    nextTopics: ['interference', 'the Doppler effect'],
    curriculumTags: ['waves'],
    learningObjectives: [
      'State the wave equation v = f times lambda',
      'Explain why amplitude does not change wave speed',
      'Distinguish wave speed from the speed of the medium particles',
    ],
    keyTakeaways: [
      'Wave speed is v = f times lambda',
      'Amplitude changes energy, not speed',
      'The medium bobs in place while the pattern travels',
    ],
  },
  concepts: {
    primary: ['wave speed'],
    secondary: ['frequency', 'wavelength', 'amplitude', 'period', 'travelling wave'],
    aliases: ['wave speed', 'wave velocity', 'v = f lambda', 'wave equation'],
  },
  equations: [
    {
      id: 'wave-speed',
      symbol: 'v',
      expression: 'v = f times lambda',
      description: 'Wave speed equals frequency times wavelength.',
      variables: [
        { symbol: 'v', label: 'Wave speed', unit: 'm/s', measurementId: 'waveSpeed' },
        { symbol: 'f', label: 'Frequency', unit: 'Hz', paramId: 'frequency' },
        { symbol: 'lambda', label: 'Wavelength', unit: 'm', paramId: 'wavelength' },
      ],
    },
  ],
  educational: {
    summary:
      'Visualize a travelling wave and see how frequency and wavelength set its speed through v = f times lambda, live and interactive.',
    intentGroups: {
      informational: ['What is wave speed?', 'What does v = f times lambda mean?', 'What is a travelling wave?'],
      howTo: ['How to calculate wave speed from frequency and wavelength', 'How to find the period of a wave'],
      comparison: ['Wave speed vs particle speed', 'Frequency vs wavelength'],
      misconception: ['Amplitude does not change wave speed', 'The medium does not travel with the wave'],
      troubleshooting: ['Why the wave speed stays the same when I change amplitude', 'Why higher frequency can mean shorter wavelength'],
    },
    commonMistakes: [
      'Thinking a taller (higher-amplitude) wave travels faster',
      'Assuming the medium particles move along with the wave',
      'Confusing frequency (cycles per second) with wave speed (metres per second)',
    ],
    realWorldUseCases: [
      'Understanding why pitch is frequency while sound speed is fixed by the air',
      'Seeing why all light travels at c but colours have different wavelengths',
      'Explaining how ocean swells of different wavelengths move at different speeds',
      'Building intuition for the wave equation before a physics exam',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Wave Speed Calculator: Explore v = f times lambda',
    description:
      'Watch a travelling wave in real time and see how frequency and wavelength set its speed. Drag the wave, change any value, and explore v = f times lambda live.',
    tagline: 'Watch a wave travel and see how frequency and wavelength set its speed.',
    keywords: ['wave speed', 'v = f lambda', 'frequency', 'wavelength', 'travelling wave', 'wave simulator'],
  },
  presentation: {
    tags: ['wave speed', 'wave speed calculator', 'v = f lambda', 'frequency and wavelength', 'wave simulation', 'travelling wave', 'wave physics', 'interactive wave'],
    updatedAt: '2026-07-10',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Ocean waves', body: 'Swells with long wavelengths and low frequencies roll across the sea at a steady speed set by v = f times lambda.' },
    { title: 'Sound', body: 'A 440 Hz concert-A travels through air at about 343 m/s, so its wavelength is roughly 0.78 m. Pitch is frequency, not speed.' },
    { title: 'Light and radio', body: 'Electromagnetic waves all travel at c in a vacuum, so a higher frequency simply means a proportionally shorter wavelength.' },
    { title: 'Guitar string', body: 'Fretting a string shortens the wavelength; the wave speed on the string barely changes, so the frequency (pitch) rises.' },
  ],
  faq: [
    {
      question: 'What is the wave speed formula?',
      answer:
        'Wave speed equals frequency times wavelength: v = f times lambda. Frequency (f) counts how many cycles pass a point each second, measured in hertz; wavelength is the distance between two crests, measured in metres. Multiply them and you get the speed in metres per second. The simulator runs this live, so nudging either slider updates the speed instantly.',
    },
    {
      question: 'Does changing the frequency change the wave speed?',
      answer:
        'It depends on what you hold constant. In this simulator frequency and wavelength are independent sliders, so raising the frequency while keeping the wavelength fixed does increase v = f times lambda. In many real media, though, the medium fixes the speed, and raising the frequency instead shortens the wavelength so the product stays the same. The simulator lets you explore both cases by choosing which value you change.',
    },
    {
      question: 'Does amplitude affect wave speed?',
      answer:
        'No. Amplitude sets how tall the wave is and how much energy it carries, but it does not change how fast the pattern travels. Drag the wave taller or flatter in the simulator and watch the wave speed reading stay put while the energy reading changes. Speed depends only on frequency and wavelength, or in a real medium on the medium itself.',
    },
    {
      question: 'What is the difference between wave speed and particle speed?',
      answer:
        'They are different things. The wave speed is how fast the crest pattern moves along, shown by the red crest marker. The medium particles, drawn as dots, only bob up and down in place; they never travel with the wave. Energy moves through the medium while the medium itself stays put, which is the defining feature of a wave.',
    },
    {
      question: 'How do I calculate the period from frequency?',
      answer:
        'The period is the time for one full cycle and is the reciprocal of frequency: T = 1 / f. At 2 Hz the period is 0.5 seconds; at 0.25 Hz it is 4 seconds. The simulator shows the period alongside the wave speed so you can see both change together as you move the frequency slider.',
    },
  ],
  guide: {
    slug: 'how-wave-speed-works',
    title: 'How Wave Speed Works: v = f times lambda',
    description:
      'A visual guide to wave speed: what frequency, wavelength, and amplitude change, why v = f times lambda, and what does not affect a wave speed.',
    readMinutes: 5,
    updatedAt: '2026-07-10',
    quickAnswer:
      "A wave's speed, or wave velocity, is how fast its crests travel, and it equals the frequency multiplied by the wavelength. What does v = f times lambda mean? The wave equation says speed is frequency times wavelength. Frequency is how many cycles pass a point each second, and wavelength is the distance from one crest to the next. For example, a 2 Hz wave with crests 3 metres apart moves at 6 metres per second. Amplitude, the height of the wave, changes its energy but never its speed. Open this wave simulator, drag a slider, and watch the speed update as you go.",
    sections: [
      {
        id: 'how-it-works',
        heading: 'How Wave Speed Works',
        body:
          'The canvas draws a travelling sine wave. A row of dots marks the medium: notice that each dot only bobs straight up and down. The wave pattern sweeps to the right while the medium itself stays put, which is the heart of what a wave is. A red marker rides one crest so you can watch it advance by exactly one wavelength every cycle. For example, that is why v = f times lambda: each cycle moves the pattern forward one wavelength, and f cycles happen every second.',
      },
      {
        id: 'variables',
        heading: 'The Three Controls',
        body: 'Three sliders shape the wave, and only two of them change its speed.',
        bullets: [
          'Frequency (f), in hertz: how many full cycles pass each second. Raise it and the crests race past faster; the period T = 1 / f shrinks.',
          'Wavelength (lambda), in metres: the distance between neighbouring crests. Stretch it and each cycle carries the pattern further, so the wave speeds up.',
          'Amplitude (A), in metres: the height of the crests. It sets how much energy the wave carries but has no effect on the speed.',
        ],
      },
      {
        id: 'what-changes-speed',
        heading: 'What Actually Changes The Speed',
        body:
          'In this simulator frequency and wavelength are independent, so changing either one changes the speed through v = f times lambda. In many real situations the medium fixes the speed instead: a sound wave in air always travels near 343 m/s, so playing a higher note raises the frequency and shortens the wavelength together, leaving the speed unchanged. For example, both stories obey the same equation; the difference is simply which quantity you are free to change and which one the medium pins down.',
      },
      {
        id: 'examples',
        heading: 'Worked Examples',
        body:
          'For example, a 2 Hz travelling wave with a 3 m wavelength has a wave velocity of 2 times 3 = 6 m/s, straight from the wave equation. For example, to find the period of a wave, that same 2 Hz wave has a period of 1 / f = 0.5 s. For example, drag the wave taller in the simulator and the speed reading holds while the energy reading climbs, proving amplitude does not change speed.',
      },
    ],
    mistakes: [
      {
        heading: 'Believing a taller wave travels faster',
        body:
          'Amplitude and speed are unrelated. A louder or taller wave carries more energy, but the pattern still travels at v = f times lambda. Drag the wave taller in the simulator and the speed reading does not move.',
      },
      {
        heading: 'Thinking the medium flows along with the wave',
        body:
          'Only the disturbance moves; the particles stay home. The dots in the simulator bob up and down in place while the crest pattern sweeps past them, which is the defining feature of a wave.',
      },
      {
        type: 'note',
        heading: 'Try it yourself',
        body:
          'Load the Ocean swell preset to see a slow, long wave, then switch to Pond ripple for a fast, tight one and compare their speeds. Drag directly on the wave to change its height and confirm the speed does not budge. To zoom in on the frequency and period behind the wave, carry on to the frequency and period simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: waveSpeed.paramBehavior,
  aspect: waveSpeed.aspect,
  params: waveSpeed.params,
  presets: waveSpeed.presets,
  formula: waveSpeed.formula,
};
