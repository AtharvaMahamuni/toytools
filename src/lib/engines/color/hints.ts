// The craft seam for color-format-converter.
//
// The one input this tool reads correctly and silently differently from where it came from: an
// eight-digit hex. CSS defines it as #RRGGBBAA, and Android has always written #AARRGGBB. The two
// standards put alpha at opposite ends of the same eight characters, so the identical string is two
// different colours depending on which tool exported it, and both readings parse without error.
// Somebody pasting a colour out of an Android theme gets a confidently wrong swatch.
//
// This is what the tool can see and the user cannot: it knows the value has eight digits, and it
// can say what the other reading would be. Six and three digit hex, rgb(), hsl() and names have no
// second reading and get nothing.
//
// See docs/analysis/2026-08-11-tool-craft.md.

/** An eight-digit hex, with or without the hash, and nothing else. */
const HEX8 = /^#?[0-9a-fA-F]{8}$/;

export interface HexOrderHint {
  /** The line of text. */
  text: string;
  /** The same eight digits re-ordered to the other convention, ready to put back in the field. */
  swapped: string;
}

/**
 * The Android reading of a CSS eight-digit hex, or null.
 *
 * Silent when the two readings agree, which happens whenever the alpha byte equals the blue byte
 * and red equals green: there is no ambiguity to report and a line would just be noise.
 */
export function hexByteOrder(input: string): HexOrderHint | null {
  const raw = String(input ?? '').trim();
  if (!HEX8.test(raw)) return null;
  const h = raw.replace('#', '').toLowerCase();

  // CSS reads RRGGBBAA, so the colour is the first six digits and alpha is the last two.
  // Android reads AARRGGBB, so alpha is the FIRST two and the colour is the last six.
  const [r, g, b, a] = [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6), h.slice(6, 8)];
  const asAndroid = `#${g}${b}${a}`;

  // When every byte is equal the two readings are the same colour at the same opacity, and there
  // is nothing to report.
  if (asAndroid.slice(1) === `${r}${g}${b}` && a === r) return null;
  const alphaPct = Math.round((parseInt(a, 16) / 255) * 100);
  return {
    text: `Read as CSS #RRGGBBAA: ${alphaPct}% opaque. An Android theme writes #AARRGGBB, where these same digits are ${asAndroid} at ${Math.round((parseInt(r, 16) / 255) * 100)}% opacity.`,
    swapped: asAndroid,
  };
}
