import { describe, it, expect } from 'vitest';
import { parseCron } from './cron';
import {
  agreesAt,
  firstDivergence,
  resolveShorthand,
  systemdMatches,
  systemdNextRuns,
  timerUnit,
  toOnCalendar,
} from './systemd';

/** Parse or fail loudly: every expression in this suite is meant to be valid. */
function fields(expression: string) {
  const p = parseCron(expression);
  if (!p.ok) throw new Error(`fixture does not parse: ${expression} (${p.error})`);
  return p.fields;
}

const on = (expression: string) => toOnCalendar(fields(expression)).expression;

describe('resolveShorthand', () => {
  it('expands the classic shorthands', () => {
    expect(resolveShorthand('@daily')).toEqual({ kind: 'expanded', expression: '0 0 * * *', from: '@daily' });
    expect(resolveShorthand('@weekly')).toEqual({ kind: 'expanded', expression: '0 0 * * 0', from: '@weekly' });
  });

  it('is case and whitespace insensitive', () => {
    expect(resolveShorthand('  @HOURLY ').kind).toBe('expanded');
  });

  it('calls out @reboot as a different directive rather than a parse failure', () => {
    expect(resolveShorthand('@reboot')).toEqual({ kind: 'reboot' });
  });

  it('leaves an ordinary expression alone', () => {
    expect(resolveShorthand('*/5 * * * *').kind).toBe('none');
  });
});

describe('toOnCalendar', () => {
  it('translates a daily time', () => {
    expect(on('30 4 * * *')).toBe('*-*-* 04:30:00');
  });

  it('uses the step form where cron used one', () => {
    expect(on('*/15 * * * *')).toBe('*-*-* *:00/15:00');
  });

  it('writes a contiguous weekday run as a range', () => {
    expect(on('0 9 * * 1-5')).toBe('Mon..Fri *-*-* 09:00:00');
  });

  it('writes scattered weekdays as a list, ordered from Monday', () => {
    expect(on('0 9 * * 0,3')).toBe('Wed,Sun *-*-* 09:00:00');
  });

  it('accepts Sunday written as 7', () => {
    expect(on('0 9 * * 7')).toBe('Sun *-*-* 09:00:00');
  });

  it('pins a day of the month', () => {
    expect(on('0 3 1 * *')).toBe('*-*-01 03:00:00');
  });

  it('pins a month', () => {
    expect(on('0 0 1 1 *')).toBe('*-01-01 00:00:00');
  });

  it('lists explicit minutes that are not a clean step', () => {
    expect(on('5,20,50 * * * *')).toBe('*-*-* *:05,20,50:00');
  });

  it('always warns about the timezone, because the expression cannot say it', () => {
    expect(toOnCalendar(fields('0 0 * * *')).caveats.join(' ')).toMatch(/timezone/i);
  });

  it('warns when both day fields are restricted, and only then', () => {
    const both = toOnCalendar(fields('0 0 13 * 5')).caveats.join(' ');
    const one = toOnCalendar(fields('0 0 13 * *')).caveats.join(' ');
    expect(both).toMatch(/cron runs when either matches/i);
    expect(one).not.toMatch(/cron runs when either matches/i);
  });
});

describe('systemdMatches', () => {
  it('requires BOTH day fields, where cron requires either', () => {
    // Friday 13 June 2025 is a Friday; 20 June 2025 is a Friday that is not the 13th.
    const f = fields('0 0 13 * 5');
    const friday13 = new Date(Date.UTC(2025, 5, 13, 0, 0));
    const friday20 = new Date(Date.UTC(2025, 5, 20, 0, 0));

    expect(systemdMatches(f, friday13)).toBe(true);
    expect(systemdMatches(f, friday20)).toBe(false);
    expect(agreesAt(f, friday13)).toBe(true);
    expect(agreesAt(f, friday20)).toBe(false); // cron fires here, systemd does not
  });

  it('agrees with cron whenever only one day field is restricted', () => {
    const f = fields('0 0 * * 1');
    for (let d = 1; d <= 28; d++) {
      expect(agreesAt(f, new Date(Date.UTC(2025, 5, d, 0, 0))), `June ${d}`).toBe(true);
    }
  });
});

describe('systemdNextRuns', () => {
  it('lists upcoming runs for a simple daily schedule', () => {
    const runs = systemdNextRuns(fields('0 6 * * *'), new Date(Date.UTC(2025, 0, 1, 7, 0)), 2);
    expect(runs.map((d) => d.toISOString())).toEqual(['2025-01-02T06:00:00.000Z', '2025-01-03T06:00:00.000Z']);
  });

  it('skips the days cron would have fired on under the OR rule', () => {
    const runs = systemdNextRuns(fields('0 0 13 * 5'), new Date(Date.UTC(2025, 0, 1)), 1);
    const d = runs[0];
    expect(d.getUTCDate()).toBe(13);
    expect(d.getUTCDay()).toBe(5);
  });
});

describe('firstDivergence', () => {
  it('finds the first day cron fires and the timer does not', () => {
    const d = firstDivergence(fields('0 0 13 * 5'), new Date(Date.UTC(2025, 0, 1)));
    expect(d.diverges).toBe(true);
    // Either a Friday that is not the 13th, or a 13th that is not a Friday.
    const hit = d.cronOnly!;
    expect(hit.getUTCDate() === 13 || hit.getUTCDay() === 5).toBe(true);
    expect(hit.getUTCDate() === 13 && hit.getUTCDay() === 5).toBe(false);
  });

  // The silence half: an alarm that fires on schedules which translate exactly would teach people
  // to ignore it, which costs more than never having shown it.
  it('stays silent when only the weekday is restricted', () => {
    expect(firstDivergence(fields('0 9 * * 1-5'), new Date(Date.UTC(2025, 0, 1))).diverges).toBe(false);
  });

  it('stays silent when only the day of month is restricted', () => {
    expect(firstDivergence(fields('0 3 1 * *'), new Date(Date.UTC(2025, 0, 1))).diverges).toBe(false);
  });

  it('stays silent for a plain daily schedule', () => {
    expect(firstDivergence(fields('0 0 * * *'), new Date(Date.UTC(2025, 0, 1))).diverges).toBe(false);
  });

  it('reports the horizon it checked, so agreement states its own scope', () => {
    expect(firstDivergence(fields('0 0 * * *'), new Date(Date.UTC(2025, 0, 1))).horizonDays).toBeGreaterThan(365);
  });

  it('never claims a divergence the two matchers do not actually have', () => {
    const f = fields('0 0 13 * 5');
    const d = firstDivergence(f, new Date(Date.UTC(2025, 0, 1)));
    expect(agreesAt(f, d.cronOnly!)).toBe(false);
  });
});

describe('timerUnit', () => {
  it('emits a unit file carrying the translated expression', () => {
    const unit = timerUnit('Mon..Fri *-*-* 09:00:00', 'nightly backup');
    expect(unit).toContain('OnCalendar=Mon..Fri *-*-* 09:00:00');
    expect(unit).toContain('Description=nightly backup');
    expect(unit).toContain('WantedBy=timers.target');
  });

  it('falls back to a placeholder name rather than emitting an empty Description', () => {
    expect(timerUnit('*-*-* 00:00:00', '   ')).toContain('Description=my-job');
  });
});
