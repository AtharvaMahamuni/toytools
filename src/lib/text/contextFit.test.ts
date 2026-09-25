import { describe, expect, it } from 'vitest';
import { CONTEXT_MODELS } from './contextModels';
import { estimateContextFit, estimateContextFitById } from './contextFit';

const gpt = CONTEXT_MODELS[0]!;

describe('estimateContextFit', () => {
  it('is zero for empty input and still an estimate that fits', () => {
    const fit = estimateContextFit('', gpt);
    expect(fit).toMatchObject({ characters: 0, estimatedTokens: 0, percent: 0, fits: true });
  });

  it('rounds characters / 4 up', () => {
    const fit = estimateContextFit('12345', gpt);
    expect(fit.characters).toBe(5);
    expect(fit.estimatedTokens).toBe(2);
  });

  it('fits on the exact boundary and not one token past it', () => {
    const windowChars = gpt.contextWindow * gpt.charsPerToken;
    expect(estimateContextFit('a'.repeat(windowChars), gpt).fits).toBe(true);
    const over = estimateContextFit('a'.repeat(windowChars + 1), gpt);
    expect(over.fits).toBe(false);
    expect(over.estimatedTokens).toBe(gpt.contextWindow + 1);
    expect(over.percent).toBeGreaterThanOrEqual(100);
  });

  it('uses the published window for a large paste', () => {
    const fit = estimateContextFit('a'.repeat(84000), gpt);
    expect(fit.estimatedTokens).toBe(21000);
    expect(fit.contextWindow).toBe(128000);
    expect(fit.percent).toBe(16.4);
    expect(fit.fits).toBe(true);
  });

  it('returns null for an unknown model id', () => {
    expect(estimateContextFitById('hello', 'not-a-model')).toBeNull();
  });

  it('only lists models with a source note and a date', () => {
    expect(CONTEXT_MODELS.length).toBeGreaterThan(0);
    for (const model of CONTEXT_MODELS) {
      expect(model.contextWindow).toBeGreaterThan(0);
      expect(model.sourceNote).toMatch(/^https:\/\//);
      expect(model.lastUpdated).toBe('2026-09-25');
      expect(model.charsPerToken).toBe(4);
    }
  });
});
