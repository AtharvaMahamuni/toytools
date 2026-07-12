// Auto-derived simulation relationships (Problem 5). Instead of hand-authoring which sims relate,
// this derives usedWith + nextSteps edges from what two manifests actually SHARE: concepts, the
// quantities they expose (parameter and equation-variable labels), and their family. nextSteps
// follows the difficulty progression (beginner -> intermediate -> advanced). Pure and deterministic,
// so the same manifests always yield the same edges. A manifest may still set an explicit
// `relationships` overlay to override the derivation (resolveRelations honours it).

import type { RelationshipReference } from '@lib/knowledge/types';
import type { SimulationManifest, RelationshipOverlay } from './manifest';

const DIFFICULTY_RANK: Record<SimulationManifest['metadata']['difficulty'], number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

interface Signals {
  slug: string;
  category: string;
  concepts: Set<string>;
  primaryConcepts: Set<string>;
  quantities: Set<string>;
  family: string;
  difficulty: number;
}

const norm = (s: string): string => s.trim().toLowerCase();

function signalsOf(m: SimulationManifest): Signals {
  const concepts = new Set<string>();
  for (const c of [
    ...m.concepts.primary,
    ...m.concepts.secondary,
    ...(m.concepts.related ?? []),
    ...(m.concepts.aliases ?? []),
  ]) {
    concepts.add(norm(c));
  }
  const quantities = new Set<string>();
  for (const p of m.params) quantities.add(norm(p.label));
  for (const eq of m.equations) for (const v of eq.variables) quantities.add(norm(v.label));
  return {
    slug: m.metadata.slug,
    category: norm(m.metadata.category),
    concepts,
    primaryConcepts: new Set(m.concepts.primary.map(norm)),
    quantities,
    family: norm(m.metadata.family),
    difficulty: DIFFICULTY_RANK[m.metadata.difficulty],
  };
}

function intersect(a: Set<string>, b: Set<string>): string[] {
  const out: string[] = [];
  for (const x of a) if (b.has(x)) out.push(x);
  return out;
}

interface Scored {
  slug: string;
  score: number;
  sharedConcepts: string[];
  sharedQuantities: string[];
  familyMatch: boolean;
  difficulty: number;
}

/** Pick the most salient shared item to explain an edge, preferring a primary concept. */
function describeShared(target: Signals, s: Scored): { kind: 'concept' | 'quantity' | 'family'; label: string } {
  if (s.sharedConcepts.length > 0) {
    const preferred = s.sharedConcepts.find((c) => target.primaryConcepts.has(c)) ?? s.sharedConcepts[0];
    return { kind: 'concept', label: preferred };
  }
  if (s.sharedQuantities.length > 0) return { kind: 'quantity', label: s.sharedQuantities[0] };
  return { kind: 'family', label: target.family };
}

function usedWithReason(target: Signals, s: Scored): string {
  const { kind, label } = describeShared(target, s);
  if (kind === 'concept') return `Shares the concept of ${label}.`;
  if (kind === 'quantity') return `Both work with ${label}.`;
  return `Another ${label} simulator.`;
}

function nextStepReason(target: Signals, s: Scored, harder: boolean): string {
  const { kind, label } = describeShared(target, s);
  if (harder) {
    if (kind === 'family') return `A natural next step in ${label}.`;
    return `A natural next step that builds on ${label}.`;
  }
  return 'A closely related simulator to explore next.';
}

/**
 * Derive usedWith + nextSteps edges for one manifest from every other simulation in the domain.
 * usedWith is the top shared-signal matches; nextSteps prefers a harder related sim, falling back
 * to the next-best match. Returns empty arrays when nothing meaningfully overlaps.
 */
export function deriveSimRelations(
  target: SimulationManifest,
  all: SimulationManifest[],
): { usedWith: RelationshipReference[]; nextSteps: RelationshipReference[] } {
  const t = signalsOf(target);
  const scored: Scored[] = [];
  for (const other of all) {
    if (other.metadata.slug === target.metadata.slug) continue;
    if (other.metadata.domain !== target.metadata.domain) continue;
    const o = signalsOf(other);
    const sharedConcepts = intersect(t.concepts, o.concepts);
    const sharedQuantities = intersect(t.quantities, o.quantities);
    const familyMatch = t.family === o.family;
    const score = sharedConcepts.length * 3 + sharedQuantities.length * 2 + (familyMatch ? 2 : 0);
    if (score <= 0) continue;
    scored.push({ slug: other.metadata.slug, score, sharedConcepts, sharedQuantities, familyMatch, difficulty: o.difficulty });
  }

  // Category fallback (mirrors the tier-4 rule in src/lib/tools/related.ts): a sim with no shared
  // concept/quantity/family (e.g. the only electricity sim) still links to its nearest same-category
  // siblings by difficulty, so no simulator derives an empty related list.
  if (scored.length === 0) {
    for (const other of all) {
      if (other.metadata.slug === target.metadata.slug) continue;
      if (other.metadata.domain !== target.metadata.domain) continue;
      const o = signalsOf(other);
      if (o.category !== t.category) continue;
      scored.push({ slug: other.metadata.slug, score: 0, sharedConcepts: [], sharedQuantities: [], familyMatch: false, difficulty: o.difficulty });
    }
    scored.sort(
      (a, b) => Math.abs(a.difficulty - t.difficulty) - Math.abs(b.difficulty - t.difficulty) || a.slug.localeCompare(b.slug),
    );
    return {
      usedWith: scored.slice(0, 2).map((s) => ({
        slug: s.slug,
        reason: `Another ${target.metadata.category} simulator.`,
        strength: 0.3,
      })),
      nextSteps: scored[0] ? [{ slug: scored[0].slug, reason: `A closely related simulator to explore next.`, priority: 1 }] : [],
    };
  }

  // Deterministic ordering: strongest score, then same-family, then simpler first, then slug.
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      Number(b.familyMatch) - Number(a.familyMatch) ||
      a.difficulty - b.difficulty ||
      a.slug.localeCompare(b.slug),
  );

  const usedWith: RelationshipReference[] = scored.slice(0, 2).map((s) => ({
    slug: s.slug,
    reason: usedWithReason(t, s),
    strength: Math.min(0.95, 0.4 + s.score * 0.07),
  }));

  const usedSlugs = new Set(usedWith.map((u) => u.slug));
  const harderPick = scored.find((s) => s.difficulty > t.difficulty);
  const nextPick = harderPick ?? scored.find((s) => !usedSlugs.has(s.slug)) ?? scored[0];
  const nextSteps: RelationshipReference[] = nextPick
    ? [{ slug: nextPick.slug, reason: nextStepReason(t, nextPick, Boolean(harderPick)), priority: 1 }]
    : [];

  return { usedWith, nextSteps };
}

/** The resolved relationship overlay: an explicit manifest override, else the derived edges. */
export function resolveRelations(target: SimulationManifest, all: SimulationManifest[]): RelationshipOverlay {
  if (target.relationships) return target.relationships;
  const { usedWith, nextSteps } = deriveSimRelations(target, all);
  return { usedWith, nextSteps, alternatives: [] };
}
