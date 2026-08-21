// Invisible-character detection tests.
//
// The silence cases carry as much weight as the detection ones. A detector that flags ordinary text
// gets ignored, and this one has to be believed on the day it matters, so plain ASCII, normal
// spaces, newlines and non-Latin text that is simply non-Latin must all come back clean.

import { describe, it, expect } from 'vitest';
import { detectInvisible } from './invisible';

describe('detectInvisible — finds what cannot be seen', () => {
  it('finds a zero-width space and reports where it is', () => {
    const r = detectInvisible('he​llo');
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]!.index).toBe(2);
    expect(r.findings[0]!.codePoint).toBe('U+200B');
    expect(r.findings[0]!.kind).toBe('invisible');
  });

  it('finds a no-break space and says why trim() did not help', () => {
    const r = detectInvisible('col umn');
    expect(r.findings[0]!.name).toBe('No-break space');
    expect(r.findings[0]!.effect).toMatch(/trim\(\)/);
    expect(r.findings[0]!.kind).toBe('confusable');
  });

  it('finds smart quotes, the usual cause of a broken string literal', () => {
    const r = detectInvisible('const a = “hi”');
    expect(r.counts.confusable).toBe(2);
  });

  it('finds a right-to-left override, which reorders display without changing bytes', () => {
    const r = detectInvisible('safe‮gnp.exe');
    expect(r.findings[0]!.kind).toBe('dangerous');
    expect(r.findings[0]!.name).toMatch(/override/i);
  });
});

describe('detectInvisible — stays quiet on text that is fine', () => {
  it('reports nothing for plain ASCII, spaces, tabs and newlines', () => {
    const r = detectInvisible('Hello, World!\n\tSecond line. 123');
    expect(r.findings).toEqual([]);
    expect(r.spoofRisk).toBeNull();
  });

  it('reports nothing for an empty string', () => {
    expect(detectInvisible('').findings).toEqual([]);
  });

  it('does not warn about non-Latin text that is simply non-Latin', () => {
    // Entirely Cyrillic. This is Russian, not an attack, and flagging it would be both wrong
    // and insulting. The warning requires Latin to be present for the lookalike to work.
    const r = detectInvisible('Привет');
    expect(r.spoofRisk).toBeNull();
  });
});

describe('detectInvisible — the craft: a character wearing another one’s face', () => {
  it('warns when Latin text hides a Cyrillic lookalike', () => {
    // "pаypal" — the second character is Cyrillic а (U+0430), not Latin a.
    const r = detectInvisible('pаypal.com');
    expect(r.spoofRisk).not.toBeNull();
    expect(r.spoofRisk!.scripts).toEqual(['Latin', 'Cyrillic']);
    expect(r.spoofRisk!.samples).toEqual(['а']);
    expect(r.findings[0]!.kind).toBe('dangerous');
    expect(r.findings[0]!.effect).toMatch(/looks exactly like/i);
  });

  it('names every script in the mix, not just the first', () => {
    const r = detectInvisible('aаοb'); // Latin + Cyrillic а + Greek ο
    expect(r.spoofRisk!.scripts).toEqual(['Latin', 'Cyrillic', 'Greek']);
  });

  it('does not raise a spoof warning for an invisible character alone', () => {
    // A zero-width space is a bug, not an impersonation. Conflating the two would make the
    // security warning fire on every messy paste and stop meaning anything.
    expect(detectInvisible('he​llo').spoofRisk).toBeNull();
  });
});

describe('detectInvisible — the cleaned output', () => {
  it('deletes what should vanish and substitutes what should be ASCII', () => {
    const r = detectInvisible('he​llo there’s');
    expect(r.cleaned).toBe("hello there's");
  });

  it('restores the ASCII letter a homoglyph was impersonating', () => {
    expect(detectInvisible('pаypal').cleaned).toBe('paypal');
  });

  it('returns the input unchanged when there is nothing to fix', () => {
    const input = 'Nothing wrong here.';
    expect(detectInvisible(input).cleaned).toBe(input);
  });
});
