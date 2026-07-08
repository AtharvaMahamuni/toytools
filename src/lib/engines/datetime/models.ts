// Pure date math for the Date & Time engine. Everything here is deterministic and calendar-correct
// (leap years, month lengths, weekday), computed in UTC so date-only arithmetic is never perturbed by
// DST. No module-top-level `new Date()`; callers pass explicit reference dates so the logic is testable.

/** A calendar date with no time component. `m` is 1-12 (not the JS 0-11). */
export interface CivilDate {
  y: number;
  m: number;
  d: number;
}

/** Days in month `m` (1-12) of year `y`, leap-year aware. */
export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Parse 'YYYY-MM-DD' (or the date part of a 'YYYY-MM-DDTHH:mm' datetime-local value). */
export function parseISODate(s: string): CivilDate | null {
  if (typeof s !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12) return null;
  if (d < 1 || d > daysInMonth(y, mo)) return null;
  return { y, m: mo, d };
}

/** Midnight-UTC epoch ms for a civil date — the basis for exact whole-day differences. */
export function toUTCms(c: CivilDate): number {
  return Date.UTC(c.y, c.m - 1, c.d);
}

/** Whole days from `a` to `b` (positive when `b` is later). */
export function daysBetween(a: CivilDate, b: CivilDate): number {
  return Math.round((toUTCms(b) - toUTCms(a)) / 86_400_000);
}

/** Order comparison: negative if a < b, 0 if equal, positive if a > b. */
export function compareCivil(a: CivilDate, b: CivilDate): number {
  return toUTCms(a) - toUTCms(b);
}

/** Weekday of a civil date: 0 = Sunday … 6 = Saturday. */
export function weekdayOf(c: CivilDate): number {
  return new Date(toUTCms(c)).getUTCDay();
}

export interface AgeParts {
  years: number;
  months: number;
  days: number;
}

/**
 * Exact age (or elapsed calendar duration) from `birth` to `ref` as years + months + days, using the
 * standard borrow algorithm. Assumes `ref >= birth`; callers validate that.
 */
export function ageBetween(birth: CivilDate, ref: CivilDate): AgeParts {
  let years = ref.y - birth.y;
  let months = ref.m - birth.m;
  let days = ref.d - birth.d;

  if (days < 0) {
    months -= 1;
    // Borrow the length of the month immediately before ref's month.
    const bm = ref.m - 1 >= 1 ? ref.m - 1 : 12;
    const by = ref.m - 1 >= 1 ? ref.y : ref.y - 1;
    days += daysInMonth(by, bm);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/**
 * The next anniversary of `birth` on or after `ref`. Feb 29 birthdays clamp to the last day of
 * February in non-leap years (the common civil convention).
 */
export function nextBirthday(birth: CivilDate, ref: CivilDate): CivilDate {
  const at = (year: number): CivilDate => ({ y: year, m: birth.m, d: Math.min(birth.d, daysInMonth(year, birth.m)) });
  let candidate = at(ref.y);
  if (compareCivil(candidate, ref) < 0) candidate = at(ref.y + 1);
  return candidate;
}
