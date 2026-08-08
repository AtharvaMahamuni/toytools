// Pure generators: derive every per-tool surface from a SimulationManifest, so the same fact is
// authored once and expanded mechanically (Problems 1, 4, 7). The build script
// scripts/generate-simulations.ts serializes these into src/generated/; a freshness check keeps
// the emitted files in sync. Measurement labels (for knowledge outputs) come from the runtime def,
// so callers pass the SimulationDef alongside the manifest.

import type { FAQItem, ToolConfig } from '@data/types';
import type { EngineId, PatternId } from '@data/engines';
import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';
import type { SimulationDef } from './types';
import type { SimulationManifest, RelationshipOverlay } from './manifest';

/**
 * The subject a simulation is about, with the tool-type noun taken off the end: "Pendulum Period
 * Calculator" → "Pendulum Period", "Quadratic Equation Solver" → "Quadratic Equation". Authored
 * casing is preserved, because "Ohm's Law" and "Doppler Effect" are proper nouns and lowercasing
 * them to fit a heading style would be wrong.
 */
export function subjectFromTitle(title: string): string {
  return title.replace(/\s+(Calculator|Solver|Simulator|Explorer)$/i, '').trim();
}

export function simulationSubject(manifest: SimulationManifest): string {
  return subjectFromTitle(manifest.metadata.title);
}

/**
 * The visible heading for a simulation's stage, and the phrase its "X simulator" queries want.
 * Takes a title rather than a manifest so the widget (which only ever has the ToolConfig) and the
 * generators produce the same string from the same rule.
 */
export function simulatorLabel(title: string): string {
  return `${subjectFromTitle(title)} simulator`;
}

/**
 * Search vocabulary for the simulator intent, derived rather than hand-listed per manifest.
 *
 * The 2026-08-04 slug rename moved every sim from `*-simulator` to `*-calculator` (the higher
 * volume head term, correctly) but dropped the simulator half of the intent entirely: the word
 * survived only in body prose, and tag coverage for it had drifted to 10 of 14 sims with three
 * carrying nothing at all. Deriving these means a new simulation is searchable by the word people
 * use for simulations without anyone remembering to type it into a tag list.
 *
 * See docs/analysis/2026-08-04-query-to-tool-matching-audit.md, findings 1 and 6.
 */
export function simulatorTags(manifest: SimulationManifest): string[] {
  const subject = simulationSubject(manifest);
  const derived = [`${subject} simulator`, `${subject} simulation`, `interactive ${subject}`];

  // The shortest concept alias is usually the bare noun people actually type ("pendulum" rather
  // than "pendulum period"), which is a different and often better query head than the tool name.
  const shortest = [...(manifest.concepts.aliases ?? [])].sort((a, b) => a.length - b.length)[0];
  if (shortest && shortest.toLowerCase() !== subject.toLowerCase()) {
    derived.push(`${shortest} simulator`);
  }

  const existing = new Set(manifest.presentation.tags.map((t) => t.toLowerCase()));
  const seen = new Set<string>();
  return derived.filter((t) => {
    const key = t.toLowerCase();
    if (existing.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** The ToolConfig for a simulation tool (spread into src/data/registry.ts). */
export function toolConfigFrom(manifest: SimulationManifest, relations: RelationshipOverlay): ToolConfig {
  const m = manifest.metadata;
  return {
    slug: m.slug,
    name: m.title,
    seoTitle: manifest.seo.title,
    description: manifest.seo.description,
    categorySlug: m.category,
    tags: [...manifest.presentation.tags, ...simulatorTags(manifest)],
    updatedAt: manifest.presentation.updatedAt,
    isNew: manifest.presentation.isNew,
    trustVariant: manifest.presentation.trustVariant,
    engine: m.domain as EngineId,
    pattern: 'simulate' as PatternId,
    family: m.family,
    processorId: m.processorId,
    relatedTools: relatedToolSlugs(relations),
    guide: {
      slug: manifest.guide.slug,
      categorySlug: m.category,
      title: manifest.guide.title,
      description: manifest.guide.description,
      readMinutes: manifest.guide.readMinutes,
      updatedAt: manifest.guide.updatedAt,
    },
  };
}

/** The knowledge overlay for a simulation (spread into the knowledge registry). */
export function knowledgeFrom(manifest: SimulationManifest, def: SimulationDef, relations: RelationshipOverlay): Knowledge {
  const m = manifest.metadata;
  const rel = relations;
  return {
    schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
    slug: m.slug,
    title: m.title,
    category: m.category,
    summary: manifest.educational.summary,
    primaryConcepts: manifest.concepts.primary,
    secondaryConcepts: manifest.concepts.secondary,
    intentGroups: manifest.educational.intentGroups,
    realWorldUseCases: manifest.educational.realWorldUseCases,
    commonMistakes: manifest.educational.commonMistakes,
    commonQuestions: manifest.faq.slice(0, 3).map((f) => f.question),
    usedWith: rel.usedWith ?? [],
    alternatives: rel.alternatives ?? [],
    nextSteps: rel.nextSteps ?? [],
    workflowStage: manifest.educational.workflowStage,
    keywords: manifest.seo.keywords,
    entityAliases: manifest.concepts.aliases ?? [...manifest.concepts.primary],
    inputs: manifest.params.map((p) => p.label),
    outputs: def.measurements.filter((mm) => !mm.hidden).map((mm) => mm.label),
    difficulty: m.difficulty,
    audience: manifest.educational.audience,
  };
}

/** The FAQ items for a simulation (spread into the faq registry). */
export function faqItemsFrom(manifest: SimulationManifest): FAQItem[] {
  return manifest.faq.map((f, i) => ({
    id: `${manifest.metadata.slug}-faq-${i + 1}`,
    question: f.question,
    answer: f.answer,
  }));
}

/**
 * Related tool slugs for the config, from the resolved relationship overlay (usedWith + nextSteps +
 * alternatives, de-duplicated, order-preserving). The overlay is normally DERIVED from shared
 * concepts/quantities/family (src/lib/simulation/relations.ts); the tier/concept auto-deriver in
 * src/lib/tools/related.ts remains the runtime fallback for the visible related strip.
 */
export function relatedToolSlugs(relations: RelationshipOverlay): string[] {
  const slugs = [
    ...(relations.usedWith ?? []),
    ...(relations.nextSteps ?? []),
    ...(relations.alternatives ?? []),
  ].map((r) => r.slug);
  return [...new Set(slugs)];
}
