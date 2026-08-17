// Declarative manifest for the Doppler Effect Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in doppler-effect.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import dopplerEffect from './doppler-effect';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Doppler Effect Calculator',
    slug: 'doppler-effect-calculator',
    processorId: 'doppler-effect',
    domain: 'physics',
    category: 'physics',
    family: 'waves',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['frequency', 'wave speed'],
    nextTopics: ['sonic booms', 'redshift'],
    curriculumTags: ['waves'],
    learningObjectives: [
      'Explain why a moving source shifts the observed frequency',
      'State the Doppler formula f prime = f v / (v minus vs) for an approaching source',
      'Describe why the pitch drops as a source passes',
    ],
    keyTakeaways: [
      'A moving source bunches wavefronts ahead and stretches them behind',
      'The observed frequency is higher approaching and lower receding',
      'The shift grows with the source speed as a fraction of the wave speed',
    ],
  },
  concepts: {
    primary: ['Doppler effect'],
    secondary: ['frequency', 'wave speed', 'wavefront', 'pitch', 'mach number'],
    aliases: ['Doppler effect', 'Doppler shift', 'moving source', 'siren pitch'],
  },
  equations: [
    {
      id: 'doppler-approaching',
      symbol: 'fapp',
      expression: "f' = f v / (v - vs)",
      description: 'Observed frequency for a source approaching a stationary observer.',
      variables: [
        { symbol: "f'", label: 'Approaching frequency', unit: 'Hz', measurementId: 'approaching' },
        { symbol: 'f', label: 'Source frequency', unit: 'Hz', paramId: 'frequency' },
        { symbol: 'v', label: 'Wave speed', unit: 'm/s', paramId: 'waveSpeed' },
        { symbol: 'vs', label: 'Source speed', unit: 'm/s', paramId: 'sourceSpeed' },
      ],
    },
  ],
  educational: {
    summary:
      'Watch a moving source emit wavefronts that bunch up ahead and spread behind, and see the observed frequency shift up and down through the Doppler effect.',
    intentGroups: {
      informational: ['What is the Doppler effect?', 'What is a wavefront?', 'Why does a siren change pitch?'],
      howTo: ['How to calculate the Doppler shifted frequency', 'How to find the observed frequency of a moving source'],
      comparison: ['Approaching vs receding frequency', 'Moving source vs moving observer'],
      misconception: ['The source frequency itself does not change', 'The wave speed does not change with the source'],
      troubleshooting: ['Why the pitch drops as the source passes', 'Why a faster source gives a bigger shift'],
    },
    commonMistakes: [
      'Thinking the source actually changes its frequency',
      'Believing the wave travels faster because the source moves',
      'Forgetting that the shift depends on speed relative to the wave speed',
    ],
    realWorldUseCases: [
      'Understanding why an ambulance siren drops in pitch as it passes',
      'Seeing how police radar measures a car\'s speed',
      'Explaining the redshift of light from distant galaxies',
      'Introducing wave behavior before sonic booms',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Doppler Effect Calculator: Why Sirens Change Pitch',
    description:
      'See the Doppler effect in action: the frequency shift a moving source produces, with wavefronts bunching up ahead of it and stretching out behind.',
    tagline: 'Move a source and watch its wavefronts bunch up and stretch behind.',
    keywords: ['Doppler effect', 'Doppler shift', 'wavefront', 'frequency shift', 'siren pitch', 'doppler effect simulator'],
  },
  presentation: {
    tags: ['doppler effect calculator', 'Doppler effect', 'Doppler shift', 'wavefront', 'frequency', 'pitch', 'sound waves', 'waves', 'physics simulator'],
    updatedAt: '2026-07-12',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Passing ambulance', body: 'The siren sounds higher as it races toward you and drops as it passes, the classic Doppler shift.' },
    { title: 'Race car', body: 'A fast car gives a dramatic pitch drop because its speed is a large fraction of the sound speed.' },
    { title: 'Police radar', body: 'Radar reads the Doppler shift of the reflected wave to measure a car\'s speed.' },
    { title: 'Redshift', body: 'Light from galaxies moving away is stretched to lower frequencies, the reason distant galaxies look redshifted.' },
  ],
  faq: [
    {
      question: 'What is the Doppler effect?',
      answer:
        'The Doppler effect is the change in observed frequency when a wave source and an observer move relative to each other. As a source moves it chases the wavefronts it makes, so they bunch up ahead of it and spread out behind. An observer in front therefore receives a higher frequency, and one behind receives a lower frequency. The source itself never changes what it emits; only the received frequency shifts.',
    },
    {
      question: 'Why does a siren change pitch as it passes?',
      answer:
        'As the ambulance approaches, each wavefront is emitted a little closer to you than the last, so they arrive more often and the pitch is high. Once it passes, each wavefront is emitted a little farther away, so they arrive less often and the pitch drops. The sudden change from high to low as it goes by is the Doppler shift you hear. The source siren stays at one frequency the whole time.',
    },
    {
      question: 'How do I calculate the Doppler shifted frequency?',
      answer:
        'For a moving source and a stationary observer, the observed frequency is f prime = f v / (v minus vs) when the source approaches and f v / (v plus vs) when it recedes, where f is the source frequency, v is the wave speed, and vs is the source speed. To find the observed frequency of a moving source, plug in the speeds and the source frequency. The simulator does this live as you drag the sliders.',
    },
    {
      question: 'Does the source actually change its frequency?',
      answer:
        'No. The source emits the same frequency the whole time. What changes is the spacing of the wavefronts reaching the observer, because the source moves between emitting one crest and the next. This is why the effect depends on the relative motion, not on anything happening inside the source. The simulator shows the source frequency fixed while the observed values shift.',
    },
    {
      question: 'Why does a faster source give a bigger shift?',
      answer:
        'The shift depends on the source speed as a fraction of the wave speed, the Mach number. A faster source moves further between wavefronts, so it squashes them more tightly ahead and stretches them more behind. As the source speed approaches the wave speed the wavefronts ahead pile almost on top of each other, which in the extreme is what produces a sonic boom. The simulator shows the wavefronts crowding as you raise the source speed.',
    },
  ],
  guide: {
    slug: 'how-the-doppler-effect-works',
    title: 'How the Doppler Effect Works',
    description:
      'Why a moving source shifts the observed frequency, how to calculate the Doppler shift, and why a siren drops in pitch as it passes.',
    readMinutes: 5,
    updatedAt: '2026-07-12',
    quickAnswer:
      'The Doppler effect is the shift in observed frequency when a source moves relative to an observer. A moving source bunches its wavefronts up ahead and stretches them behind, so an observer it approaches hears a higher frequency and one it has passed hears a lower one. For example, an ambulance siren sounds high then drops as it goes by. The observed frequency approaching is f prime = f v / (v minus vs). Open this simulator, move the source, and watch the wavefronts and the observed frequency respond.',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How the Doppler Effect Works',
        body:
          'The canvas draws a source that loops across the screen emitting circular wavefronts. When the source sits still the circles are evenly spaced, but when it moves it chases the wavefronts ahead of it. For example, that is why the frequency shifts: each new wavefront ahead starts closer to the observer than the last, so they arrive more often. Behind the source the opposite happens and they arrive less often, giving a lower frequency.',
      },
      {
        id: 'the-quantities',
        heading: 'Source Frequency, Wave Speed, and Source Speed',
        body: 'Three quantities set the Doppler shift, and the source frequency is not one that changes.',
        bullets: [
          'Source frequency (f): the pitch the source emits. It stays fixed no matter how fast the source moves.',
          'Wave speed (v): how fast the wavefronts travel through the medium, unchanged by the source motion.',
          'Source speed (vs): how fast the source moves. The bigger it is relative to v, the larger the shift.',
        ],
      },
      {
        id: 'calculate',
        heading: 'Calculating the Doppler Shift',
        body:
          'To calculate the Doppler shifted frequency for an approaching source, use f prime = f v / (v minus vs); for a receding source, use f v / (v plus vs). To find the observed frequency of a moving source, put in the source frequency, the wave speed, and the source speed. For example, a 440 Hz source moving at 60 m/s through air at 340 m/s is heard near 535 Hz approaching and 372 Hz receding, and the simulator reads both off as you drag the sliders.',
      },
      {
        id: 'mach',
        heading: 'Approaching vs Receding, and the Mach Number',
        body:
          'Comparing approaching vs receding, the approaching frequency is always higher and the receding one always lower than the source frequency. How big the gap is depends on the Mach number, the source speed divided by the wave speed. For example, a race car at a large fraction of the sound speed gives a dramatic pitch drop, while a slow source barely shifts at all. As the Mach number nears one the wavefronts ahead pile up, the edge of a sonic boom.',
      },
    ],
    mistakes: [
      {
        heading: 'Thinking the source changes its frequency',
        body:
          'The source emits one steady frequency the whole time. Unlike the observed pitch, what the source produces never changes; only the spacing of the wavefronts reaching the observer does. The simulator keeps the source frequency fixed while the approaching and receding readings move.',
      },
      {
        heading: 'Believing the wave speeds up with the source',
        body:
          'The wave speed is set by the medium, not by the source. A faster source does not make its waves travel faster; it just packs them closer together ahead of it. That crowding, not a change in speed, is what raises the observed frequency.',
      },
      {
        type: 'note',
        heading: 'Try it yourself',
        body:
          'Load the Passing ambulance preset to hear the classic shift, then raise the source speed toward Near sonic and watch the wavefronts crowd in front. Set the source speed to zero to see even circles with no shift. Everything runs in your browser and works offline. To revisit the basics, try the wave speed simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: dopplerEffect.paramBehavior,
  aspect: dopplerEffect.aspect,
  params: dopplerEffect.params,
  presets: dopplerEffect.presets,
  formula: dopplerEffect.formula,
};
