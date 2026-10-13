// Phase C batch C1 text fixes: slugify transliteration, grapheme reverse, emoji-safe cleaning.
import { describe, it, expect } from 'vitest';
import { runProcessor } from './processors/registry';
import { textHandoff } from './handoff';

describe('slugify (item 3)', () => {
  it('spells out letters that do not decompose instead of deleting them', () => {
    expect(runProcessor('slugify', 'Straße Øresund Łódź æble')).toBe('strasse-oresund-lodz-aeble');
    expect(runProcessor('slugify', 'ŒUVRE')).toBe('oeuvre');
    expect(runProcessor('slugify', 'Þórður Đặng')).toBe('thordur-dang');
    expect(runProcessor('slugify', 'Café Menu!')).toBe('cafe-menu');
  });

  it('says why a non-Latin line slugified to nothing', () => {
    for (const input of ['Привет мир', '日本語']) {
      expect(runProcessor('slugify', input)).toBe('');
      const h = textHandoff('slugify', input, '');
      expect(h?.text).toMatch(/no Latin letters or digits/);
    }
  });
});

import { graphemes, graphemesFallback } from './graphemes';

describe('reverse text by grapheme (item 4)', () => {
  it('keeps a combining accent with its letter', () => {
    expect(runProcessor('reverseText', 'Cafe\u0301 ok')).toBe('ko e\u0301faC');
    expect(runProcessor('reverseText', 'e\u0301a')).toBe('ae\u0301');
    expect(runProcessor('reverseText', 'abc\n123')).toBe('321\ncba');
  });

  it('keeps emoji, skin tones, ZWJ families and flags whole', () => {
    expect(runProcessor('reverseText', 'a👩‍💻b👍🏽c🇮🇳')).toBe('🇮🇳c👍🏽b👩‍💻a');
  });

  it('the fallback agrees with Intl.Segmenter on the common clusters', () => {
    for (const t of ['Cafe\u0301', 'e\u0301a', '👨‍👩‍👧 ok', '🇮🇳🇯🇵', '❤️x', 'a\r\nb', 'n\u0303o\u0308']) {
      expect(graphemesFallback(t), JSON.stringify(t)).toEqual(graphemes(t));
    }
  });
});
