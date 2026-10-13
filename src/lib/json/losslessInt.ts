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

const MARK = '\uE000int:';
const MARKED = /"\uE000int:(-?\d+)"/g;

/** Wrap a raw integer token as the JSON string the parser reads back as a LosslessInt. */
export function markInt(raw: string): string {
  return `"${MARK}${raw}"`;
}

/** JSON.parse reviver that turns marked strings back into LosslessInt. */
export function reviveInt(_key: string, value: unknown): unknown {
  return typeof value === 'string' && value.startsWith(MARK) ? new LosslessInt(value.slice(MARK.length)) : value;
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
  const out = JSON.stringify(
    value,
    (key, v) => {
      if (v instanceof LosslessInt) {
        found = true;
        return MARK + v.raw;
      }
      return replacer ? replacer(key, v) : v;
    },
    indent,
  );
  return found ? out.replace(MARKED, '$1') : out;
}
