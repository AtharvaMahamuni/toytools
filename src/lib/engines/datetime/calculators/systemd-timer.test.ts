// The calculator, as the widget actually calls it.
//
// systemd.ts proves the translation and the two day rules in isolation. This suite covers the layer
// above: the error paths a person reaches by typing, and the `meta` the tool's craft affordance
// reads to decide whether to say anything at all. That decision is the one thing a wrong result here
// would make invisible.

import { describe, it, expect } from 'vitest';
import { systemdTimerConverter as tool } from './systemd-timer';

const run = (expression: string, unit = 'my-job') =>
  tool.calculate({ expression, unit }, {}) as Record<string, any>;

describe('systemd timer converter - input handling', () => {
  it('asks for input rather than erroring on an empty field', () => {
    const r = run('');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/enter a crontab line/i);
  });

  it('reports a malformed expression with the parser message', () => {
    const r = run('nope');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/5 fields/);
  });

  it('answers @reboot with the directive that replaces it, not a syntax error', () => {
    const r = run('@reboot');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/OnBootSec/);
    expect(r.error).not.toMatch(/field/i);
  });

  it('expands a shorthand and says which one it came from', () => {
    const r = run('@daily');
    expect(r.ok).toBe(true);
    expect(r.meta.onCalendar).toBe('*-*-* 00:00:00');
    expect(r.metrics.some((c: any) => String(c.value).includes('@daily'))).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(run('   0 9 * * 1-5   ').meta.onCalendar).toBe('Mon..Fri *-*-* 09:00:00');
  });
});

describe('systemd timer converter - the meta the craft reads', () => {
  it('flags both-day-fields and a divergence together', () => {
    const m = run('0 0 13 * 5').meta;
    expect(m.bothDayFields).toBe(true);
    expect(m.diverges).toBe(true);
    expect(typeof m.divergesAt).toBe('string');
  });

  // The silence half. `bothDayFields` is what keeps the affordance off ordinary schedules, so a
  // regression here would turn a quiet tool into one that warns about every cron line.
  it('clears both-day-fields when only the weekday is restricted', () => {
    const m = run('0 9 * * 1-5').meta;
    expect(m.bothDayFields).toBe(false);
    expect(m.diverges).toBe(false);
    expect(m.divergesAt).toBeNull();
  });

  it('clears both-day-fields when only the day of month is restricted', () => {
    expect(run('0 3 1 * *').meta.bothDayFields).toBe(false);
  });

  it('clears both-day-fields for a plain daily schedule', () => {
    expect(run('0 0 * * *').meta.bothDayFields).toBe(false);
  });

  it('carries the unit file, with the name the user typed', () => {
    const m = run('0 9 * * 1-5', 'morning-report').meta;
    expect(m.unit).toContain('OnCalendar=Mon..Fri *-*-* 09:00:00');
    expect(m.unit).toContain('Description=morning-report');
  });
});

describe('systemd timer converter - what it renders', () => {
  it('leads with the OnCalendar expression', () => {
    const r = run('0 9 * * 1-5');
    expect(r.hero.value).toBe('Mon..Fri *-*-* 09:00:00');
  });

  it('marks the same-days milestone false exactly when the schedules diverge', () => {
    const agreeing = run('0 9 * * 1-5').milestones.find((m: any) => /same days/i.test(m.label));
    const diverging = run('0 0 13 * 5').milestones.find((m: any) => /same days/i.test(m.label));
    expect(agreeing.reached).toBe(true);
    expect(diverging.reached).toBe(false);
  });

  it('always states the timezone assumption, because the expression cannot carry it', () => {
    expect(run('0 0 * * *').assumptions.join(' ')).toMatch(/timezone/i);
  });

  it('puts the unit file in the explanation so it can be copied', () => {
    expect(run('0 0 * * *').explanation).toContain('[Timer]');
  });

  it('never throws for any well-formed expression it is likely to meet', () => {
    for (const e of ['* * * * *', '0 0 1 1 *', '*/5 * * * *', '0 0 * * 0', '30 4 1,15 * 5', '@hourly']) {
      expect(() => run(e), e).not.toThrow();
    }
  });
});
