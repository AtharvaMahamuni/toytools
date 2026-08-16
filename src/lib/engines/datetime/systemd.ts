// Cron to systemd OnCalendar translation, for the Date & Time engine.
//
// The two grammars look similar enough that people translate by eye, and they differ in one place
// that produces no error and no warning: when a crontab line restricts BOTH day-of-month and
// day-of-week, cron fires when EITHER matches, and systemd fires only when BOTH do. A timer
// translated across that difference loads cleanly, reports a sensible next elapse, and quietly runs
// on a different set of days for as long as nobody checks.
//
// So this module emits the OnCalendar expression AND evaluates both semantics, because a translator
// that cannot show the divergence is the thing that caused the problem.
//
// Pure, deterministic, UTC-based, never throws. Reuses parseCron/cronMatches from ./cron.

import type { CronFields } from './cron';
import { cronMatches } from './cron';

const DOW_SYSTEMD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Classic crontab shorthands, expanded to the 5-field form parseCron understands. */
const SHORTHAND: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

export type Shorthand =
  | { kind: 'expanded'; expression: string; from: string }
  | { kind: 'reboot' }
  | { kind: 'none' };

/**
 * Resolve a crontab shorthand before parsing.
 *
 * `@reboot` is called out separately because it has no OnCalendar form at all: the systemd
 * equivalent is `OnBootSec=`, a different directive. Silently failing to parse it would send someone
 * looking for a syntax error that is not there.
 */
export function resolveShorthand(expression: string): Shorthand {
  const key = expression.trim().toLowerCase();
  if (key === '@reboot') return { kind: 'reboot' };
  const expanded = SHORTHAND[key];
  return expanded ? { kind: 'expanded', expression: expanded, from: key } : { kind: 'none' };
}

/* ------------------------------------------------------------------------------- OnCalendar */

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Is a set a simple step from `min` spanning the whole range? Mirrors the shape cron writes as a/b. */
function stepOf(values: number[], min: number, max: number): number | null {
  if (values.length < 2 || values[0] !== min) return null;
  const step = values[1] - values[0];
  for (let i = 0; i < values.length; i++) if (values[i] !== min + i * step) return null;
  return min + values.length * step > max ? step : null;
}

/**
 * Render one numeric field as systemd writes it: `*` for the whole range, `start/step` for an
 * arithmetic run, otherwise an explicit list. systemd accepts all three, and preferring the step
 * form keeps a cron step expression recognisable to the person checking the translation.
 */
function fmtSet(values: number[], min: number, max: number): string {
  if (values.length === max - min + 1) return '*';
  const step = stepOf(values, min, max);
  if (step !== null) return `${pad2(values[0])}/${step}`;
  return values.map(pad2).join(',');
}

/** Weekdays as systemd writes them: a contiguous run becomes Mon..Fri, otherwise a list. */
function fmtDow(values: number[]): string {
  if (values.length === 0 || values.length === 7) return '';
  // systemd orders the week from Monday; cron numbers it from Sunday.
  const ordered = [...values].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
  const contiguous = ordered.every((v, i) => i === 0 || ((v + 6) % 7) === ((ordered[i - 1] + 6) % 7) + 1);
  if (contiguous && ordered.length > 2) return `${DOW_SYSTEMD[ordered[0]]}..${DOW_SYSTEMD[ordered[ordered.length - 1]]}`;
  return ordered.map((v) => DOW_SYSTEMD[v]).join(',');
}

export interface OnCalendar {
  /** The value for `OnCalendar=`. */
  expression: string;
  /** Things true of this translation that the expression itself cannot say. */
  caveats: string[];
}

export function toOnCalendar(f: CronFields): OnCalendar {
  const dow = fmtDow(f.dow);
  const month = fmtSet(f.month, 1, 12);
  const dom = fmtSet(f.dom, 1, 31);
  const hour = fmtSet(f.hour, 0, 23);
  const minute = fmtSet(f.minute, 0, 59);

  const date = `*-${month}-${dom}`;
  const time = `${hour}:${minute}:00`;
  const expression = `${dow ? `${dow} ` : ''}${date} ${time}`;

  const caveats: string[] = [];
  if (!f.domStar && !f.dowStar) {
    caveats.push(
      'This crontab line restricts both the day of the month and the day of the week. cron runs when either matches; systemd runs only when both match, so the timer will fire on fewer days.',
    );
  }
  caveats.push(
    'OnCalendar is evaluated in the system timezone of the machine running the timer, not in the timezone of the crontab that set TZ.',
  );

  return { expression, caveats };
}

/** A ready-to-save unit file, so the translation is something to use rather than something to retype. */
export function timerUnit(onCalendar: string, name: string): string {
  const safe = name.trim() || 'my-job';
  return [
    '[Unit]',
    `Description=${safe}`,
    '',
    '[Timer]',
    `OnCalendar=${onCalendar}`,
    'Persistent=true',
    '',
    '[Install]',
    'WantedBy=timers.target',
  ].join('\n');
}

/* ------------------------------------------------------------------- the two day semantics */

/**
 * systemd's day rule: the date spec and the weekday spec are independent constraints, and an
 * instant matches only when it satisfies both. This is the single line that differs from
 * `cronMatches`, and it is the entire reason this tool exists.
 */
export function systemdMatches(f: CronFields, d: Date): boolean {
  if (!f.minute.includes(d.getUTCMinutes())) return false;
  if (!f.hour.includes(d.getUTCHours())) return false;
  if (!f.month.includes(d.getUTCMonth() + 1)) return false;
  return f.dom.includes(d.getUTCDate()) && f.dow.includes(d.getUTCDay());
}

export function systemdNextRuns(f: CronFields, from: Date, count: number): Date[] {
  const out: Date[] = [];
  const cur = new Date(from.getTime());
  cur.setUTCSeconds(0, 0);
  cur.setUTCMinutes(cur.getUTCMinutes() + 1);

  const maxIterations = 4 * 366 * 24 * 60;
  for (let i = 0; i < maxIterations && out.length < count; i++) {
    if (systemdMatches(f, cur)) out.push(new Date(cur.getTime()));
    cur.setUTCMinutes(cur.getUTCMinutes() + 1);
  }
  return out;
}

export interface Divergence {
  /** True when the two schedules fire on different days within the horizon. */
  diverges: boolean;
  /** The first instant cron fires and the systemd timer does not. */
  cronOnly?: Date;
  /** Days checked before giving up, so "they agree" can state its own scope. */
  horizonDays: number;
}

const HORIZON_DAYS = 400;

/**
 * The first moment the two interpretations disagree, or nothing within a year and a bit.
 *
 * Only the day fields can diverge, so this walks days rather than minutes: a day where cron matches
 * and systemd does not is a divergence, and the offending instant is that day at the schedule's
 * first time of day. The systemd rule is a strict subset of the cron rule, so a disagreement can
 * only ever be cron firing where systemd does not.
 */
export function firstDivergence(f: CronFields, from: Date): Divergence {
  // The rules coincide unless both day fields are restricted.
  if (f.domStar || f.dowStar) return { diverges: false, horizonDays: HORIZON_DAYS };

  const day = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  for (let i = 0; i < HORIZON_DAYS; i++) {
    if (f.month.includes(day.getUTCMonth() + 1)) {
      const domHit = f.dom.includes(day.getUTCDate());
      const dowHit = f.dow.includes(day.getUTCDay());
      if (domHit !== dowHit) {
        const at = new Date(day.getTime());
        at.setUTCHours(f.hour[0], f.minute[0], 0, 0);
        if (at.getTime() > from.getTime()) return { diverges: true, cronOnly: at, horizonDays: HORIZON_DAYS };
      }
    }
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return { diverges: false, horizonDays: HORIZON_DAYS };
}

/** Do the two rules agree on this instant? Exposed for tests and for the widget's own check. */
export function agreesAt(f: CronFields, d: Date): boolean {
  return cronMatches(f, d) === systemdMatches(f, d);
}
