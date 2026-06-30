import { describe, it, expect } from 'vitest';
import { SUPPORTED_CURRENCIES, currencyOption, groupingFor, scaleFor, DEFAULT_CURRENCY } from './currency';

describe('currency', () => {
  it('has a default that resolves', () => {
    expect(currencyOption(DEFAULT_CURRENCY).code).toBe('USD');
  });

  it('falls back to the first currency for unknown codes', () => {
    expect(currencyOption('XYZ').code).toBe(SUPPORTED_CURRENCIES[0].code);
  });

  it('uses Indian grouping for INR, Western otherwise', () => {
    expect(groupingFor('INR')).toBe('indian');
    expect(groupingFor('USD')).toBe('western');
  });

  it('exposes tentative magnitude factors (baseline 1, scaled for INR/JPY)', () => {
    expect(scaleFor('USD')).toBe(1);
    expect(scaleFor('EUR')).toBe(1);
    expect(scaleFor('INR')).toBe(10);
    expect(scaleFor('JPY')).toBe(100);
    expect(scaleFor('XYZ')).toBe(1); // unknown falls back to baseline
  });
});
