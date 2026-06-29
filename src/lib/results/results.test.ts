import { describe, it, expect } from 'vitest';
import {
  emptyResult,
  validationError,
  calculationError,
  successResult,
  card,
  isError,
  DEFAULT_LAYOUT,
  DEFAULT_CAPABILITIES,
} from './index';

describe('result builders', () => {
  it('emptyResult is the neutral empty state', () => {
    const r = emptyResult();
    expect(r).toEqual({ ok: false, uiState: 'empty', metrics: [] });
  });

  it('validationError and calculationError carry distinct uiStates', () => {
    expect(validationError('bad').uiState).toBe('validation-error');
    expect(validationError('bad').error).toBe('bad');
    expect(calculationError('boom').uiState).toBe('calculation-error');
    expect(validationError('x').ok).toBe(false);
  });

  it('successResult always sets ok/success and an array of metrics', () => {
    const r = successResult({ hero: card('h', 'Final', '$1,100', { raw: 1100, emphasis: 'hero' }) });
    expect(r.ok).toBe(true);
    expect(r.uiState).toBe('success');
    expect(Array.isArray(r.metrics)).toBe(true);
    expect(r.hero?.raw).toBe(1100);
  });

  it('card builder attaches optional fields', () => {
    expect(card('a', 'A', '1', { raw: 1, emphasis: 'primary', note: 'n' })).toEqual({
      id: 'a',
      label: 'A',
      value: '1',
      raw: 1,
      emphasis: 'primary',
      note: 'n',
    });
  });

  it('isError flags only the failure states', () => {
    expect(isError('validation-error')).toBe(true);
    expect(isError('calculation-error')).toBe(true);
    expect(isError('success')).toBe(false);
    expect(isError('empty')).toBe(false);
  });

  it('default layout + capabilities are stable contracts', () => {
    expect(DEFAULT_LAYOUT[0]).toBe('hero');
    expect(DEFAULT_LAYOUT).toContain('decisions');
    expect(DEFAULT_CAPABILITIES.copy).toBe(true);
    expect(DEFAULT_CAPABILITIES.share).toBe(false);
  });
});
