// An integer too large for a JavaScript number, kept as the exact digits that were written.
// JSON.parse, js-yaml and Number() all round 12345678901234567890 to 12345678901234567000; the
// converters carry these values as LosslessInt instead and write the digits back out unchanged.

export class LosslessInt {
  constructor(readonly raw: string) {}
  toString(): string {
    return this.raw;
  }
}

/** True for an integer literal (optional minus, digits only) that a double cannot hold exactly. */
export function isUnsafeIntLiteral(raw: string): boolean {
  return /^-?\d+$/.test(raw) && !Number.isSafeInteger(Number(raw));
}

/**
 * A marker no input contains: a private-use character plus a random token, regenerated until it
 * does not occur in `avoid`. A fixed marker could be forged by data that happens to contain it.
 */
export function freshMarker(avoid = ''): string {
  for (;;) {
    const m = `\uE000${Math.random().toString(36).slice(2)}${Date.now().toString(36)}:`;
    if (!avoid.includes(m)) return m;
  }
}

const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wrap a raw integer token as the JSON string the parser reads back as a LosslessInt. */
export function markInt(raw: string, marker: string): string {
  return `"${marker}${raw}"`;
}

/** JSON.parse reviver that turns `marker`-prefixed strings back into LosslessInt. */
export function intReviver(marker: string): (key: string, value: unknown) => unknown {
  return (_key, value) =>
    typeof value === 'string' && value.startsWith(marker) ? new LosslessInt(value.slice(marker.length)) : value;
}

/**
 * JSON.stringify that writes each LosslessInt as its exact digits. `replacer` runs first for every
 * other value, as JSON.stringify's own replacer would.
 */
export function stringifyLossless(
  value: unknown,
  indent?: number,
  replacer?: (key: string, value: unknown) => unknown,
): string {
  let found = false;
  const marker = freshMarker();
  const out = JSON.stringify(
    value,
    (key, v) => {
      if (v instanceof LosslessInt) {
        found = true;
        return marker + v.raw;
      }
      return replacer ? replacer(key, v) : v;
    },
    indent,
  );
  if (!found) return out;
  // A string in the data that happened to contain this fresh marker would be rewritten too, so
  // check once and fall back to a new marker in that (astronomically unlikely) case.
  const re = new RegExp(`"${escapeRe(marker)}(-?\\d+)"`, 'g');
  const plain = JSON.stringify(value, (k, v) => (v instanceof LosslessInt ? 0 : replacer ? replacer(k, v) : v), indent);
  if (plain.includes(marker)) return stringifyLossless(value, indent, replacer);
  return out.replace(re, '$1');
}
