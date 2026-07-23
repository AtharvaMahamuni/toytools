// Tests for the tracker SVG builders. They assert structure (element counts, goal line, average
// overlay, clamping, label escaping) rather than exact coordinates, so layout tweaks do not break
// the suite while the contract stays covered.

import { describe, expect, it } from 'vitest';
import { barsSvg, lineSvg, progressRingSvg, type VizPoint } from './viz';

const days: VizPoint[] = [
  { label: 'Mon', value: 6 },
  { label: 'Tue', value: 8 },
  { label: 'Wed', value: 4 },
];

function count(s: string, tag: string): number {
  return (s.match(new RegExp(`<${tag}[\\s>]`, 'g')) ?? []).length;
}

describe('barsSvg', () => {
  it('renders one bar per point', () => {
    const svg = barsSvg(days);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(count(svg, 'rect')).toBe(3);
  });

  it('draws a goal line and marks bars that meet the goal', () => {
    const svg = barsSvg(days, { goal: 8 });
    expect(svg).toContain('viz-goal');
    expect(svg).toContain('viz-bar--met'); // Tue (8) meets goal 8
  });

  it('handles an empty series without throwing', () => {
    expect(barsSvg([])).toContain('<svg');
    expect(count(barsSvg([]), 'rect')).toBe(0);
  });
});

describe('lineSvg', () => {
  it('renders a polyline with one dot per point', () => {
    const svg = lineSvg([
      { label: 'a', value: 70 },
      { label: 'b', value: 69.5 },
      { label: 'c', value: 69.2 },
    ]);
    expect(count(svg, 'polyline')).toBe(1);
    expect(count(svg, 'circle')).toBe(3);
  });

  it('adds an average overlay only when the series lengths match', () => {
    const pts = [
      { label: 'a', value: 70 },
      { label: 'b', value: 69 },
    ];
    expect(lineSvg(pts, { avg: [70, 69.5] })).toContain('viz-avg');
    expect(lineSvg(pts, { avg: [70] })).not.toContain('viz-avg');
  });

  it('draws a goal reference line when a goal is given', () => {
    expect(lineSvg([{ label: 'a', value: 70 }], { goal: 68 })).toContain('viz-goal');
  });

  it('escapes label text so it cannot inject markup', () => {
    const svg = lineSvg([{ label: '<script>', value: 1 }]);
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
  });
});

describe('progressRingSvg', () => {
  it('shows the clamped percentage of goal', () => {
    expect(progressRingSvg(4, 8)).toContain('>50%<');
    expect(progressRingSvg(12, 8)).toContain('>100%<'); // clamped, never over 100
    expect(progressRingSvg(0, 8)).toContain('>0%<');
  });

  it('treats a zero or missing goal as 0% instead of dividing by zero', () => {
    expect(progressRingSvg(5, 0)).toContain('>0%<');
  });
});
