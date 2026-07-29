// Tracker engine model — pure, framework-free, DOM-free logic shared by every habit/measurement
// tracker (water, weight, and future ones). Entries are a simple {date, value} log with one entry
// per calendar day; everything else (streaks, aggregates, chart series) is derived. Dates are
// 'YYYY-MM-DD' strings and all day arithmetic goes through UTC day-numbers so it is timezone-safe.

export interface Entry {
  /** Local calendar day, 'YYYY-MM-DD'. */
  date: string;
  /** The logged number for that day (glasses, kilograms, ...). */
  value: number;
}

const MS_PER_DAY = 86400000;

/** Whole days since the Unix epoch for a 'YYYY-MM-DD' string (UTC-based, so no DST drift). */
export function dayNumber(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round(Date.UTC(y, (m ?? 1) - 1, d ?? 1) / MS_PER_DAY);
}

/** The inverse of dayNumber: a day-number back to its 'YYYY-MM-DD' string. */
export function isoFromDayNumber(n: number): string {
  return new Date(n * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Today's local calendar day as 'YYYY-MM-DD'. Inject `now` in tests. */
export function todayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** A date -> value map for O(1) lookups. Later duplicates for a date win (defensive). */
export function entryMap(entries: Entry[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const e of entries) map.set(e.date, e.value);
  return map;
}

/** The value logged on a date, or 0 when there is no entry. */
export function valueOn(entries: Entry[], date: string): number {
  return entryMap(entries).get(date) ?? 0;
}

/**
 * Set (add or replace) a day's value and return a NEW array sorted ascending by date. A value of 0
 * or less removes the day's entry entirely, so "clear today" is just upsert(_, today, 0).
 */
export function upsert(entries: Entry[], date: string, value: number): Entry[] {
  const map = entryMap(entries);
  if (value > 0) map.set(date, value);
  else map.delete(date);
  return [...map.entries()]
    .map(([d, v]) => ({ date: d, value: v }))
    .sort((a, b) => dayNumber(a.date) - dayNumber(b.date));
}

/** Add `delta` to a day's value (never below 0), returning a new array. */
export function increment(entries: Entry[], date: string, delta: number, step = 1): Entry[] {
  const next = Math.max(0, valueOn(entries, date) + delta * step);
  return upsert(entries, date, next);
}

/** Sum of all logged values. */
export function total(entries: Entry[]): number {
  return entries.reduce((sum, e) => sum + e.value, 0);
}

/**
 * The last `n` calendar days ending at `today` (inclusive), oldest first, with missing days filled
 * as value 0 so a chart always has a fixed-width, gap-free series.
 */
export function lastNDays(entries: Entry[], today: string, n: number): Entry[] {
  const map = entryMap(entries);
  const end = dayNumber(today);
  const out: Entry[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const dn = end - i;
    const date = isoFromDayNumber(dn);
    out.push({ date, value: map.get(date) ?? 0 });
  }
  return out;
}

/**
 * Consecutive-day streak ending at (or just before) `today`. `qualifies` decides whether a day's
 * value counts. Today is given grace: if today has no qualifying entry yet, the count starts from
 * yesterday, so an as-yet-unlogged current day does not zero a live streak.
 */
export function currentStreak(entries: Entry[], today: string, qualifies: (value: number) => boolean): number {
  const map = entryMap(entries);
  const has = (dn: number) => {
    const v = map.get(isoFromDayNumber(dn));
    return v !== undefined && qualifies(v);
  };
  let dn = dayNumber(today);
  if (!has(dn)) dn -= 1; // grace for the in-progress day
  let count = 0;
  while (has(dn)) {
    count++;
    dn--;
  }
  return count;
}

/** The longest run of consecutive qualifying calendar days anywhere in the history. */
export function longestStreak(entries: Entry[], qualifies: (value: number) => boolean): number {
  const days = entries
    .filter((e) => qualifies(e.value))
    .map((e) => dayNumber(e.date))
    .sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = NaN;
  for (const dn of days) {
    run = dn === prev + 1 ? run + 1 : 1;
    if (run > best) best = run;
    prev = dn;
  }
  return best;
}

/** Simple trailing moving average over a numeric series; window clamps to available history. */
export function movingAverage(values: number[], window: number): number[] {
  if (window < 1) return values.slice();
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    out.push(slice.reduce((s, v) => s + v, 0) / slice.length);
  }
  return out;
}

/**
 * Cap an entry log so it cannot grow without bound. Keeps every entry inside `maxDays` of `today`,
 * and if that still exceeds `maxEntries`, keeps the most recent `maxEntries`. Pure and defensive:
 * the newest data is always what survives, because a tracker's recent history is what the streaks,
 * chart, and trend are computed from.
 *
 * At roughly 30 bytes a day the practical ceiling was never a quota problem, but "grows forever"
 * is not a design, and an export/restore cycle should not carry a decade of dead rows.
 */
export function prune(
  entries: Entry[],
  today: string,
  opts: { maxDays?: number; maxEntries?: number } = {},
): Entry[] {
  const maxDays = opts.maxDays ?? 730; // two years
  const maxEntries = opts.maxEntries ?? 1000;
  const cutoff = dayNumber(today) - maxDays;
  const kept = entries
    .filter((e) => dayNumber(e.date) > cutoff)
    .sort((a, b) => dayNumber(a.date) - dayNumber(b.date));
  return kept.length > maxEntries ? kept.slice(kept.length - maxEntries) : kept;
}
