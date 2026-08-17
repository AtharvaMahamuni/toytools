/**
 * Date formatting for authored content dates.
 *
 * Authored dates are stored as ISO 8601 (`YYYY-MM-DD`) because that is what Schema.org requires:
 * `Article.datePublished` and `dateModified` are consumed by machines, and an unparseable value is
 * dropped rather than guessed at. The human-facing string is derived from it here, so one field
 * serves both and the two can never disagree.
 *
 * Before this existed, `GuideConfig.updatedAt` held the display string itself, which put
 * "Jul 2026" into the schema on 102 of 121 guides and rendered a raw "2026-06-07" to the visitor on
 * the 19 that had been written the other way round.
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** Matches the stored contract exactly: `YYYY-MM-DD`, nothing looser. */
export const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True when `value` is a well-formed ISO 8601 calendar date. */
export function isIsoDate(value: string): boolean {
  const m = ISO_DATE.exec(value);
  if (!m) return false;
  const [, y, mo, d] = m;
  const month = Number(mo);
  if (month < 1 || month > 12) return false;
  const day = Number(d);
  if (day < 1 || day > 31) return false;
  // Reject the impossible calendar dates a regex cannot see (2026-02-31).
  const date = new Date(`${y}-${mo}-${d}T00:00:00Z`);
  return date.getUTCFullYear() === Number(y)
    && date.getUTCMonth() + 1 === month
    && date.getUTCDate() === day;
}

/**
 * `2026-06-02` → `Jun 2026`, the form the site has always shown a visitor.
 *
 * Parsed by hand rather than through `Date` + `toLocaleString` so the output cannot drift with the
 * build machine's timezone or locale: a UTC-midnight date rendered in a negative-offset zone lands
 * on the previous day, which silently moves January dates into the year before.
 *
 * Anything that is not an ISO date is returned unchanged, so a bad value shows up on the page
 * instead of being masked. `validate-registry` is what stops one reaching production.
 */
export function formatMonthYear(iso: string): string {
  const m = ISO_DATE.exec(iso);
  if (!m) return iso;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return iso;
  return `${MONTHS[month - 1]} ${m[1]}`;
}
