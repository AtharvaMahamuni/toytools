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
          'crc32-hash-generator',
        ],
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
