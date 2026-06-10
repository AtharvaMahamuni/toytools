import { describe, it, expect } from 'vitest';
import { validateKnowledge } from './schema';
import { KNOWLEDGE_SCHEMA_VERSION } from './types';
import { makeKnowledge } from './fixtures';

describe('validateKnowledge', () => {
  it('accepts a well-formed knowledge object', () => {
    const result = validateKnowledge(makeKnowledge({ slug: 'base64-encoder-decoder' }));
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects non-objects without throwing', () => {
    expect(validateKnowledge(null).ok).toBe(false);
    expect(validateKnowledge('nope').ok).toBe(false);
    expect(validateKnowledge(42).ok).toBe(false);
  });

  it('flags a wrong schemaVersion', () => {
    const k = { ...makeKnowledge({ slug: 'a' }), schemaVersion: 99 as never };
    const result = validateKnowledge(k);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('schemaVersion'))).toBe(true);
  });

  it('requires the core string fields', () => {
    const k = { ...makeKnowledge({ slug: 'a' }), title: '', category: '', summary: '' };
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('missing title'))).toBe(true);
    expect(result.errors.some(e => e.includes('missing category'))).toBe(true);
    expect(result.errors.some(e => e.includes('missing summary'))).toBe(true);
  });

  it('enforces the 160-char summary cap', () => {
    const k = makeKnowledge({ slug: 'a', summary: 'x'.repeat(161) });
    const result = validateKnowledge(k);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes('summary too long'))).toBe(true);
  });

  it('requires non-empty primaryConcepts', () => {
    const k = makeKnowledge({ slug: 'a', primaryConcepts: [] });
    expect(validateKnowledge(k).ok).toBe(false);
  });

  it('requires every intentGroups bucket to be a string array', () => {
    const k = makeKnowledge({ slug: 'a' });
    // @ts-expect-error — intentionally break one bucket
    k.intentGroups.howTo = 'not-an-array';
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('intentGroups.howTo'))).toBe(true);
  });

  it('rejects an invalid workflowStage', () => {
    const k = makeKnowledge({ slug: 'a', workflowStage: ['teleport'] as never });
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('workflowStage'))).toBe(true);
  });

  it('validates RelationshipReference shape', () => {
    const k = makeKnowledge({
      slug: 'a',
      usedWith: [{ slug: '' }, { slug: 'b', strength: 5 }, { slug: 'c', priority: 'x' as never }],
    });
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('usedWith[0] missing slug'))).toBe(true);
    expect(result.errors.some(e => e.includes('strength must be a number in [0,1]'))).toBe(true);
    expect(result.errors.some(e => e.includes('priority must be a number'))).toBe(true);
  });

  it('rejects a self-referencing relationship', () => {
    const k = makeKnowledge({ slug: 'a', alternatives: [{ slug: 'a' }] });
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('references itself'))).toBe(true);
  });

  it('accepts optional reason/strength/priority when well-formed', () => {
    const k = makeKnowledge({
      slug: 'a',
      usedWith: [{ slug: 'b', reason: 'because', strength: 0.9, priority: 1 }],
    });
    expect(validateKnowledge(k).ok).toBe(true);
  });

  it('validates an optional relatedTools override when present', () => {
    const k = makeKnowledge({ slug: 'a', relatedTools: [{ slug: '' }] });
    expect(validateKnowledge(k).ok).toBe(false);
  });

  it('uses the current schema version constant', () => {
    expect(makeKnowledge({ slug: 'a' }).schemaVersion).toBe(KNOWLEDGE_SCHEMA_VERSION);
  });

  it('flags a relationship field that is not an array', () => {
    const k = { ...makeKnowledge({ slug: 'a' }), usedWith: 'nope' as never };
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('usedWith must be an array'))).toBe(true);
  });

  it('flags a relationship entry that is not an object', () => {
    const k = makeKnowledge({ slug: 'a', alternatives: ['just-a-string' as never] });
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('must be an object with a slug'))).toBe(true);
  });

  it('flags a non-string reason', () => {
    const k = makeKnowledge({ slug: 'a', nextSteps: [{ slug: 'b', reason: 42 as never }] });
    const result = validateKnowledge(k);
    expect(result.errors.some(e => e.includes('reason must be a string'))).toBe(true);
  });

  it('flags a negative strength', () => {
    const k = makeKnowledge({ slug: 'a', usedWith: [{ slug: 'b', strength: -0.5 }] });
    expect(validateKnowledge(k).ok).toBe(false);
  });

  it('flags each non-array string field', () => {
    for (const field of ['secondaryConcepts', 'keywords', 'entityAliases', 'realWorldUseCases', 'commonMistakes', 'commonQuestions']) {
      const k = { ...makeKnowledge({ slug: 'a' }), [field]: 'nope' } as never;
      const result = validateKnowledge(k);
      expect(result.errors.some(e => e.includes(`${field} must be a string array`)), field).toBe(true);
    }
  });

  it('flags intentGroups that is not an object', () => {
    const k = { ...makeKnowledge({ slug: 'a' }), intentGroups: null as never };
    expect(validateKnowledge(k).errors.some(e => e.includes('intentGroups must be an object'))).toBe(true);
  });

  it('flags workflowStage that is not an array', () => {
    const k = { ...makeKnowledge({ slug: 'a' }), workflowStage: 'transform' as never };
    expect(validateKnowledge(k).errors.some(e => e.includes('workflowStage must be a non-empty array'))).toBe(true);
  });

  it('flags a missing primaryConcepts that is not even an array', () => {
    const k = { ...makeKnowledge({ slug: 'a' }), primaryConcepts: 'json' as never };
    expect(validateKnowledge(k).ok).toBe(false);
  });
});
