// Transformation analyzer — the core of the engine. It treats problems as reusable TRANSFORMATIONS
// (engine-agnostic verbs like "CSV Diff" or "Diacritic Removal") rather than one-off tools, so the
// engine/cluster analyzers can group them. Pure, deterministic.

import type { RawOpportunity } from '../models/provider';

/** Slugify a transformation name into a stable id. */
export function transformationId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Group raws by their transformation id. Returns a stable, sorted map of id → raws. */
export function groupByTransformation(raw: RawOpportunity[]): Map<string, RawOpportunity[]> {
  const map = new Map<string, RawOpportunity[]>();
  for (const r of raw) {
    const id = transformationId(r.transformation);
    const list = map.get(id) ?? [];
    list.push(r);
    map.set(id, list);
  }
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}
