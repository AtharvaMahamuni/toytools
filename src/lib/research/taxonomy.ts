// Research expansion taxonomy — declarative domain → transformation → expected tool slugs. Mirrors
// content-intelligence's EXPANSION_TAXONOMY: a small structured registry edited as DATA, never in
// analyzer logic. It records the engine team's hypothesis of which tools a transformation family
// should eventually contain, so the roadmap can flag expected-but-missing members. Pure lookup.

export interface TransformationExpansion {
  transformation: string;
  /** The engine that would serve this transformation ('csv'/'datetime' are not-yet-built engines). */
  engine: string;
  expected: string[];
}
export interface DomainExpansion {
  domain: string;
  transformations: TransformationExpansion[];
}
export type ResearchTaxonomy = DomainExpansion[];

export const RESEARCH_TAXONOMY: ResearchTaxonomy = [
  {
    domain: 'developer',
    transformations: [
      {
        transformation: 'CSV Engine',
        engine: 'csv',
        expected: [
          'csv-diff',
          'csv-cleaner',
          'csv-column-picker',
          'csv-to-tsv',
          'csv-sort',
          'csv-transpose',
          'csv-merge',
          'csv-split',
        ],
      },
    ],
  },
  {
    domain: 'datetime',
    transformations: [
      {
        transformation: 'Date & Time Engine',
        engine: 'datetime',
        expected: [
          'unix-timestamp-converter',
          'date-difference-calculator',
          'age-calculator',
          'timezone-converter',
          'cron-expression-parser',
          'countdown-timer',
          'week-number-calculator',
        ],
      },
    ],
  },
  {
    domain: 'finance',
    transformations: [
      {
        transformation: 'Loan Engine',
        engine: 'loan',
        expected: [
          'loan-calculator',
          'mortgage-calculator',
          'auto-loan-calculator',
          'car-loan-calculator',
          'amortization-schedule-calculator',
          'extra-payment-calculator',
        ],
      },
      {
        transformation: 'Investment Engine',
        engine: 'investment',
        expected: [
          'roi-calculator',
          'sip-calculator',
          'cagr-calculator',
          'simple-interest-calculator',
          'dividend-yield-calculator',
          'future-value-calculator',
        ],
      },
      {
        transformation: 'Retirement Engine',
        engine: 'retirement',
        expected: [
          'retirement-calculator',
          'fire-calculator',
          '401k-calculator',
          'annuity-calculator',
        ],
      },
      {
        transformation: 'Salary & Budget Engine',
        engine: 'budget',
        expected: [
          'salary-calculator',
          'hourly-to-salary-calculator',
          'take-home-pay-calculator',
          'budget-50-30-20-calculator',
          'net-worth-calculator',
        ],
      },
    ],
  },
  {
    // Applied Mathematics: 'math-lab' is the simulation-platform math domain (interactive
    // explorables, one model + draw + manifest per tool); 'math' is the classic-tool engine for
    // data-input calculators. Neither is built yet; see docs/analysis/2026-07-14-applied-math-
    // category-plan.md for the launch plan.
    domain: 'math',
    transformations: [
      {
        transformation: 'Interactive Explorables',
        engine: 'math-lab',
        expected: [
          'unit-circle-explorer',
          'quadratic-equation-explorer',
          'probability-simulator',
          'function-grapher',
          'linear-regression-playground',
          'normal-distribution-visualizer',
          'derivative-visualizer',
          'monte-carlo-pi-estimator',
          'fourier-series-visualizer',
        ],
      },
      {
        transformation: 'Math Calculators',
        engine: 'math',
        expected: [
          'statistics-visualizer',
          'matrix-calculator',
          'triangle-solver',
          'fraction-calculator',
          'prime-factorization-calculator',
          'combinations-permutations-calculator',
          'gcd-lcm-calculator',
          'z-score-calculator',
        ],
      },
    ],
  },
  {
    // Physics Playground: all families reuse the existing 'physics' simulate engine (one model +
    // one draw file per tool), so these are high-reuse, low-cost expansions of the shipped cluster.
    domain: 'physics',
    transformations: [
      {
        transformation: 'Mechanics',
        engine: 'physics',
        expected: [
          'projectile-motion-simulator',
          'momentum-collision-simulator',
          'inclined-plane-simulator',
          'free-fall-simulator',
        ],
      },
      {
        transformation: 'Electricity',
        engine: 'physics',
        expected: [
          'ohms-law-simulator',
          'series-parallel-resistance-simulator',
        ],
      },
      {
        transformation: 'Waves',
        engine: 'physics',
        expected: [
          'wave-speed-simulator',
          'doppler-effect-simulator',
          'wave-interference-simulator',
        ],
      },
      {
        transformation: 'Oscillations',
        engine: 'physics',
        expected: [
          'pendulum-simulator',
          'frequency-period-simulator',
          'shm-spring-simulator',
        ],
      },
      {
        transformation: 'Thermodynamics',
        engine: 'physics',
        expected: [
          'heat-transfer-simulator',
          'ideal-gas-law-simulator',
        ],
      },
    ],
  },
  {
    // Design & Color: two not-yet-built engines. 'color' is a deterministic color-math engine
    // (parse/convert/contrast/simulate across HEX/RGB/HSL/HSV/OKLCH/CMYK); 'units' is CSS + native
    // unit math (px/rem/em/pt/dp/sp, type scales, aspect ratios). Both are high algorithmic-fit
    // clusters, so a single engine build unlocks a family. See research/datasets/design.json.
    domain: 'design',
    transformations: [
      {
        transformation: 'Color Engine',
        engine: 'color',
        expected: [
          'color-contrast-checker',
          'color-format-converter',
          'colorblind-simulator',
          'css-gradient-generator',
          'color-shades-generator',
          'image-palette-extractor',
        ],
      },
      {
        transformation: 'CSS Unit Engine',
        engine: 'units',
        expected: [
          'px-to-rem-converter',
          'px-to-dp-converter',
          'type-scale-generator',
          'aspect-ratio-calculator',
        ],
      },
    ],
  },
];

/** All (domain, transformation, engine, expected-slug) rows — never throws. */
export function taxonomyEntries(
  taxonomy: ResearchTaxonomy = RESEARCH_TAXONOMY,
): Array<{ domain: string; transformation: string; engine: string; expected: string }> {
  const out: Array<{ domain: string; transformation: string; engine: string; expected: string }> = [];
  for (const d of taxonomy) {
    for (const t of d.transformations) {
      for (const e of t.expected) {
        out.push({ domain: d.domain, transformation: t.transformation, engine: t.engine, expected: e });
      }
    }
  }
  return out;
}
