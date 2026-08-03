// Declarative manifest for the Frequency & Period Simulator. Single source of truth for its
// config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in
// frequency-period.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import frequencyPeriod from './frequency-period';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Frequency and Period Calculator',
    slug: 'frequency-period-calculator',
    processorId: 'frequency-period',
    domain: 'physics',
    category: 'physics',
    family: 'oscillations',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['frequency', 'period'],
    nextTopics: ['simple harmonic motion', 'angular frequency'],
    curriculumTags: ['oscillations'],
    learningObjectives: [
      'State the reciprocal relationship T = 1 / f',
      'Convert a frequency in hertz to a period in seconds',
      'Explain what angular frequency omega = 2 pi f means',
    ],
    keyTakeaways: [
      'Frequency and period are reciprocals: T = 1 / f',
      'Double the frequency and the period halves',
      'Angular frequency omega = 2 pi f measures the same motion in radians per second',
    ],
  },
  concepts: {
    primary: ['frequency and period'],
    secondary: ['angular frequency', 'oscillation', 'hertz', 'reciprocal', 'cycles per second'],
    aliases: ['frequency and period', 'period of oscillation', 'T = 1/f', 'angular frequency'],
  },
  equations: [
    {
      id: 'period-frequency',
      symbol: 'T',
      expression: 'T = 1 / f',
      description: 'Period equals one divided by frequency.',
      variables: [
        { symbol: 'T', label: 'Period', unit: 's', measurementId: 'period' },
        { symbol: 'f', label: 'Frequency', unit: 'Hz', paramId: 'frequency' },
      ],
    },
    {
      id: 'angular-frequency',
      symbol: 'omega',
      expression: 'omega = 2 pi f',
      description: 'Angular frequency equals two pi times frequency.',
      variables: [
        { symbol: 'omega', label: 'Angular frequency', unit: 'rad/s', measurementId: 'angular' },
        { symbol: 'f', label: 'Frequency', unit: 'Hz', paramId: 'frequency' },
      ],
    },
  ],
  educational: {
    summary:
      'Watch an oscillator and see how frequency and period are reciprocals through T = 1 / f, with a tap-the-beat input.',
    intentGroups: {
      informational: ['What is the relationship between frequency and period?', 'What is angular frequency?', 'What is period of oscillation?'],
      howTo: ['How to convert frequency to period', 'How to find angular frequency from frequency'],
      comparison: ['Frequency vs period', 'Frequency vs angular frequency'],
      misconception: ['Period is not proportional to frequency, it is the reciprocal'],
      troubleshooting: ['Why the period halves when I double the frequency'],
    },
    commonMistakes: [
      'Thinking a higher frequency means a longer period',
      'Confusing angular frequency (rad/s) with ordinary frequency (Hz)',
    ],
    realWorldUseCases: [
      'Converting a metronome tempo in beats per minute into a frequency',
      'Understanding why mains electricity at 50 Hz has a 20 ms period',
      'Relating a heart rate to the time between beats',
      'Preparing for a physics topic on simple harmonic motion',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Frequency and Period Calculator: T = 1 / f',
    description:
      'See how frequency and period are two views of one motion. Tap a beat or drag the slider and watch the period and angular frequency update live.',
    keywords: ['frequency', 'period', 'T = 1/f', 'angular frequency', 'oscillation', 'hertz'],
  },
  presentation: {
    tags: ['frequency to period calculator', 'frequency', 'period', 'T = 1/f', 'angular frequency', 'oscillation', 'frequency to period', 'hertz', 'cycles per second'],
    updatedAt: '2026-07-09',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Mains electricity', body: 'European mains runs at 50 Hz, so its period is 1 / 50 = 0.02 seconds, or 20 milliseconds per cycle.' },
    { title: 'Resting heart rate', body: 'A heart at 60 beats per minute beats at 1 Hz, so the period is 1 second between beats.' },
    { title: 'Metronome', body: 'Tap a steady tempo and the simulator reads both the frequency in hertz and the period in seconds.' },
    { title: 'Simple harmonic motion', body: 'A mass on a spring or a pendulum repeats at its own frequency, and its period follows the same T = 1 / f idea.' },
  ],
  faq: [
    {
      question: 'What is the relationship between frequency and period?',
      answer:
        'They are exact reciprocals: T = 1 / f, and equivalently f = 1 / T. Frequency counts cycles per second (hertz); period measures seconds per cycle. Multiply them together and you always get one. At 2 Hz the period is 0.5 seconds; at 0.25 Hz it is 4 seconds. The simulator shows both at once so you can watch one shrink as the other grows.',
    },
    {
      question: 'What is angular frequency?',
      answer:
        'Angular frequency, written omega, measures how fast the oscillation advances in radians per second: omega = 2 pi f. One full cycle is 2 pi radians, so a 1 Hz oscillation has an angular frequency of about 6.28 rad/s. It is the natural unit for the sine function that describes the motion, which is why it appears throughout wave and oscillation equations.',
    },
    {
      question: 'How does the tap-the-beat feature work?',
      answer:
        'Tap or click the canvas in a steady rhythm and the simulator measures the time between your taps, then sets the frequency to match. Tapping once a second gives 1 Hz; tapping twice a second gives 2 Hz. It is a hands-on way to feel that frequency is simply how often something repeats, turned into a number.',
    },
    {
      question: 'If I double the frequency, what happens to the period?',
      answer:
        'The period halves. Because T = 1 / f, frequency and period always move in opposite directions by the same factor. Double the frequency and each cycle has half as much time; halve the frequency and each cycle lasts twice as long. Drag the frequency slider and watch the period reading move the opposite way.',
    },
    {
      question: 'Does this simulator send my data anywhere?',
      answer:
        'No. Everything runs in your browser with a canvas and simple maths. Nothing is uploaded or stored remotely, and the simulator keeps working offline after the page loads.',
    },
  ],
  guide: {
    slug: 'how-frequency-and-period-relate',
    title: 'Frequency and Period: T = 1 / f',
    description:
      'How frequency and period are reciprocals, how to convert frequency to period, what angular frequency means, and why doubling frequency halves the period.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      'Frequency and period are two views of the same oscillation, and they are reciprocals: T = 1 / f. Frequency (f) counts how many cycles happen each second, measured in hertz. Period (T) is the time one cycle takes, measured in seconds. For example, a 2 Hz oscillation repeats twice a second, so its period of oscillation is 1 / 2 = 0.5 seconds. Open the simulator, drag the frequency slider or tap a beat, and watch the period and angular frequency update live.',
    sections: [
      {
        id: 'frequency-vs-period',
        heading: 'Frequency vs Period',
        body:
          'Frequency and period describe the same repeating motion from opposite ends. Frequency answers "how many cycles per second," and period answers "how many seconds per cycle." Because one is cycles-per-second and the other is seconds-per-cycle, multiplying them always gives one: f times T = 1. That is why the relationship between frequency and period is a reciprocal, not a proportion. Raise the frequency and the period shrinks; lower it and the period grows. They move in opposite directions, locked together by T = 1 / f.',
      },
      {
        id: 'how-it-works',
        heading: 'How It Works',
        body:
          'The canvas shows an oscillator repeating its cycle at the frequency you set. A readout converts that frequency to period directly through T = 1 / f, so you never do the arithmetic by hand. To convert frequency to period yourself, divide one by the frequency in hertz. The tap-the-beat input works the other way: it times the gap between your taps, reads that as a period, and reports the matching frequency, which is how a metronome tempo in cycles per second is found from real timing.',
      },
      {
        id: 'angular-frequency',
        heading: 'What Is Angular Frequency?',
        body:
          'Angular frequency, written omega, measures the same oscillation in radians per second instead of cycles per second. One full cycle is 2 pi radians, so omega = 2 pi f. To find angular frequency from frequency, multiply the hertz value by 2 pi. For example, a 1 Hz signal has an angular frequency of about 6.28 rad/s. Frequency vs angular frequency is simply a change of units: ordinary frequency counts whole cycles, while angular frequency counts the radians swept out, which is the form that appears in the equations for simple harmonic motion.',
      },
      {
        id: 'examples',
        heading: 'Examples',
        body:
          'For example, European mains runs at 50 Hz, so the period is 1 / 50 = 0.02 seconds, or 20 milliseconds per cycle, which is why a 50 Hz hum feels continuous. For example, a resting heart rate of 60 beats per minute is 1 Hz, so the period is 1 second between beats; double the rate to 120 bpm (2 Hz) and the period halves to 0.5 seconds. For example, tap the beat at a steady tempo and the tool reports both the frequency in hertz and the period in seconds, turning a musical tempo into physics units.',
      },
    ],
    mistakes: [
      {
        heading: 'Thinking a higher frequency means a longer period',
        body:
          'Period is not proportional to frequency, it is the reciprocal. A higher frequency always means a shorter period, never a longer one. This is why the period halves when you double the frequency: T = 1 / f, so doubling f divides T in two. Drag the slider and watch the two numbers move in opposite directions.',
      },
      {
        heading: 'Confusing angular frequency with ordinary frequency',
        body:
          'Angular frequency in rad/s and ordinary frequency in hertz are not the same number. They differ by a factor of 2 pi. A 10 Hz oscillation has an angular frequency near 62.8 rad/s, so quoting one where the other belongs throws every result off by about 6.28.',
      },
      {
        type: 'note',
        heading: 'Everything runs on your device',
        body:
          'The simulation and every calculation run in your browser. Nothing you enter is uploaded, logged, or shared, and the page keeps working offline once loaded. When you need the frequency inside a wave calculation, carry it into the wave speed simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: frequencyPeriod.paramBehavior,
  aspect: frequencyPeriod.aspect,
  params: frequencyPeriod.params,
  presets: frequencyPeriod.presets,
  formula: frequencyPeriod.formula,
};
