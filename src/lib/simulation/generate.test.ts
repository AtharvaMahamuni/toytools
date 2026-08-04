import { describe, expect, it } from 'vitest';
import { faqItemsFrom, knowledgeFrom, relatedToolSlugs, toolConfigFrom } from './generate';
import { resolveRelations } from './relations';
import { MANIFESTS } from './manifests';
import { manifest as projectileManifest } from './simulations/projectile-motion.manifest';
import projectileDef from './simulations/projectile-motion';

const projectileRelations = resolveRelations(projectileManifest, MANIFESTS);

describe('simulation generators (projectile-motion)', () => {
  it('derives a valid ToolConfig from the manifest', () => {
    const cfg = toolConfigFrom(projectileManifest, projectileRelations);
    expect(cfg.slug).toBe('projectile-motion-calculator');
    expect(cfg.name).toBe('Projectile Motion Calculator');
    expect(cfg.engine).toBe('physics');
    expect(cfg.pattern).toBe('simulate');
    expect(cfg.family).toBe('mechanics');
    expect(cfg.processorId).toBe('projectile-motion');
    expect(cfg.seoTitle).toBe(projectileManifest.seo.title);
    expect(cfg.description).toBe(projectileManifest.seo.description);
    expect(cfg.tags).toEqual(projectileManifest.presentation.tags);
    expect(cfg.guide?.slug).toBe('how-projectile-motion-works');
    // relatedTools are auto-derived: non-empty, other real sims, never self.
    expect(cfg.relatedTools!.length).toBeGreaterThan(0);
    expect(cfg.relatedTools).not.toContain('projectile-motion-calculator');
    const simSlugs = new Set(MANIFESTS.map((m) => m.metadata.slug));
    for (const slug of cfg.relatedTools!) expect(simSlugs.has(slug)).toBe(true);
  });

  it('derives a knowledge overlay whose commonQuestions are a subset of the FAQ', () => {
    const k = knowledgeFrom(projectileManifest, projectileDef, projectileRelations);
    expect(k.slug).toBe('projectile-motion-calculator');
    expect(k.category).toBe('physics');
    expect(k.primaryConcepts).toEqual(['projectile motion']);
    // Knowledge-Sync: every knowledge.commonQuestion must be an authored FAQ question.
    const faqQuestions = new Set(projectileManifest.faq.map((f) => f.question));
    for (const q of k.commonQuestions) expect(faqQuestions.has(q)).toBe(true);
    // Outputs come from the runtime measurement labels.
    expect(k.outputs).toEqual(projectileDef.measurements.filter((m) => !m.hidden).map((m) => m.label));
    expect(k.inputs).toEqual(projectileManifest.params.map((p) => p.label));
    // Relationship edges are the derived overlay.
    expect(k.usedWith).toEqual(projectileRelations.usedWith ?? []);
    expect(k.nextSteps).toEqual(projectileRelations.nextSteps ?? []);
  });

  it('derives FAQ items with stable ids matching the authored questions', () => {
    const faqs = faqItemsFrom(projectileManifest);
    expect(faqs).toHaveLength(projectileManifest.faq.length);
    expect(faqs[0].id).toBe('projectile-motion-calculator-faq-1');
    expect(faqs[0].question).toBe(projectileManifest.faq[0].question);
    expect(faqs.every((f) => f.answer.length > 0)).toBe(true);
    // No em-dashes anywhere in generated FAQ answers (the gate forbids them).
    expect(faqs.some((f) => f.answer.includes('—'))).toBe(false);
  });

  it('related tool slugs come from the resolved relationship overlay', () => {
    const slugs = relatedToolSlugs(projectileRelations);
    const expected = [
      ...(projectileRelations.usedWith ?? []),
      ...(projectileRelations.nextSteps ?? []),
      ...(projectileRelations.alternatives ?? []),
    ].map((r) => r.slug);
    expect(slugs).toEqual([...new Set(expected)]);
  });
});
