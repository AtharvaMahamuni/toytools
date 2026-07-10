// Timezone support for the Date & Time engine. Pure and deterministic: every offset is read from the
// runtime's IANA database via Intl.DateTimeFormat, so daylight saving is always correct without a
// bundled tz table. No module-top-level Date(); callers pass explicit instants. Intl runs in both the
// browser and Node (vitest), so these are unit-testable.

import type { CivilDateTime } from './models';

export interface ZoneInfo {
  /** IANA identifier, e.g. 'America/New_York'. */
  id: string;
  /** Human label shown in the select, e.g. 'New York (Eastern)'. */
  label: string;
}

/**
 * Curated list of widely used IANA zones, ordered west to east. Not exhaustive: it covers the major
 * business hubs people actually convert between. UTC leads the list as the neutral reference.
 */
export const ZONES: ZoneInfo[] = [
  { id: 'UTC', label: 'UTC' },
  { id: 'Pacific/Honolulu', label: 'Honolulu (Hawaii)' },
  { id: 'America/Anchorage', label: 'Anchorage (Alaska)' },
  { id: 'America/Los_Angeles', label: 'Los Angeles (US Pacific)' },
  { id: 'America/Denver', label: 'Denver (US Mountain)' },
  { id: 'America/Chicago', label: 'Chicago (US Central)' },
  { id: 'America/New_York', label: 'New York (US Eastern)' },
  { id: 'America/Sao_Paulo', label: 'Sao Paulo' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Paris', label: 'Paris (Central Europe)' },
  { id: 'Europe/Berlin', label: 'Berlin' },
  { id: 'Europe/Athens', label: 'Athens (Eastern Europe)' },
  { id: 'Europe/Moscow', label: 'Moscow' },
  { id: 'Asia/Dubai', label: 'Dubai' },
  { id: 'Asia/Karachi', label: 'Karachi' },
  { id: 'Asia/Kolkata', label: 'Mumbai / Kolkata (India)' },
  { id: 'Asia/Dhaka', label: 'Dhaka' },
  { id: 'Asia/Bangkok', label: 'Bangkok' },
  { id: 'Asia/Singapore', label: 'Singapore' },
  { id: 'Asia/Shanghai', label: 'Beijing / Shanghai' },
  { id: 'Asia/Hong_Kong', label: 'Hong Kong' },
  { id: 'Asia/Tokyo', label: 'Tokyo' },
  { id: 'Asia/Seoul', label: 'Seoul' },
  { id: 'Australia/Perth', label: 'Perth' },
  { id: 'Australia/Sydney', label: 'Sydney' },
  { id: 'Pacific/Auckland', label: 'Auckland' },
];

const ZONE_LABELS = new Map(ZONES.map((z) => [z.id, z.label]));

/** Friendly label for a zone id, falling back to the raw id if it is not in the curated list. */
export function zoneLabel(id: string): string {
  return ZONE_LABELS.get(id) ?? id;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

/** A wall-clock reading of an instant in a specific zone, plus the weekday it falls on there. */
export interface ZonedReading extends CivilDateTime {
  weekday: number; // 0 = Sunday
}

/** Read the wall-clock components of `instant` as they appear in `timeZone`. Never throws. */
export function partsInZone(timeZone: string, instant: Date): ZonedReading {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const map: Record<string, string> = {};
  for (const p of dtf.formatToParts(instant)) map[p.type] = p.value;
  let hour = Number(map.hour);
  if (hour === 24) hour = 0; // some engines render midnight as '24'
  return {
    y: Number(map.year),
    m: Number(map.month),
    d: Number(map.day),
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: WEEKDAY_INDEX[map.weekday ?? 'Sun'] ?? 0,
  };
}

/** Offset of `timeZone` at `instant`, in milliseconds (wall-clock time minus UTC). */
export function zoneOffsetMs(timeZone: string, instant: Date): number {
  const p = partsInZone(timeZone, instant);
  const asUTC = Date.UTC(p.y, p.m - 1, p.d, p.hour, p.minute, p.second);
  return asUTC - instant.getTime();
}

/**
 * The UTC instant whose wall-clock reading in `timeZone` matches `wall`. Solved in one refinement so
 * daylight-saving transitions (where the naive guess lands on the wrong side of the jump) resolve
 * correctly.
 */
export function zonedWallToUtc(wall: CivilDateTime, timeZone: string): number {
  const wallMs = Date.UTC(wall.y, wall.m - 1, wall.d, wall.hour, wall.minute, wall.second);
  const guess = zoneOffsetMs(timeZone, new Date(wallMs));
  let utc = wallMs - guess;
  const actual = zoneOffsetMs(timeZone, new Date(utc));
  if (actual !== guess) utc = wallMs - actual;
  return utc;
}

/** Format an offset in ms as 'UTC', 'UTC+05:30', or 'UTC-04:00'. */
export function offsetLabel(ms: number): string {
  if (ms === 0) return 'UTC';
  const sign = ms > 0 ? '+' : '-';
  const totalMin = Math.round(Math.abs(ms) / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 24-hour clock string, e.g. '09:05'. */
export function clock(p: CivilDateTime): string {
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`;
}
