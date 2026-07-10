// Pure cron-expression parsing for the Date & Time engine. Handles the standard 5-field format
// (minute hour day-of-month month day-of-week) with *, lists, ranges, steps, and month/weekday names.
// Everything is deterministic and computed in UTC; the caller passes an explicit reference instant so
// "next run" results are testable. Never throws: a malformed expression yields { ok: false, error }.

export interface CronFields {
  minute: number[]; // 0-59
  hour: number[]; // 0-23
  dom: number[]; // 1-31
  month: number[]; // 1-12
  dow: number[]; // 0-6 (Sunday = 0)
  domStar: boolean;
  dowStar: boolean;
}

export type CronParse = { ok: true; fields: CronFields } | { ok: false; error: string };

const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const DOW_NAMES: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DOW_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Resolve a numeric token, mapping month/weekday names to their number. Returns null if unresolved. */
function tokenValue(tok: string, names?: Record<string, number>): number | null {
  const t = tok.trim().toLowerCase();
  if (t === '') return null;
  if (names && t in names) return names[t];
  if (!/^\d+$/.test(t)) return null;
  return Number(t);
}

/** Parse one field into its sorted, de-duplicated set of allowed values. Null on any malformed part. */
function parseField(spec: string, min: number, max: number, names?: Record<string, number>): number[] | null {
  const out = new Set<number>();
  const clampOk = (n: number) => Number.isInteger(n) && n >= min && n <= max;

  for (const partRaw of spec.split(',')) {
    const part = partRaw.trim();
    if (part === '') return null;

    let step = 1;
    let rangePart = part;
    const slash = part.indexOf('/');
    if (slash !== -1) {
      const stepStr = part.slice(slash + 1);
      if (!/^\d+$/.test(stepStr)) return null;
      step = Number(stepStr);
      if (step < 1) return null;
      rangePart = part.slice(0, slash);
    }

    let lo: number;
    let hi: number;
    if (rangePart === '*' || rangePart === '?') {
      lo = min;
      hi = max;
    } else if (rangePart.includes('-')) {
      const [a, b] = rangePart.split('-');
      const av = tokenValue(a, names);
      const bv = tokenValue(b, names);
      if (av === null || bv === null) return null;
      lo = av;
      hi = bv;
    } else {
      const v = tokenValue(rangePart, names);
      if (v === null) return null;
      lo = v;
      hi = slash !== -1 ? max : v; // "5/10" means 5,15,25,... up to max
    }

    if (!clampOk(lo) || !clampOk(hi) || lo > hi) return null;
    for (let n = lo; n <= hi; n += step) out.add(n);
  }

  return [...out].sort((a, b) => a - b);
}

/** Parse a 5-field cron expression. Sunday is accepted as either 0 or 7. */
export function parseCron(expression: string): CronParse {
  if (typeof expression !== 'string') return { ok: false, error: 'Enter a cron expression.' };
  const parts = expression.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { ok: false, error: 'Enter a cron expression.' };
  if (parts.length !== 5) {
    return { ok: false, error: `A cron expression has 5 fields; this has ${parts.length}.` };
  }

  const [minS, hourS, domS, monthS, dowS] = parts;
  const minute = parseField(minS, 0, 59);
  const hour = parseField(hourS, 0, 23);
  const dom = parseField(domS, 1, 31);
  const month = parseField(monthS, 1, 12, MONTH_NAMES);
  // Accept 7 as Sunday by parsing 0-7 then folding 7 into 0.
  const dowRaw = parseField(dowS, 0, 7, DOW_NAMES);

  const fieldName = ['minute', 'hour', 'day-of-month', 'month', 'day-of-week'];
  const results = [minute, hour, dom, month, dowRaw];
  for (let i = 0; i < results.length; i++) {
    if (results[i] === null) return { ok: false, error: `The ${fieldName[i]} field is not valid.` };
  }

  const dow = [...new Set((dowRaw as number[]).map((n) => (n === 7 ? 0 : n)))].sort((a, b) => a - b);

  return {
    ok: true,
    fields: {
      minute: minute as number[],
      hour: hour as number[],
      dom: dom as number[],
      month: month as number[],
      dow,
      domStar: domS === '*' || domS === '?',
      dowStar: dowS === '*' || dowS === '?',
    },
  };
}

/** Does an instant (read in UTC) satisfy the schedule? Applies the standard DOM/DOW OR rule. */
export function cronMatches(f: CronFields, d: Date): boolean {
  if (!f.minute.includes(d.getUTCMinutes())) return false;
  if (!f.hour.includes(d.getUTCHours())) return false;
  if (!f.month.includes(d.getUTCMonth() + 1)) return false;

  const domHit = f.dom.includes(d.getUTCDate());
  const dowHit = f.dow.includes(d.getUTCDay());
  // When both DOM and DOW are restricted, a day matches if EITHER matches (classic cron behaviour).
  if (!f.domStar && !f.dowStar) return domHit || dowHit;
  return domHit && dowHit;
}

/** The next `count` run instants at or after `from` (exclusive of `from`'s exact minute). UTC-based. */
export function nextRuns(f: CronFields, from: Date, count: number): Date[] {
  const out: Date[] = [];
  // Start at the next whole minute.
  const start = new Date(from.getTime());
  start.setUTCSeconds(0, 0);
  start.setUTCMinutes(start.getUTCMinutes() + 1);

  const cur = new Date(start.getTime());
  const maxIterations = 4 * 366 * 24 * 60; // ~4 years of minutes
  for (let i = 0; i < maxIterations && out.length < count; i++) {
    if (cronMatches(f, cur)) out.push(new Date(cur.getTime()));
    cur.setUTCMinutes(cur.getUTCMinutes() + 1);
  }
  return out;
}

/**
 * Runs per day when that number is constant (month and both day fields unrestricted). Otherwise null,
 * because restricting the day-of-month or day-of-week makes some days differ from others.
 */
export function runsPerDay(f: CronFields): number | null {
  if (!f.domStar || !f.dowStar || f.month.length !== 12) return null;
  return f.minute.length * f.hour.length;
}

function listPhrase(values: number[], labels: string[]): string {
  const named = values.map((v) => labels[v]);
  if (named.length === 1) return named[0];
  if (named.length === 2) return `${named[0]} and ${named[1]}`;
  return `${named.slice(0, -1).join(', ')}, and ${named[named.length - 1]}`;
}

/** Is a numeric set a simple arithmetic step from its minimum across the whole range? */
function stepOf(values: number[], min: number, max: number): number | null {
  if (values.length < 2 || values[0] !== min) return null;
  const step = values[1] - values[0];
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== min + i * step) return null;
  }
  if (min + values.length * step <= max) return null; // must span the whole range
  return step;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** A plain-English description of the schedule. Pragmatic: neat phrases for common shapes, else a
 * field-by-field sentence. */
export function describeCron(f: CronFields): string {
  const everyMinute = f.minute.length === 60;
  const everyHour = f.hour.length === 24;
  const minStep = stepOf(f.minute, 0, 59);
  const hourStep = stepOf(f.hour, 0, 23);

  let time: string;
  if (everyMinute && everyHour) {
    time = 'Every minute';
  } else if (minStep !== null && everyHour) {
    time = `Every ${minStep} minutes`;
  } else if (everyMinute && f.hour.length === 1) {
    time = `Every minute during ${pad2(f.hour[0])}:00`;
  } else if (hourStep !== null && f.minute.length === 1) {
    time = `Every ${hourStep} hours at minute ${f.minute[0]}`;
  } else if (f.minute.length === 1 && everyHour) {
    time = `At minute ${f.minute[0]} of every hour`;
  } else if (f.minute.length === 1 && f.hour.length === 1) {
    time = `At ${pad2(f.hour[0])}:${pad2(f.minute[0])}`;
  } else if (f.hour.length === 1) {
    time = `At minutes ${f.minute.join(', ')} past ${pad2(f.hour[0])}:00`;
  } else {
    time = `At minute ${f.minute.join(',')} of hour ${f.hour.join(',')}`;
  }

  const quals: string[] = [];
  if (!f.dowStar) quals.push(`on ${listPhrase(f.dow, DOW_LABELS)}`);
  if (!f.domStar) quals.push(`on day ${f.dom.join(', ')} of the month`);
  if (f.month.length !== 12) quals.push(`in ${listPhrase(f.month.map((m) => m - 1), MONTH_LABELS)}`);

  return quals.length ? `${time} ${quals.join(', ')}` : time;
}
