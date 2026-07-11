// Pure generators: derive every per-tool surface from a SimulationManifest, so the same fact is
// authored once and expanded mechanically (Problems 1, 4, 7). The build script
// scripts/generate-simulations.ts serializes these into src/generated/; a freshness check keeps
// the emitted files in sync. Measurement labels (for knowledge outputs) come from the runtime def,
// so callers pass the SimulationDef alongside the manifest.

import type { FAQItem, ToolConfig } from '@data/types';
import type { EngineId, PatternId } from '@data/engines';
import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';
import type { SimulationDef } from './types';
import type { SimulationManifest } from './manifest';

/** The ToolConfig for a simulation tool (spread into src/data/registry.ts). */
export function toolConfigFrom(manifest: SimulationManifest): ToolConfig {
  const m = manifest.metadata;
  return {
    slug: m.slug,
    name: m.title,
    seoTitle: manifest.seo.title,
    description: manifest.seo.description,
    categorySlug: m.category,
    tags: manifest.presentation.tags,
    updatedAt: manifest.presentation.updatedAt,
    isNew: manifest.presentation.isNew,
    trustVariant: manifest.presentation.trustVariant,
    engine: m.domain as EngineId,
    pattern: 'simulate' as PatternId,
    family: m.family,
    processorId: m.processorId,
    relatedTools: relatedToolSlugs(manifest),
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
export function knowledgeFrom(manifest: SimulationManifest, def: SimulationDef): Knowledge {
  const m = manifest.metadata;
  const rel = manifest.relationships ?? {};
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
 * Related tool slugs for the config. Prefers the authored relationship overlay (usedWith +
 * nextSteps + alternatives, de-duplicated, order-preserving); the tier/concept auto-deriver in
 * src/lib/tools/related.ts remains the runtime fallback for the visible related strip.
 */
export function relatedToolSlugs(manifest: SimulationManifest): string[] {
  const rel = manifest.relationships ?? {};
  const slugs = [
    ...(rel.usedWith ?? []),
    ...(rel.nextSteps ?? []),
    ...(rel.alternatives ?? []),
  ].map((r) => r.slug);
  return [...new Set(slugs)];
}
