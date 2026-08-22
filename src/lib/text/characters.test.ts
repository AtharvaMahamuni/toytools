// The character map's catalogue. It is data rather than logic, so the tests guard the properties a
// grid of 365 tap targets depends on: no duplicates, every cell labelled, and every escape actually
// pointing at the character it sits beside.

import { describe, it, expect } from 'vitest';
import {
  characterGroups,
  allCharacters,
  codePoint,
  htmlEntity,
  cssEscape,
  jsEscape,
} from './characters';

describe('the character catalogue', () => {
  it('has groups, each with a name, a description and characters', () => {
    expect(characterGroups.length).toBeGreaterThanOrEqual(8);
    for (const g of characterGroups) {
      expect(g.name.length, g.name).toBeGreaterThan(2);
      expect(g.description.length, g.name).toBeGreaterThan(20);
      expect(g.characters.length, g.name).toBeGreaterThan(4);
    }
  });

  it('lists every character exactly once', () => {
    const seen = new Set(allCharacters.map(c => c.char));
    expect(seen.size).toBe(allCharacters.length);
  });

  it('gives every character a usable name, since the name is the only way to search', () => {
    for (const c of allCharacters) {
      // "AE" and "OE" are the shortest legitimate names in here, so two is the floor.
      expect(c.name.trim().length, c.char).toBeGreaterThanOrEqual(2);
      expect(c.name, c.char).not.toMatch(/^</);
    }
  });

  it('holds single characters only, so one tap copies one thing', () => {
    for (const c of allCharacters) {
      expect([...c.char].length, c.name).toBe(1);
    }
  });

  it('carries no ASCII character a keyboard already has', () => {
    // A plain hyphen, a straight quote or a caret in here would defeat the point of the tool: the
    // map exists for characters you cannot type. The dollar sign is the single exception, because a
    // currency group that omits it reads as broken rather than as principled.
    for (const c of allCharacters) {
      const cp = c.char.codePointAt(0)!;
      if (c.char === '$') continue;
      expect(cp, `${c.name} is plain ASCII`).toBeGreaterThan(0x7e);
    }
  });
});

describe('the escape forms', () => {
  it('writes the code point in the U+ form people search for', () => {
    expect(codePoint('°')).toBe('U+00B0');
    expect(codePoint('→')).toBe('U+2192');
    expect(codePoint('€')).toBe('U+20AC');
  });

  it('prefers the named HTML entity and falls back to the numeric one', () => {
    expect(htmlEntity({ char: '—', name: 'EM Dash', entity: 'mdash' })).toBe('&mdash;');
    expect(htmlEntity({ char: '⌘', name: 'Place Of Interest Sign' })).toBe('&#8984;');
  });

  it('writes a CSS escape as a backslash and hex', () => {
    expect(cssEscape('→')).toBe('\\2192');
    expect(cssEscape('°')).toBe('\\B0');
  });

  it('pads a JavaScript escape to four digits and uses braces past the BMP', () => {
    expect(jsEscape('°')).toBe('\\u00B0');
    expect(jsEscape('→')).toBe('\\u2192');
    expect(jsEscape('𝄞')).toBe('\\u{1D11E}');
  });

  it('round-trips every catalogued character through its own escapes', () => {
    for (const c of allCharacters) {
      const fromCss = String.fromCodePoint(parseInt(cssEscape(c.char).slice(1), 16));
      expect(fromCss, c.name).toBe(c.char);

      const entity = htmlEntity(c);
      if (entity.startsWith('&#')) {
        expect(String.fromCodePoint(Number(entity.slice(2, -1))), c.name).toBe(c.char);
      }
    }
  });
});
