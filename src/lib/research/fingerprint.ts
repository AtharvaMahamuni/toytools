// Inputs fingerprint — a short, stable hash of everything a report run depends on, so a generated
// report can say what it was generated FROM and a reader can tell whether it is still current.
//
// Why this exists: on 2026-08-31 the committed reports recommended a next build computed against a
// catalog two tools out of date (they were generated at the chemistry commit; the Music & Audio
// category and equalizer-settings-generator shipped after). Nothing on disk said so, so
// `next-build.md` read exactly as authoritative as a fresh one — the `alreadyExists` classification
// was simply wrong and there was no way to notice. A report that is silently stale is worse than no
// report, because the whole point of the RIE is that nobody picks the next tool by intuition; a
// stale answer is intuition wearing an evidence report's clothes.
//
// Deliberately NOT node:crypto. Every file under src/lib/research is pure and browser-safe so the
// pipeline stays testable and importable anywhere; reaching for a node builtin here would make this
// the one module that breaks that. FNV-1a is sufficient: this detects change, it does not defend
// against anyone forging a match.

import type { SeedDataset } from './models/provider';
import { RESEARCH_SCHEMA_VERSION } from './constants';

/** FNV-1a, 32-bit, rendered as 8 lowercase hex digits. */
function fnv1a(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    // The 32-bit FNV prime (16777619) via shifts, so this stays exact under JS number semantics.
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Everything a run depends on. Catalog-side sets are sorted so iteration order cannot leak in. */
export interface FingerprintInputs {
  datasets: SeedDataset[];
  existingSlugs: Set<string>;
  engineIds: Set<string>;
  craftSlugs: Set<string>;
}

/**
 * A short hash over the datasets AND the catalog. Both halves matter and for different reasons: the
 * datasets are the evidence, and the catalog decides which opportunities count as already shipped.
 * A report can go stale without a single dataset changing, which is precisely how it went stale
 * before this existed.
 *
 * `now` is deliberately excluded. A rerun that changes nothing but the timestamp must produce the
 * same fingerprint, or "is this current?" degenerates into "was this generated in the last hour?".
 */
export function fingerprintInputs(i: FingerprintInputs): string {
  const records = i.datasets
    .flatMap(ds => ds.records.map(r => `${ds.domain} ${JSON.stringify(sortedEntries(r))}`))
    .sort();
  const parts = [
    `v${RESEARCH_SCHEMA_VERSION}`,
    `tools:${[...i.existingSlugs].sort().join(',')}`,
    `engines:${[...i.engineIds].sort().join(',')}`,
    `craft:${[...i.craftSlugs].sort().join(',')}`,
    `records:${records.join('')}`,
  ];
  return fnv1a(parts.join(''));
}

/** Key-sorted entries, recursively, so a reordered JSON field is not treated as a change. */
function sortedEntries(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedEntries);
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .map(k => [k, sortedEntries((value as Record<string, unknown>)[k])]);
  }
  return value;
}
