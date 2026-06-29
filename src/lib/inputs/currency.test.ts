import { describe, it, expect } from 'vitest';
import { SUPPORTED_CURRENCIES, currencyOption, groupingFor, DEFAULT_CURRENCY } from './currency';

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
});
