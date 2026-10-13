// Phase C item 8 without a DOM: the built-in table covers the common names, digits in names work.
import { describe, it, expect } from 'vitest';
import { decodeHtml } from './htmlEntity';

describe('decodeHtml without a DOM (item 8)', () => {
  it('decodes common named references', () => {
    expect(decodeHtml('caf&eacute; costs &euro;5, &frac12; off, x&sup2;')).toBe('café costs €5, ½ off, x²');
  });
  it('passes unknown names and prototype keys through', () => {
    expect(decodeHtml('&constructor; &zzz9;')).toBe('&constructor; &zzz9;');
  });
});
