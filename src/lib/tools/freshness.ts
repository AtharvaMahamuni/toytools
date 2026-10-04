/** Whole UTC days a tool keeps its New badge, counting the day of `addedOn` as day one. */
export const NEW_TAG_DAYS = 5;

const DAY_MS = 86_400_000;

/** UTC midnight for a YYYY-MM-DD string, or null when the date is not real. */
export function parseAddedOn(value: string | undefined): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  return utc;
}

function utcToday(now: Date): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/** True on the added day and the four UTC days after it: five whole days in all. */
export function isFresh(addedOn: string | undefined, now: Date = new Date()): boolean {
  const start = parseAddedOn(addedOn);
  if (start === null) return false;
  const delta = Math.round((utcToday(now) - start) / DAY_MS);
  return delta >= 0 && delta < NEW_TAG_DAYS;
}

/** Start of the UTC day after the five-day window. A badge leaves once `Date.now()` reaches this. */
export function newUntilIso(addedOn: string | undefined): string | null {
  const start = parseAddedOn(addedOn);
  if (start === null) return null;
  return new Date(start + NEW_TAG_DAYS * DAY_MS).toISOString();
}

/** ISO instant for a badge that should render now, or undefined when the window has closed. */
export function freshUntil(addedOn: string | undefined, now: Date = new Date()): string | undefined {
  if (!isFresh(addedOn, now)) return undefined;
  return newUntilIso(addedOn) ?? undefined;
}
