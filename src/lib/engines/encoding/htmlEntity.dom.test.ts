// @vitest-environment happy-dom
// Phase C item 8: named references decode through the browser parser, so the full HTML5 set works.
import { describe, it, expect } from 'vitest';
import { decodeHtml } from './htmlEntity';

describe('decodeHtml with a DOM (item 8)', () => {
  it('decodes named references beyond the built-in table', () => {
    expect(decodeHtml('caf&eacute; &euro;5 &frac34; &alpha;&beta; &hearts;')).toBe('café €5 ¾ αβ ♥');
  });

  it('leaves unknown names and markup-looking text alone', () => {
    expect(decodeHtml('&notarealentity; &lt;b&gt;')).toBe('&notarealentity; <b>');
  });
});
