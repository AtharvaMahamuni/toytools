import { describe, expect, it } from 'vitest';
import { attach } from '@lib/runtime/engines/calculator';
import {
  copyText,
  feetInchesTrap,
  formatHeight,
  gapLine,
  openingLineup,
  parseHeight,
  type Figure,
} from './height';

const you = (cm: number, name = 'You'): Figure => ({ id: 'you', name, cm, kind: 'person' });
const door = (cm = 203.2): Figure => ({ id: 'door', name: 'Door', cm, kind: 'door' });

describe('feetInchesTrap', () => {
  it('fires when a two-digit decimal is a plausible feet-and-inches typo', () => {
    const trap = feetInchesTrap('5.11', 'ft');
    expect(trap).not.toBeNull();
    expect(trap!.label).toBe('5 ft 11 in');
    expect(trap!.text).toBe(
      '5.11 feet is 5 ft 1.3 in (155.8 cm). If you meant 5 ft 11 in, that is 180.3 cm.',
    );
    expect(feetInchesTrap('5.10', 'ft')!.label).toBe('5 ft 10 in');
    expect(feetInchesTrap('6.02', 'ft')!.label).toBe('6 ft 2 in');
  });

  it('stays silent unless that exact mistake is on the page', () => {
    expect(feetInchesTrap("5'11", 'ft')).toBeNull();
    expect(feetInchesTrap('5.5', 'ft')).toBeNull();
    expect(feetInchesTrap('5.12', 'ft')).toBeNull();
    expect(feetInchesTrap('5.00', 'ft')).toBeNull();
    expect(feetInchesTrap('', 'ft')).toBeNull();
    expect(feetInchesTrap('5.11', 'cm')).toBeNull();
    expect(feetInchesTrap('40.05', 'ft')).toBeNull();
    expect(feetInchesTrap('6', 'ft')).toBeNull();
  });
});

describe('parseHeight', () => {
  it('reads an explicit feet-and-inches form in either unit', () => {
    for (const unit of ['cm', 'ft'] as const) {
      expect(parseHeight("5'11", unit)).toEqual({ ok: true, cm: 180.34 });
      expect(parseHeight('5\'11"', unit)).toEqual({ ok: true, cm: 180.34 });
      expect(parseHeight('5 ft 11 in', unit)).toEqual({ ok: true, cm: 180.34 });
      expect(parseHeight('5ft11', unit)).toEqual({ ok: true, cm: 180.34 });
      expect(parseHeight('5 11', unit)).toEqual({ ok: true, cm: 180.34 });
      expect(parseHeight("5'", unit)).toEqual({ ok: true, cm: 152.4 });
      expect(parseHeight('5\u203211\u2033', unit)).toEqual({ ok: true, cm: 180.34 });
    }
  });

  it('follows the toggle for a bare number, and notes a huge feet value', () => {
    expect(parseHeight('180', 'cm')).toEqual({ ok: true, cm: 180 });
    expect(parseHeight('5', 'ft')).toEqual({ ok: true, cm: 152.4 });
    const tall = parseHeight('180', 'ft');
    expect(tall.ok).toBe(true);
    if (tall.ok) {
      expect(tall.cm).toBeCloseTo(5486.4, 5);
      expect(tall.note).toBe('180 feet is 54.9 m. Switch to centimetres if you meant 180 cm.');
    }
    expect(parseHeight('15', 'ft')).toEqual({ ok: true, cm: 457.2 });
  });

  it('rejects empty, comma, negative, letters, too many inches, and out of range', () => {
    expect(parseHeight('', 'cm')).toEqual({ ok: false, error: 'Enter a height.' });
    expect(parseHeight('   ', 'ft')).toEqual({ ok: false, error: 'Enter a height.' });
    expect(parseHeight('1,80', 'cm').ok).toBe(false);
    expect(parseHeight('1,80', 'cm')).toMatchObject({ error: 'Use a dot for the decimal, not a comma.' });
    expect(parseHeight('-5', 'cm')).toMatchObject({ ok: false, error: 'Enter a height above zero.' });
    expect(parseHeight('0', 'cm')).toMatchObject({ ok: false });
    expect(parseHeight('abc', 'ft')).toMatchObject({ ok: false });
    expect(parseHeight("5'12", 'ft')).toMatchObject({ error: 'Inches only go to 11.' });
    expect(parseHeight('5 12', 'cm')).toMatchObject({ error: 'Inches only go to 11.' });
    expect(parseHeight('9', 'cm')).toMatchObject({ error: 'Heights start at 10 cm.' });
    expect(parseHeight('10001', 'cm')).toMatchObject({ error: 'Heights stop at 100 m.' });
    expect(parseHeight('10', 'cm')).toEqual({ ok: true, cm: 10 });
    expect(parseHeight('10000', 'cm')).toEqual({ ok: true, cm: 10000 });
    // 5.12 in feet mode is decimal feet, not twelve inches.
    const decimal = parseHeight('5.12', 'ft');
    expect(decimal.ok).toBe(true);
    if (decimal.ok) expect(decimal.cm).toBeCloseTo(156.0576, 4);
  });
});

describe('formatHeight', () => {
  it('pins the cited marks and the 5 ft 11 in conversion', () => {
    expect(formatHeight(180.34, 'cm')).toBe('180.3 cm');
    expect(formatHeight(180.34, 'ft')).toBe('5 ft 11 in');
    expect(formatHeight(203.2, 'ft')).toBe('6 ft 8 in');
    expect(formatHeight(203.2, 'cm')).toBe('203.2 cm');
    expect(formatHeight(304.8, 'ft')).toBe('10 ft');
    expect(formatHeight(91.44, 'cm')).toBe('91.4 cm');
    expect(formatHeight(91.44, 'ft')).toBe('3 ft');
    expect(formatHeight(175.3, 'ft')).toBe('5 ft 9 in');
    expect(formatHeight(161.3, 'ft')).toBe('5 ft 3.5 in');
    expect(formatHeight(170, 'ft')).toBe('5 ft 6.9 in');
    expect(formatHeight(170, 'cm')).toBe('170 cm');
    expect(formatHeight(22.86, 'ft')).toBe('9 in');
  });
});

describe('gapLine and copyText', () => {
  it('states the opening gap, and uses are for You', () => {
    const lineup = openingLineup();
    expect(gapLine(lineup, 'cm')).toBe('Door is 33.2 cm taller than You.');
    expect(gapLine([you(180.34), door()], 'ft')).toBe('Door is 9 in taller than You.');
    expect(gapLine([you(180), door(170)], 'cm')).toBe('You are 10 cm taller than Door.');
    expect(gapLine([you(170)], 'cm')).toBe('You are 170 cm.');
    expect(gapLine([door()], 'cm')).toBe('Door is 203.2 cm.');
  });

  it('collapses equal heights and names a blank mark', () => {
    expect(gapLine([you(170), door(170)], 'cm')).toBe('You and Door are the same height.');
    expect(gapLine([
      you(180, 'A'),
      you(180, 'B'),
      you(180, 'C'),
    ], 'cm')).toBe('A, B and C are the same height.');
    expect(gapLine([{ id: 'x', name: '  ', cm: 180, kind: 'person' }], 'cm')).toBe('Mark is 180 cm.');
  });

  it('copies both units and the gap in the selected unit', () => {
    expect(copyText(openingLineup(), 'cm')).toBe(
      'You: 170 cm (5 ft 6.9 in)\nDoor: 203.2 cm (6 ft 8 in)\nDoor is 33.2 cm taller than You.',
    );
  });
});

describe('calculator runtime', () => {
  it('attaches heightChart beside pitfall', () => {
    const tt: Record<string, unknown> = {};
    attach(tt);
    const chart = tt.heightChart as { trap: typeof feetInchesTrap };
    expect(typeof chart.trap).toBe('function');
    expect(chart.trap('5.11', 'ft')).not.toBeNull();
    expect(typeof tt.pitfall).toBe('function');
  });
});
