import { describe, expect, it } from 'vitest';
import { hexByteOrder } from './hints';

describe('hexByteOrder — the two standards that share one string', () => {
  it('names the Android reading of a CSS eight-digit hex', () => {
    // CSS: #3366ff at cc (80%). Android: alpha 33, colour #66ffcc.
    const r = hexByteOrder('#3366ffcc');
    expect(r?.text).toContain('80% opaque');
    expect(r?.text).toContain('#66ffcc');
    expect(r?.swapped).toBe('#66ffcc');
  });

  it('reports the opacity each standard would apply, which is the visible difference', () => {
    const r = hexByteOrder('#80ff0000');
    // CSS reads alpha 00: fully transparent. Android reads alpha 80: 50%.
    expect(r?.text).toContain('0% opaque');
    expect(r?.text).toContain('50% opacity');
  });

  it('works without the hash, as a value pasted out of a theme file arrives', () => {
    expect(hexByteOrder('3366ffcc')?.swapped).toBe('#66ffcc');
  });
});

describe('hexByteOrder — silence', () => {
  it('says nothing for the hex lengths that have only one reading', () => {
    expect(hexByteOrder('#3366ff')).toBeNull();
    expect(hexByteOrder('#36f')).toBeNull();
  });

  it('says nothing for the other formats, which are unambiguous', () => {
    expect(hexByteOrder('rgb(51, 102, 255)')).toBeNull();
    expect(hexByteOrder('hsl(220, 100%, 60%)')).toBeNull();
    expect(hexByteOrder('teal')).toBeNull();
  });

  it('says nothing for empty or unparseable input', () => {
    expect(hexByteOrder('')).toBeNull();
    expect(hexByteOrder('   ')).toBeNull();
    expect(hexByteOrder('#3366fffff')).toBeNull();
  });

  it('says nothing when both readings are the same eight characters', () => {
    // aabbccaa rotated is aaaabbcc, a different string, so that is not the case;
    // the degenerate one is a value whose rotation is itself.
    expect(hexByteOrder('#aaaaaaaa')).toBeNull();
  });
});
