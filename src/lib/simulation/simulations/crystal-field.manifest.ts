// Declarative manifest for the Crystal Field Splitting Simulator. Single source of truth for its
// config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in crystal-field.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import crystalField from './crystal-field';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Crystal Field Splitting Calculator',
    slug: 'crystal-field-splitting-calculator',
    processorId: 'crystal-field',
    domain: 'chemistry-lab',
    category: 'chemistry',
    family: 'inorganic-chemistry',
    difficulty: 'advanced',
    schoolLevel: 'introductory-college',
    estimatedLearningTime: '8 min',
    prerequisites: ['electron configuration', 'Hund\'s rule'],
    nextTopics: ['spectrochemical series', 'Jahn-Teller distortion', 'ligand field theory'],
    curriculumTags: ['inorganic chemistry', 'coordination chemistry'],
    learningObjectives: [
      'Fill a d-orbital splitting diagram for any d count and geometry',
      'Decide whether a complex is high spin or low spin from the splitting and the pairing energy',
      'Connect the splitting to a measured magnetic moment and to the colour of the complex',
    ],
    keyTakeaways: [
      'High spin wins when the splitting is smaller than the pairing energy, and low spin wins when it is larger',
      'Only d4 through d7 have a spin state to choose in an octahedral field',
      'Tetrahedral splitting is four ninths of octahedral, which is why tetrahedral complexes are high spin',
    ],
    references: [
      { label: 'IUPAC Gold Book: crystal field splitting', url: 'https://goldbook.iupac.org/terms/view/C01426' },
    ],
  },
  concepts: {
    primary: ['crystal field splitting', 'coordination complex'],
    secondary: ['crystal field stabilization energy', 'high spin and low spin', 'pairing energy', 'spectrochemical series', 'magnetic moment', 'd-orbital splitting'],
    related: ['transition metal', 'ligand field theory', 'complementary colour'],
    aliases: ['crystal field splitting', 'crystal field theory', 'CFSE', 'delta octahedral', 'high spin vs low spin', 'd orbital splitting', 'spin only magnetic moment', 'ligand field'],
  },
  equations: [
    {
      id: 'cfse',
      symbol: 'CFSE',
      expression: 'CFSE = (-0.4 x n(t2g) + 0.6 x n(eg)) x delta o',
      description: 'Crystal field stabilization energy of an octahedral complex, counting each lower-set electron as a gain and each upper-set electron as a cost.',
      variables: [
        { symbol: 'CFSE', label: 'Crystal field stabilization energy', unit: 'kJ/mol', measurementId: 'cfse' },
        { symbol: 'delta o', label: 'Ligand field splitting', unit: 'cm⁻¹', paramId: 'fieldStrength' },
      ],
    },
    {
      id: 'spin-only',
      symbol: 'mu',
      expression: 'mu = sqrt(n x (n + 2))',
      description: 'Spin-only magnetic moment in Bohr magnetons, from the number of unpaired electrons alone.',
      variables: [
        { symbol: 'mu', label: 'Magnetic moment', unit: 'BM', measurementId: 'moment' },
        { symbol: 'n', label: 'Unpaired electrons', unit: '', measurementId: 'unpaired' },
      ],
    },
  ],
  educational: {
    summary:
      'Fill a d-orbital splitting diagram and watch the electrons rearrange as the ligand field beats the pairing energy, with live CFSE, magnetism and colour.',
    intentGroups: {
      informational: ['What is crystal field splitting?', 'What is CFSE?', 'What does delta octahedral mean?'],
      howTo: ['How to work out if a complex is high spin or low spin', 'How to calculate a spin-only magnetic moment'],
      comparison: ['High spin vs low spin', 'Octahedral vs tetrahedral splitting', 'Strong field vs weak field ligands'],
      misconception: ['Not every d count has a spin state to choose', 'The colour you see is not the colour absorbed'],
      troubleshooting: ['Why a d3 complex will not go low spin', 'Why tetrahedral complexes are rarely low spin'],
    },
    commonMistakes: [
      'Assuming every d count can be high spin or low spin',
      'Reporting the absorbed colour as the colour of the complex',
      'Using the octahedral splitting for a tetrahedral complex',
    ],
    realWorldUseCases: [
      'Predicting the magnetic moment a susceptibility measurement should return',
      'Explaining why haemoglobin changes colour when it binds oxygen',
      'Ranking ligands in the spectrochemical series from complex colours',
    ],
    audience: ['inorganic chemistry students', 'chemistry teachers', 'materials science students'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Crystal Field Splitting Calculator and CFSE',
    description:
      'Crystal field theory made interactive: fill the d orbital diagram, compare high spin vs low spin, and read CFSE and the spin-only magnetic moment.',
    tagline: 'Watch the electrons pick high spin or low spin for themselves.',
    keywords: ['crystal field splitting calculator', 'CFSE calculator', 'high spin vs low spin', 'crystal field theory', 'spin only magnetic moment', 'd orbital splitting', 'octahedral vs tetrahedral'],
  },
  presentation: {
    // Tags are the tool's search vocabulary (they feed the client index, and nothing renders them),
    // so the compound phrasings a course sets belong here rather than in a manifest field that only
    // reaches the knowledge graph. seo.keywords does NOT reach the index, which is why a phrase
    // needed for retrieval is repeated here on purpose.
    tags: ['crystal field splitting calculator', 'crystal field splitting', 'crystal field theory', 'ligand field', 'CFSE', 'CFSE calculator', 'high spin', 'low spin', 'high spin vs low spin', 'delta octahedral', 'octahedral vs tetrahedral', 'd orbital splitting', 'd orbital splitting diagram', 'pairing energy', 'magnetic moment', 'spin only magnetic moment', 'coordination chemistry', 'inorganic chemistry'],
    updatedAt: '2026-08-29',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Hexaaquairon(II)', body: 'Water is a weak field ligand, so the 10400 cm⁻¹ splitting loses to the pairing energy. The d6 ion stays high spin with four unpaired electrons and a moment near 4.9 BM.' },
    { title: 'Hexacyanoferrate(II)', body: 'Cyanide is a strong field ligand. The same d6 ion now splits by 33000 cm⁻¹, the electrons pair into t2g, and the complex is diamagnetic.' },
    { title: 'Tetrachlorocobaltate', body: 'A tetrahedral d7 complex splits by four ninths of the octahedral value, which no ordinary ligand pushes past the pairing energy. Three unpaired electrons, and the deep blue that chloride cobalt salts are known for.' },
    { title: 'Hexaamminenickel(II)', body: 'A d8 ion has one arrangement only, so high spin and low spin describe the same picture. Two unpaired electrons whatever the ligand does.' },
  ],
  faq: [
    {
      question: 'What is crystal field splitting?',
      answer:
        'Crystal field splitting is the energy gap that opens between the d orbitals when ligands approach a metal ion. In the free ion all five d orbitals have the same energy. Ligands sit closer to some of them than others, so the ones pointing at ligands rise and the rest fall. The gap between those two sets is the splitting, written delta.',
    },
    {
      question: 'What is the difference between high spin and low spin?',
      answer:
        'High spin spreads electrons across all five orbitals before any of them pair. Low spin fills the lower set completely first, pairing electrons to do it. The complex takes whichever is cheaper. Pairing costs the pairing energy P, and climbing to the upper set costs delta, so high spin wins when delta is smaller than P and low spin wins when delta is larger.',
    },
    {
      question: 'Which d counts can be high spin or low spin?',
      answer:
        'Only d4, d5, d6 and d7 in an octahedral field. Below d4 there is room for every electron in the lower set without pairing, so both schemes give the same answer. From d8 up the lower set is already full, so again there is no choice. Move the d electron slider across its range and watch the spin state readout stop responding outside that window.',
    },
    {
      question: 'How do you calculate CFSE?',
      answer:
        'Count the electrons in each set and weight them. In an octahedral field each t2g electron is worth -0.4 delta and each eg electron is worth +0.6 delta, so CFSE = (-0.4 x n(t2g) + 0.6 x n(eg)) x delta. A d3 complex gives -1.2 delta, and a low-spin d6 gives -2.4 delta, the largest CFSE any octahedral complex reaches.',
    },
    {
      question: 'Why is tetrahedral splitting smaller than octahedral splitting?',
      answer:
        'A tetrahedral complex has four ligands instead of six, and none of them point straight at a d orbital. Both effects shrink the gap, and the standard result is delta tetrahedral = 4/9 x delta octahedral for the same metal and ligands. That gap rarely beats a pairing energy, which is why low-spin tetrahedral complexes are so rare.',
    },
    {
      question: 'How do you find the spin-only magnetic moment?',
      answer:
        'Use mu = sqrt(n x (n + 2)) in Bohr magnetons, where n is the number of unpaired electrons. Four unpaired electrons give 4.90 BM and one gives 1.73 BM. Measured moments sit close to these for first-row transition metals, so comparing a measurement against both spin states is how a spin state gets assigned in practice.',
    },
    {
      question: 'Why is the colour of a complex not the colour it absorbs?',
      answer:
        'You see what is left after absorption, so the colour is the complement of the absorbed band. A complex absorbing green light near 520 nm looks purple. This trips people up because the splitting sets the absorbed wavelength through lambda = 10^7 / delta, and that number is the one on the far side of the colour wheel from what your eye reports.',
    },
    {
      question: 'What makes a ligand strong field or weak field?',
      answer:
        'Its position in the spectrochemical series, which ranks ligands by the splitting they produce. Iodide and bromide sit at the weak end, water and ammonia in the middle, and cyanide and carbon monoxide at the strong end. The series is empirical, so treat the field strength slider as the number you look up rather than one you derive.',
    },
  ],
  guide: {
    slug: 'how-crystal-field-splitting-works',
    title: 'How Crystal Field Splitting Works',
    description:
      'How ligands split the d orbitals, when a complex goes high spin or low spin, and how the splitting sets both the magnetic moment and the colour.',
    readMinutes: 8,
    updatedAt: '2026-08-29',
    quickAnswer:
      'Crystal field splitting is the gap that opens between the d orbitals when ligands approach a metal ion. In an octahedral complex the three t2g orbitals drop by 0.4 delta and the two eg orbitals rise by 0.6 delta. Electrons then fill the diagram whichever way costs less: spreading out if the splitting is smaller than the pairing energy, pairing up if it is larger. That single comparison sets the number of unpaired electrons, the crystal field stabilization energy CFSE = (-0.4 x n(t2g) + 0.6 x n(eg)) x delta, the magnetic moment, and the colour. Move the sliders here and watch the electrons rearrange themselves at the crossover.',
    sections: [
      {
        id: 'why-split',
        heading: 'Why Do Ligands Split The d Orbitals?',
        body:
          'Two of the five d orbitals point straight at the six octahedral ligand positions, and the other three point between them. Electrons in the orbitals aimed at a ligand feel more repulsion, so those two rise in energy. The other three fall. The gap between the sets is delta octahedral, written delta o, and every measurable property of the coordination complex follows from it.',
        bullets: [
          'The barycentre is conserved: two orbitals up by 0.6 delta balance three orbitals down by 0.4 delta.',
          'A tetrahedral field inverts the picture, because there no ligand points at a d orbital directly.',
          'Delta o is measured in wavenumbers, so a strong field ligand such as cyanide reaches 33000 cm-1 while water sits near 10400.',
        ],
      },
      {
        id: 'delta-o',
        heading: 'What Does Delta Octahedral Mean?',
        body:
          'Delta octahedral, usually written delta o, is the size of the d orbital splitting in an octahedral field, quoted in wavenumbers. It belongs to the metal and the ligands together, therefore it is looked up rather than derived from first principles. Octahedral vs tetrahedral is the first thing it depends on, because the same ligand set splits a tetrahedral complex only four ninths as far. However, the only number worth using is the one for the geometry you actually have.',
        bullets: [
          'Weak field: iodide and bromide, a few thousand wavenumbers.',
          'Strong field: cyanide and carbon monoxide, above 30000 wavenumbers.',
        ],
      },
      {
        id: 'worked-example',
        heading: 'A Worked Example: Two d6 Complexes',
        body:
          'Take the same iron(II) ion in two different coordination complexes. For example, hexaaquairon(II) has delta o near 10400 cm-1, which loses to a 19000 cm-1 pairing energy, therefore the ion stays high spin with four unpaired electrons and a moment of 4.90 BM. Hexacyanoferrate(II) has delta o near 33000 cm-1, which wins, so the electrons pair into t2g and the complex reads 0.00 BM. Nothing about the metal changed; only the ligand did.',
        bullets: [
          'Both presets are on the panel, so you can step between them and watch the arrows rearrange.',
          'Crystal field theory gets both answers from one comparison, which is what makes it worth learning before the fuller ligand field treatment.',
        ],
      },
      {
        id: 'spin-state',
        heading: 'High Spin vs Low Spin: Which One Wins?',
        body:
          'Adding a fourth electron forces a decision. It can climb to the upper set at a cost of delta, or it can pair in the lower set at a cost of the pairing energy P. The complex takes the cheaper option, so delta versus P decides the spin state. This simulator costs both arrangements every frame and shows whichever is lower, rather than asserting an answer.',
        bullets: [
          'Weak field, delta below P: high spin, maximum unpaired electrons.',
          'Strong field, delta above P: low spin, lower set filled first.',
        ],
      },
      {
        id: 'which-counts',
        heading: 'Which d Counts Actually Have A Choice?',
        body:
          'Only d4 through d7 in an octahedral field. A d3 ion puts one electron in each t2g orbital with nothing to decide, and a d8 ion has t2g full whatever happens. Students lose marks by writing low-spin d3 or high-spin d8 as though those were different species. Drag the d electron slider and the spin state readout goes quiet outside the d4 to d7 window.',
      },
      {
        id: 'magnetism',
        heading: 'How Does The Splitting Change Magnetism?',
        body:
          'Unpaired electrons make a complex paramagnetic, and the spin only magnetic moment mu = sqrt(n x (n + 2)) turns that count into a number a magnetic balance can check. For example, high-spin d6 gives four unpaired electrons and 4.90 BM, whereas low-spin d6 gives none at all and reads as diamagnetic. That gap is large, therefore magnetic measurement is the standard way to assign a spin state.',
        bullets: [
          'One unpaired electron: 1.73 BM. Two: 2.83 BM. Five: 5.92 BM.',
          'Measured moments run a little above spin-only for later first-row metals, because orbital motion contributes as well.',
        ],
      },
      {
        id: 'colour',
        heading: 'Where Does The Colour Come From?',
        body:
          'An electron absorbs a photon and jumps the gap, so the absorbed wavelength is lambda = 10^7 / delta with delta in wavenumbers. A 20000 cm⁻¹ splitting absorbs at 500 nm. What your eye reports is the complement of what was absorbed, which is why that complex looks red rather than blue-green. Both d0 and d10 ions have no d to d transition available, so they are colourless unless something else absorbs.',
      },
      {
        id: 'where-it-matters',
        heading: 'Where Is This Used Outside An Exam?',
        body:
          'A magnetic susceptibility measurement returns a moment, and comparing it against both spin states is how the configuration gets assigned. Haemoglobin is the best-known case: the iron sits high spin when the site is empty and low spin once oxygen binds, and the colour change from dark red to bright red follows the change in splitting. A CFSE calculator is therefore a way to predict what an instrument should read before you run it.',
        bullets: [
          'A predicted 4.90 BM against a measured 5.1 BM is a good match. However, measured values run slightly high, because orbital motion contributes as well.',
          'The same reasoning ranks ligands into the spectrochemical series from the colours their complexes show.',
        ],
      },
    ],
    mistakes: [
      {
        heading: 'Assuming Every d Count Has A Spin State',
        body:
          'A common mistake is to label a d3 or d8 complex high spin. There is only one way to fill the orbitals for those counts, so the label carries no information. Check whether the two arrangements differ before you name one, and if they do not, describe the configuration instead.',
      },
      {
        heading: 'Using The Octahedral Splitting For A Tetrahedral Complex',
        body:
          'Ligand tables quote delta octahedral. Do not put that number straight into a tetrahedral calculation. Multiply by 4/9 first, and remember the sets invert as well, so the e orbitals sit lower and the t2 orbitals sit higher. Tapping the complex on the canvas switches geometry and applies both corrections at once.',
      },
      {
        type: 'note',
        heading: 'Everything Runs On Your Device',
        body:
          'The simulation runs entirely in your browser. Nothing is uploaded, logged, or shared, and it works offline once the page has loaded. Field strengths and pairing energies are the tabulated values you look up, so treat the sliders as a way to explore them rather than as a source for them.',
      },
    ],
  },
  // Authored ON TOP of the derived sibling edges (see relations.ts).
  relationships: {
    usedWith: [
      {
        slug: 'wave-speed-calculator',
        reason: 'Turning a splitting in wavenumbers into an absorbed colour is the wavelength and frequency relation',
        strength: 0.55,
      },
    ],
  },
  paramBehavior: crystalField.paramBehavior,
  aspect: crystalField.aspect,
  params: crystalField.params,
  presets: crystalField.presets,
  formula: crystalField.formula,
};
