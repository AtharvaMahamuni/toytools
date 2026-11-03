// Phase C item 8 without a DOM: the built-in table covers the common names, digits in names work.
import { describe, it, expect } from 'vitest';
import { decodeHtml, htmlEntity } from './htmlEntity';

describe('decodeHtml without a DOM (item 8)', () => {
  it('decodes common named references', () => {
    expect(decodeHtml('caf&eacute; costs &euro;5, &frac12; off, x&sup2;')).toBe('café costs €5, ½ off, x²');
  });
  it('passes unknown names and prototype keys through', () => {
    expect(decodeHtml('&constructor; &zzz9;')).toBe('&constructor; &zzz9;');
  });
});

// Regression (#291 shipped this): the semicolon fix rewrote "&copyright" as "©right".
describe('missing-semicolon fix only for complete entity names', () => {
  it('leaves ordinary words that start with an entity name alone', () => {
    expect(htmlEntity.recover!('Read the &copyright notice', 'decode')).toBeNull();
    expect(htmlEntity.recover!('&ltd and &region', 'decode')).toBeNull();
  });

  it('adds the semicolon after a complete name followed by a non-letter', () => {
    expect(htmlEntity.recover!('&copy 2026 &amp more', 'decode')?.text).toBe('&copy; 2026 &amp; more');
    expect(htmlEntity.recover!('a &lt b', 'decode')?.text).toBe('a &lt; b');
    expect(htmlEntity.recover!('end &reg', 'decode')?.text).toBe('end &reg;');
  });
});
