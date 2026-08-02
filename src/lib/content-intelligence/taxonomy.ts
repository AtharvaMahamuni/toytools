// Expansion taxonomy — the ONLY place that declares which tools a family is "expected" to have.
// Hierarchical engine → family → expected[] so it stays a small structured registry, never a flat
// 5000-line list. Analyzers derive `missing = expected − existing` from this; analyzer LOGIC never
// names a tool. Editing this file is pure data work, exactly like categories.ts / engines.ts.
//
// `expected` lists canonical tool slugs. A slug already present in the registry is "covered";
// the rest are expansion opportunities. Only seed families where the expansion is genuinely
// intended — an empty/with-only-existing family simply yields no opportunities.

import type { ExpansionTaxonomy } from './types';

export const EXPANSION_TAXONOMY: ExpansionTaxonomy = [
  {
    engine: 'calculator',
    families: [
      {
        family: 'arithmetic',
        expected: [
          'percentage-calculator',
          'discount-calculator',
          'margin-calculator',
          'markup-calculator',
          'tax-calculator',
          'tip-calculator',
        ],
      },
    ],
  },
  {
    engine: 'encoding',
    families: [
      {
        family: 'binary-text',
        expected: ['base64-encoder-decoder', 'hex-encoder-decoder', 'binary-text-converter'],
      },
      {
        family: 'web',
        expected: ['url-encoder-decoder', 'html-entity-encoder-decoder', 'punycode-converter'],
      },
    ],
  },
  {
    engine: 'hashing',
    families: [
      {
        family: 'cryptographic',
        expected: [
          'md5-hash-generator',
          'sha1-hash-generator',
          'sha256-hash-generator',
          'sha512-hash-generator',
        ],
      },
      {
        family: 'checksum',
        expected: ['crc32-hash-generator'],
      },
    ],
  },
  {
    engine: 'structured-data',
    families: [
      {
        family: 'json',
        expected: [
          'json-formatter',
          'json-minifier',
          'json-validator',
          'json-to-csv-converter',
          'json-to-yaml-converter',
        ],
      },
    ],
  },
  {
    engine: 'finance',
    families: [
      {
        family: 'interest',
        expected: [
          'compound-interest-calculator',
          'rule-of-72-calculator',
          'simple-interest-calculator',
          'cagr-calculator',
        ],
      },
      {
        family: 'savings',
        expected: [
          'savings-goal-calculator',
          'emergency-fund-calculator',
          'sip-calculator',
        ],
      },
      {
        family: 'inflation',
        expected: [
          'inflation-calculator',
          'present-value-calculator',
        ],
      },
    ],
  },
  {
    engine: 'wellness',
    families: [
      {
        family: 'body-composition',
        expected: [
          'bmi-calculator',
          'body-fat-calculator',
          'ideal-weight-calculator',
          'lean-body-mass-calculator',
          'waist-to-hip-ratio-calculator',
          'body-surface-area-calculator',
        ],
      },
      {
        family: 'energy',
        expected: [
          'tdee-calculator',
          'bmr-calculator',
          'calorie-deficit-calculator',
        ],
      },
      {
        family: 'cardio',
        expected: [
          'heart-rate-zone-calculator',
          'running-pace-calculator',
          'vo2-max-calculator',
        ],
      },
      {
        family: 'nutrition',
        expected: [
          'macro-calculator',
          'protein-intake-calculator',
        ],
      },
      // No shipped tool yet — the first strength-training member would open this family.
      {
        family: 'strength',
        expected: [
          'one-rep-max-calculator',
        ],
      },
    ],
  },
  {
    engine: 'tracker',
    families: [
      {
        family: 'measurement',
        expected: [
          'body-weight-tracker',
          'blood-pressure-tracker',
        ],
      },
      {
        family: 'habit',
        expected: [
          'water-intake-tracker',
          'move-today-tracker',
          'sleep-hours-tracker',
        ],
      },
    ],
  },
  {
    engine: 'datetime',
    families: [
      // Health questions that are really date arithmetic, so they reuse the datetime engine
      // rather than wellness. Engine selection is confirmed per tool at build time.
      {
        family: 'health-date',
        expected: [
          'sleep-cycle-calculator',
          'pregnancy-due-date-calculator',
          'ovulation-calculator',
        ],
      },
    ],
  },
];

/** Expected tool slugs for an engine/family. Never throws; unknown lookups return []. */
export function expectedFor(
  engine: string,
  family: string,
  taxonomy: ExpansionTaxonomy = EXPANSION_TAXONOMY,
): string[] {
  const eng = taxonomy.find(e => e.engine === engine);
  if (!eng) return [];
  const fam = eng.families.find(f => f.family === family);
  return fam ? fam.expected : [];
}

/** Flatten the taxonomy into (engine, family, expected-slug) triples. */
export function taxonomyEntries(
  taxonomy: ExpansionTaxonomy = EXPANSION_TAXONOMY,
): Array<{ engine: string; family: string; expected: string }> {
  const out: Array<{ engine: string; family: string; expected: string }> = [];
  for (const eng of taxonomy) {
    for (const fam of eng.families) {
      for (const expected of fam.expected) {
        out.push({ engine: eng.engine, family: fam.family, expected });
      }
    }
  }
  return out;
}
