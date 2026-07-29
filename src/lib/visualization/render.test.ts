import { describe, it, expect } from 'vitest';
import { bandSvg, stackedSvg, barsSvg, sparklineSvg, renderViz } from './render';
import { bandSpec, partsSpec, lineSpec } from './types';
import type { VizBand } from './types';

const BMI_BANDS: VizBand[] = [
  { id: 'under', label: 'Underweight', from: 15, to: 18.5, tone: 'warn' },
  { id: 'normal', label: 'Healthy', from: 18.5, to: 25, tone: 'good' },
  { id: 'over', label: 'Overweight', from: 25, to: 30, tone: 'warn' },
  { id: 'obese', label: 'Obesity', from: 30, to: 40, tone: 'high' },
];

describe('bandSvg', () => {
  it('draws one rect per band plus the marker', () => {
    const out = bandSvg(22.9, BMI_BANDS);
    expect((out.match(/<rect/g) ?? []).length).toBe(4);
    expect(out).toContain('viz-marker');
    expect(out).toContain('viz-band--good');
  });

  it('positions the marker proportionally between the scale ends', () => {
    // Scale 15..40 across a 300px plot inset 10px: 22.9 sits at 10 + (7.9/25)*300 = 104.8.
    const out = bandSvg(22.9, BMI_BANDS);
    expect(out).toContain('x1="104.8"');
  });

  it('clamps a value outside the scale to the nearest edge', () => {
    const low = bandSvg(-999, BMI_BANDS);
    const high = bandSvg(999, BMI_BANDS);
    expect(low).toContain('x1="10"');
    expect(high).toContain('x1="310"');
  });

  it('drops labels for segments too narrow to hold them', () => {
    // 15..18.5 of a 15..40 scale is 42px wide, above the 38px floor; a 1-unit band is 12px.
    const narrow = bandSvg(20, [
      { id: 'a', label: 'Tiny', from: 0, to: 1 },
      { id: 'b', label: 'Huge', from: 1, to: 100 },
    ]);
    expect(narrow).not.toContain('>Tiny<');
    expect(narrow).toContain('>Huge<');
  });

  it('renders the highlight bracket and its label when given one', () => {
    const out = bandSvg(22.9, BMI_BANDS, { highlight: { from: 18.5, to: 25, label: '56.7 to 76.3 kg' } });
    expect(out).toContain('viz-highlight');
    expect(out).toContain('56.7 to 76.3 kg');
  });

  it('escapes label text so engine strings cannot inject markup', () => {
    const out = bandSvg(1, [{ id: 'x', label: '<script>&"', from: 0, to: 10 }]);
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;&amp;&quot;');
  });

  it('degrades to an empty svg on unusable input', () => {
    expect(bandSvg(NaN, BMI_BANDS)).toContain('role="presentation"');
    expect(bandSvg(20, [])).toContain('role="presentation"');
    expect(bandSvg(20, [{ id: 'a', label: 'x', from: 5, to: 5 }])).toContain('role="presentation"');
  });

  it('is deterministic', () => {
    expect(bandSvg(22.9, BMI_BANDS)).toBe(bandSvg(22.9, BMI_BANDS));
  });
});

describe('stackedSvg', () => {
  const MACRO = [
    { id: 'carb', label: 'Carbs', value: 263, display: '263 g' },
    { id: 'protein', label: 'Protein', value: 175, display: '175 g' },
    { id: 'fat', label: 'Fat', value: 65, display: '65 g' },
  ];

  it('draws a segment and a legend swatch per part', () => {
    const out = stackedSvg(MACRO);
    expect((out.match(/<rect/g) ?? []).length).toBe(6);
    expect(out).toContain('263 g');
  });

  it('sizes segments by share of the total', () => {
    const out = stackedSvg([
      { id: 'a', label: 'A', value: 1 },
      { id: 'b', label: 'B', value: 3 },
    ]);
    // 300px plot: a quarter is 75, three quarters is 225.
    expect(out).toContain('width="75"');
    expect(out).toContain('width="225"');
  });

  it('skips zero and negative parts', () => {
    const out = stackedSvg([
      { id: 'a', label: 'A', value: 10 },
      { id: 'b', label: 'B', value: 0 },
      { id: 'c', label: 'C', value: -5 },
    ]);
    expect(out).not.toContain('>B ');
    expect(out).not.toContain('>C ');
  });

  it('grows its height with the legend row count', () => {
    // Two parts fit one legend row and clear the 84px floor; three parts wrap to a second row.
    expect(stackedSvg(MACRO.slice(0, 2))).toContain('viewBox="0 0 320 84"');
    expect(stackedSvg(MACRO)).toContain('viewBox="0 0 320 88"');
  });

  it('degrades to an empty svg when nothing is positive', () => {
    expect(stackedSvg([])).toContain('role="presentation"');
    expect(stackedSvg([{ id: 'a', label: 'A', value: 0 }])).toContain('role="presentation"');
  });
});

describe('barsSvg', () => {
  const ZONES = [
    { id: 'z5', label: 'Z5 Max', value: 185, display: '176-185' },
    { id: 'z4', label: 'Z4 Threshold', value: 176, display: '166-176' },
    { id: 'z1', label: 'Z1 Warm up', value: 130, display: '111-130' },
  ];

  it('draws one labelled row per part', () => {
    const out = barsSvg(ZONES);
    expect((out.match(/<rect/g) ?? []).length).toBe(3);
    expect(out).toContain('Z5 Max');
    expect(out).toContain('176-185');
  });

  it('scales bar width against the largest value', () => {
    const out = barsSvg([
      { id: 'a', label: 'A', value: 100 },
      { id: 'b', label: 'B', value: 50 },
    ]);
    // Track is 320 - (10 + 84) - 10 - 4 = 212 wide.
    expect(out).toContain('width="212"');
    expect(out).toContain('width="106"');
  });

  it('grows its height with the row count', () => {
    expect(barsSvg(ZONES)).toContain('viewBox="0 0 320 86"');
    expect(barsSvg(ZONES.slice(0, 2))).toContain('viewBox="0 0 320 64"');
  });

  it('degrades to an empty svg on unusable input', () => {
    expect(barsSvg([])).toContain('role="presentation"');
    expect(barsSvg([{ id: 'a', label: 'A', value: 0 }])).toContain('role="presentation"');
  });
});

describe('sparklineSvg', () => {
  it('draws a path through every point plus a head dot', () => {
    const out = sparklineSvg([1, 2, 3]);
    expect(out).toContain('viz-spark');
    expect(out).toContain('viz-spark-dot');
    expect((out.match(/[ML]\d/g) ?? []).length).toBe(3);
  });

  it('handles a flat series without dividing by zero', () => {
    const out = sparklineSvg([5, 5, 5]);
    expect(out).toContain('viz-spark');
    expect(out).not.toContain('NaN');
  });

  it('needs at least two points', () => {
    expect(sparklineSvg([1])).toContain('role="presentation"');
    expect(sparklineSvg([])).toContain('role="presentation"');
  });
});

describe('renderViz dispatch', () => {
  it('routes each kind to its renderer', () => {
    expect(renderViz(bandSpec(22.9, BMI_BANDS))).toContain('viz-marker');
    expect(renderViz(partsSpec([{ id: 'a', label: 'A', value: 1 }], { kind: 'distribution' }))).toContain('viz-part');
    expect(renderViz(partsSpec([{ id: 'a', label: 'A', value: 1 }], { kind: 'bars' }))).toContain('viz-bar');
    expect(renderViz(lineSpec('s', [{ x: 0, y: 1 }, { x: 1, y: 2 }]))).toContain('viz-spark');
  });

  it('returns an empty svg for an unsupported kind or a missing spec', () => {
    expect(renderViz(undefined)).toContain('role="presentation"');
    expect(renderViz({ kind: 'milestones', data: {} })).toContain('role="presentation"');
  });

  it('never throws on malformed data', () => {
    expect(() => renderViz({ kind: 'band', data: {} })).not.toThrow();
    expect(() => renderViz({ kind: 'stacked', data: {} })).not.toThrow();
    expect(() => renderViz({ kind: 'bars', data: {} })).not.toThrow();
  });
});
