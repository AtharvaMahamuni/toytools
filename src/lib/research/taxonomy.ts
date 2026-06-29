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
