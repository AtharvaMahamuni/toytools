import { describe, it, expect } from 'vitest';
import { raw, makeInputs } from '../fixtures';
import { scoreDemand } from './demand';
import { scoreCompetition } from './competition';
import { scoreEvergreen } from './evergreen';
import { scoreImplementation } from './implementation';
import { scoreEngineReuse } from './engine-reuse';
import { scoreSeo } from './seo';
import { scoreLocalization } from './localization';
import { scoreConfidence } from './confidence';

const inputs = makeInputs({ raw: [] });

describe('scorers', () => {
  it('demand normalizes 0..1', () => {
    expect(scoreDemand(raw({ proposedTool: 'a', demand: 100 }))).toBe(1);
    expect(scoreDemand(raw({ proposedTool: 'a', demand: 0 }))).toBe(0);
  });

  it('competition returns openness: high competition lowers it, weaknesses raise it', () => {
    const closed = scoreCompetition(raw({ proposedTool: 'a', competition: 90, solutionWeaknesses: [] }));
    const open = scoreCompetition(raw({ proposedTool: 'a', competition: 10, solutionWeaknesses: ['x', 'y'] }));
    expect(open).toBeGreaterThan(closed);
    expect(open).toBeLessThanOrEqual(1);
  });

  it('evergreen + localization normalize 0..1', () => {
    expect(scoreEvergreen(raw({ proposedTool: 'a', evergreen: 50 }))).toBe(0.5);
    expect(scoreLocalization(raw({ proposedTool: 'a', localization: 25 }))).toBe(0.25);
  });

  it('implementation: low difficulty + reuse is cheapest', () => {
    const easy = scoreImplementation(raw({ proposedTool: 'a', difficulty: 'low', proposedEngine: 'text-processor' }), inputs);
    const hard = scoreImplementation(raw({ proposedTool: 'a', difficulty: 'high', proposedEngine: 'csv' }), inputs);
    expect(easy).toBeGreaterThan(hard);
    expect(easy).toBeLessThanOrEqual(1);
  });

  it('engine-reuse: 1 for known engine, lower for new engine', () => {
    expect(scoreEngineReuse(raw({ proposedTool: 'a', proposedEngine: 'text-processor' }), inputs)).toBe(1);
    expect(scoreEngineReuse(raw({ proposedTool: 'a', proposedEngine: 'csv' }), inputs)).toBeLessThan(1);
  });

  it('seo rewards query breadth + demand', () => {
    const broad = scoreSeo(raw({ proposedTool: 'a', demand: 90, searchQueries: ['a', 'b', 'c', 'd', 'e'] }));
    const narrow = scoreSeo(raw({ proposedTool: 'a', demand: 10, searchQueries: ['a'] }));
    expect(broad).toBeGreaterThan(narrow);
  });

  it('confidence rises with corroborating sources', () => {
    const one = scoreConfidence(raw({ proposedTool: 'a' }), 1);
    const many = scoreConfidence(raw({ proposedTool: 'a' }), 3);
    expect(many).toBeGreaterThanOrEqual(one);
    expect(many).toBeLessThanOrEqual(1);
  });
});
