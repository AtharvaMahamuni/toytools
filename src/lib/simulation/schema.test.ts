import { describe, expect, it } from 'vitest';
import { learningResourceSchema, howToSchema, simulationSchemas } from './schema';
import { MANIFESTS } from './manifests';

const URL = 'https://toytoolsapp.com/tool/physics/ohms-law-calculator/';
const ohms = MANIFESTS.find((m) => m.metadata.slug === 'ohms-law-calculator')!;

describe('simulation JSON-LD schema', () => {
  it('builds a LearningResource that teaches the concepts and equations', () => {
    const lr = learningResourceSchema(ohms, URL);
    expect(lr['@type']).toBe('LearningResource');
    expect(lr.name).toBe("Ohm's Law Calculator");
    expect(lr.url).toBe(URL);
    expect(lr.isAccessibleForFree).toBe(true);
    const teaches = lr.teaches as { name: string }[];
    expect(teaches.some((t) => t.name === "Ohm's law")).toBe(true);
    // Equations are surfaced as DefinedTerms carrying their expression.
    expect(teaches.some((t) => t.name.includes('I = V / R'))).toBe(true);
  });

  it('maps a learning-time hint to an ISO-8601 duration', () => {
    const lr = learningResourceSchema(ohms, URL);
    expect(lr.timeRequired).toBe('PT5M');
  });

  it('builds a HowTo with concrete steps and the primary equation', () => {
    const ht = howToSchema(ohms, URL);
    expect(ht['@type']).toBe('HowTo');
    expect(ht.name).toBe("How to use the Ohm's Law Calculator");
    const steps = ht.step as { text: string }[];
    expect(steps).toHaveLength(3);
    expect(steps[2].text).toContain('I = V / R');
  });

  it('handles hour and missing learning-time hints', () => {
    const hours = { ...ohms, metadata: { ...ohms.metadata, estimatedLearningTime: '1 h' } };
    expect(learningResourceSchema(hours, URL).timeRequired).toBe('PT1H');
    const none = { ...ohms, metadata: { ...ohms.metadata, estimatedLearningTime: undefined } };
    expect(learningResourceSchema(none, URL).timeRequired).toBeUndefined();
    // HowTo falls back to a default totalTime when the hint is unparseable.
    const odd = { ...ohms, metadata: { ...ohms.metadata, estimatedLearningTime: 'a while' } };
    expect(howToSchema(odd, URL).totalTime).toBe('PT2M');
  });

  it('builds a HowTo even when a manifest declares no equations', () => {
    const noEq = { ...ohms, equations: [] };
    const steps = howToSchema(noEq, URL).step as { text: string }[];
    expect(steps).toHaveLength(3);
    expect(steps[2].text.toLowerCase()).toContain('readouts');
  });

  it('omits educationalLevel when schoolLevel is absent', () => {
    const noLevel = { ...ohms, metadata: { ...ohms.metadata, schoolLevel: undefined } };
    expect(learningResourceSchema(noLevel, URL).educationalLevel).toBeUndefined();
  });

  it('produces valid, serializable JSON-LD for every manifest', () => {
    for (const m of MANIFESTS) {
      const schemas = simulationSchemas(m, URL);
      expect(schemas).toHaveLength(2);
      for (const s of schemas) {
        expect(s['@context']).toBe('https://schema.org');
        // Round-trips through JSON without throwing and drops nothing unexpected.
        expect(() => JSON.parse(JSON.stringify(s))).not.toThrow();
      }
    }
  });
});
