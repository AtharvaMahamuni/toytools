// Tracker visualization — pure functions that turn a small series into an inline SVG string. No DOM,
// no dependencies, deterministic output, so they are unit-testable and reused by every tracker. The
// widget injects the returned markup; colour/theme comes from CSS classes (theme-aware), never from
// hard-coded fills, so the same SVG reads correctly in light and dark mode.

export interface VizPoint {
  label: string;
  value: number;
}

/** A fixed drawing surface; the SVG scales to its container via width="100%". */
const W = 320;
const H = 160;
const PAD = { top: 12, right: 10, bottom: 22, left: 10 };

/** Escape the few characters that matter inside SVG text, so a label can never inject markup. */
function esc(s: string): string {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

/** Round to 2 dp and drop a trailing ".00" so path strings stay compact and deterministic. */
function n(v: number): string {
  const r = Math.round(v * 100) / 100;
  return String(r);
}

function svgOpen(): string {
  return `<svg class="viz" viewBox="0 0 ${W} ${H}" width="100%" role="img" preserveAspectRatio="none">`;
}

/**
 * A bar chart for a fixed-width day series (missing days already filled as 0 upstream). An optional
 * goal draws a dashed reference line. The tallest of the values or the goal sets the scale.
 */
export function barsSvg(points: VizPoint[], opts: { goal?: number } = {}): string {
  if (points.length === 0) return `${svgOpen()}</svg>`;
  const goal = opts.goal && opts.goal > 0 ? opts.goal : 0;
  const max = Math.max(goal, ...points.map((p) => p.value), 1);
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / points.length;
  const barW = Math.max(2, slot * 0.6);

  const bars = points
    .map((p, i) => {
      const h = (p.value / max) * plotH;
      const x = PAD.left + i * slot + (slot - barW) / 2;
      const y = PAD.top + (plotH - h);
      const cls = goal && p.value >= goal ? 'viz-bar viz-bar--met' : 'viz-bar';
      return `<rect class="${cls}" x="${n(x)}" y="${n(y)}" width="${n(barW)}" height="${n(h)}" rx="2"><title>${esc(p.label)}: ${n(p.value)}</title></rect>`;
    })
    .join('');

  const labels = points
    .map((p, i) => {
      const x = PAD.left + i * slot + slot / 2;
      return `<text class="viz-axis" x="${n(x)}" y="${H - 6}" text-anchor="middle">${esc(p.label)}</text>`;
    })
    .join('');

  let goalLine = '';
  if (goal) {
    const y = PAD.top + (plotH - (goal / max) * plotH);
    goalLine = `<line class="viz-goal" x1="${PAD.left}" y1="${n(y)}" x2="${W - PAD.right}" y2="${n(y)}" stroke-dasharray="4 3" />`;
  }

  return `${svgOpen()}${goalLine}${bars}${labels}</svg>`;
}

/**
 * A line chart over actual entries (no zero-fill, so gaps do not crater the line). An optional
 * `avg` series (same length) draws a smoothed overlay, and an optional `goal` draws a reference line.
 * The y-axis fits the data (plus any goal) with a small pad so the line never touches the edges.
 */
export function lineSvg(points: VizPoint[], opts: { avg?: number[]; goal?: number } = {}): string {
  if (points.length === 0) return `${svgOpen()}</svg>`;
  const values = points.map((p) => p.value);
  const withGoal = opts.goal !== undefined ? [...values, opts.goal] : values;
  let lo = Math.min(...withGoal);
  let hi = Math.max(...withGoal);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const pad = (hi - lo) * 0.08;
  lo -= pad;
  hi += pad;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const xAt = (i: number) => PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const yAt = (v: number) => PAD.top + (plotH - ((v - lo) / (hi - lo)) * plotH);

  const line = points.map((p, i) => `${n(xAt(i))},${n(yAt(p.value))}`).join(' ');
  const dots = points
    .map((p, i) => `<circle class="viz-dot" cx="${n(xAt(i))}" cy="${n(yAt(p.value))}" r="2.5"><title>${esc(p.label)}: ${n(p.value)}</title></circle>`)
    .join('');

  let avgLine = '';
  if (opts.avg && opts.avg.length === points.length) {
    const a = opts.avg.map((v, i) => `${n(xAt(i))},${n(yAt(v))}`).join(' ');
    avgLine = `<polyline class="viz-avg" points="${a}" fill="none" />`;
  }

  let goalLine = '';
  if (opts.goal !== undefined) {
    const y = yAt(opts.goal);
    goalLine = `<line class="viz-goal" x1="${PAD.left}" y1="${n(y)}" x2="${W - PAD.right}" y2="${n(y)}" stroke-dasharray="4 3" />`;
  }

  return `${svgOpen()}${goalLine}<polyline class="viz-line" points="${line}" fill="none" />${avgLine}${dots}</svg>`;
}

/**
 * A circular progress ring for today's value against a goal (0..1, clamped). Returns the ring plus a
 * centred percentage. A pure geometry helper: the widget overlays its own value text if it prefers.
 */
export function progressRingSvg(value: number, goal: number): string {
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const frac = goal > 0 ? Math.max(0, Math.min(1, value / goal)) : 0;
  const dash = frac * circumference;
  const pct = Math.round(frac * 100);
  return (
    `<svg class="viz-ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img">` +
    `<circle class="viz-ring-track" cx="${cx}" cy="${cy}" r="${n(r)}" fill="none" stroke-width="${stroke}" />` +
    `<circle class="viz-ring-fill" cx="${cx}" cy="${cy}" r="${n(r)}" fill="none" stroke-width="${stroke}" ` +
    `stroke-dasharray="${n(dash)} ${n(circumference)}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})" />` +
    `<text class="viz-ring-text" x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central">${pct}%</text>` +
    `</svg>`
  );
}
