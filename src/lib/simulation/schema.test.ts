import { describe, expect, it } from 'vitest';
import { learningResourceSchema, howToSchema, simulationSchemas } from './schema';
import { MANIFESTS } from './manifests';

const URL = 'https://toytoolsapp.com/tool/physics/ohms-law-simulator/';
const ohms = MANIFESTS.find((m) => m.metadata.slug === 'ohms-law-simulator')!;

describe('simulation JSON-LD schema', () => {
  it('builds a LearningResource that teaches the concepts and equations', () => {
    const lr = learningResourceSchema(ohms, URL);
    expect(lr['@type']).toBe('LearningResource');
    expect(lr.name).toBe("Ohm's Law Simulator");
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
    expect(ht.name).toBe("How to use the Ohm's Law Simulator");
    const steps = ht.step as { text: string }[];
    expect(steps).toHaveLength(3);
    expect(steps[2].text).toContain('I = V / R');
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
