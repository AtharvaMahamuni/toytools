import { describe, expect, it } from 'vitest';
import { faqItemsFrom, knowledgeFrom, relatedToolSlugs, simulatorLabel, subjectFromTitle, toolConfigFrom } from './generate';
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
    // Authored tags come first and are preserved verbatim; the simulator-intent phrases are
    // appended by derivation (see the "simulator intent derivation" block below).
    expect(cfg.tags.slice(0, projectileManifest.presentation.tags.length))
      .toEqual(projectileManifest.presentation.tags);
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

describe('simulator intent derivation', () => {
  it('strips the tool-type noun to get the subject', () => {
    expect(subjectFromTitle('Pendulum Period Calculator')).toBe('Pendulum Period');
    expect(subjectFromTitle('Quadratic Equation Solver')).toBe('Quadratic Equation');
    expect(subjectFromTitle("Ohm's Law Calculator")).toBe("Ohm's Law");
  });

  it('preserves authored casing, because the subjects are proper nouns', () =>
    expect(subjectFromTitle('Doppler Effect Calculator')).toBe('Doppler Effect'));

  it('leaves a title with no tool-type noun alone', () =>
    expect(subjectFromTitle('Unit Circle')).toBe('Unit Circle'));

  it('gives the widget and the tags the same phrase', () =>
    expect(simulatorLabel('Pendulum Period Calculator')).toBe('Pendulum Period simulator'));

  it('gives every simulation a simulator tag', () => {
    // The regression this whole file guards: the 2026-08-04 rename left three sims with no
    // simulator vocabulary at all, and nothing noticed.
    for (const m of MANIFESTS) {
      const tags = toolConfigFrom(m, resolveRelations(m, MANIFESTS)).tags.map((t) => t.toLowerCase());
      expect(tags.some((t) => t.includes('simulator')), `${m.metadata.slug} has no simulator tag`).toBe(true);
      expect(tags.some((t) => t.startsWith('interactive ')), `${m.metadata.slug} has no interactive tag`).toBe(true);
    }
  });

  it('does not duplicate a phrase the manifest already lists', () => {
    const tags = toolConfigFrom(projectileManifest, projectileRelations).tags.map((t) => t.toLowerCase());
    expect(tags.filter((t) => t === 'projectile motion simulator')).toHaveLength(1);
  });
});
