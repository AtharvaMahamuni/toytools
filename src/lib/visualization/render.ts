// VizSpec renderer — turns an engine-emitted VizSpec into an inline SVG string. Pure, DOM-free,
// dependency-free and deterministic, exactly like src/lib/engines/tracker/viz.ts (whose conventions
// this file follows): a fixed viewBox scaled by width="100%", every colour carried by a CSS class so
// light and dark themes work by construction, and every label escaped so engine text can never
// inject markup.
//
// The engine layer never calls these functions directly. An engine returns a VizSpec on its
// InteractiveResult; the experience renderer picks it up and injects the markup.

import type { VizSpec, VizPart, VizBand, VizBox } from './types';

/** Drawing surface width shared by every kind; heights vary per kind. */
const W = 320;

/** Escape the characters that matter inside SVG text, so a label can never inject markup. */
function esc(s: string): string {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string),
  );
}

/** Round to 2 dp and drop a trailing ".00" so path strings stay compact and deterministic. */
function n(v: number): string {
  if (!Number.isFinite(v)) return '0';
  const r = Math.round(v * 100) / 100;
  return String(r);
}

/** Is every value a usable, finite number? Guards every kind against degenerate engine data. */
function finite(...vals: number[]): boolean {
  return vals.every((v) => typeof v === 'number' && Number.isFinite(v));
}

function svg(height: number, label: string, body: string): string {
  return (
    `<svg class="viz" viewBox="0 0 ${W} ${height}" width="100%" role="img" ` +
    `aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">${body}</svg>`
  );
}

/** An empty but valid SVG, so a degenerate spec renders nothing rather than breaking the panel. */
function emptySvg(): string {
  return `<svg class="viz" viewBox="0 0 ${W} 1" width="100%" role="presentation"></svg>`;
}

// ── band ────────────────────────────────────────────────────────────────────────────────────────
// A marker on a segmented scale. The answer is a POSITION (which band, how close to the next
// boundary), which a category label alone cannot convey.

const BAND_H = 96;
const BAND_PAD = 10;
const BAND_TOP = 20;
const BAND_HEIGHT = 24;
/** A segment narrower than this cannot hold its label legibly, so the label is dropped. */
const BAND_LABEL_MIN_W = 38;

export function bandSvg(
  value: number,
  bands: VizBand[],
  opts: { highlight?: { from: number; to: number; label?: string }; valueLabel?: string; title?: string } = {},
): string {
  const usable = bands.filter((b) => finite(b.from, b.to) && b.to > b.from);
  if (usable.length === 0 || !finite(value)) return emptySvg();

  const lo = usable[0].from;
  const hi = usable[usable.length - 1].to;
  if (hi <= lo) return emptySvg();

  const plotW = W - BAND_PAD * 2;
  const x = (v: number) => BAND_PAD + ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * plotW;

  const segments = usable
    .map((b) => {
      const x0 = x(b.from);
      const w = x(b.to) - x0;
      return (
        `<rect class="viz-band viz-band--${b.tone ?? 'neutral'}" x="${n(x0)}" y="${BAND_TOP}" ` +
        `width="${n(w)}" height="${BAND_HEIGHT}" ><title>${esc(b.label)}: ${n(b.from)} to ${n(b.to)}</title></rect>`
      );
    })
    .join('');

  const segmentLabels = usable
    .map((b) => {
      const w = x(b.to) - x(b.from);
      if (w < BAND_LABEL_MIN_W) return '';
      const cx = x(b.from) + w / 2;
      return `<text class="viz-band-label" x="${n(cx)}" y="${BAND_TOP + 16}" text-anchor="middle">${esc(b.label)}</text>`;
    })
    .join('');

  // Boundary ticks: every band edge, de-duplicated (contiguous bands share edges).
  const edges: number[] = [];
  for (const b of usable) {
    if (!edges.includes(b.from)) edges.push(b.from);
    if (!edges.includes(b.to)) edges.push(b.to);
  }
  const ticks = edges
    .map((e) => {
      const anchor = e === lo ? 'start' : e === hi ? 'end' : 'middle';
      return `<text class="viz-axis" x="${n(x(e))}" y="${BAND_TOP + BAND_HEIGHT + 12}" text-anchor="${anchor}">${n(e)}</text>`;
    })
    .join('');

  // Marker: a down-pointing triangle above the bar plus a full-height rule through it.
  const mx = x(value);
  const marker =
    `<polygon class="viz-marker" points="${n(mx - 5)},${BAND_TOP - 8} ${n(mx + 5)},${BAND_TOP - 8} ${n(mx)},${BAND_TOP - 1}" />` +
    `<line class="viz-marker-rule" x1="${n(mx)}" y1="${BAND_TOP}" x2="${n(mx)}" y2="${BAND_TOP + BAND_HEIGHT}" />`;

  const caption = opts.valueLabel
    ? `<text class="viz-marker-label" x="${n(mx)}" y="${BAND_TOP - 12}" text-anchor="middle">${esc(opts.valueLabel)}</text>`
    : '';

  let highlight = '';
  if (opts.highlight && finite(opts.highlight.from, opts.highlight.to)) {
    const hx0 = x(opts.highlight.from);
    const hx1 = x(opts.highlight.to);
    const hy = BAND_TOP + BAND_HEIGHT + 24;
    highlight =
      `<line class="viz-highlight" x1="${n(hx0)}" y1="${hy}" x2="${n(hx1)}" y2="${hy}" />` +
      `<line class="viz-highlight" x1="${n(hx0)}" y1="${hy - 3}" x2="${n(hx0)}" y2="${hy + 3}" />` +
      `<line class="viz-highlight" x1="${n(hx1)}" y1="${hy - 3}" x2="${n(hx1)}" y2="${hy + 3}" />`;
    if (opts.highlight.label) {
      highlight += `<text class="viz-highlight-label" x="${n((hx0 + hx1) / 2)}" y="${hy + 14}" text-anchor="middle">${esc(opts.highlight.label)}</text>`;
    }
  }

  const label = opts.title ?? 'Where your value falls on the scale';
  return svg(BAND_H, label, segments + segmentLabels + caption + marker + ticks + highlight);
}

// ── stacked / distribution ──────────────────────────────────────────────────────────────────────
// One horizontal part-to-whole bar plus a legend. Serves macro splits and energy breakdowns.

const STACK_H = 84;
const STACK_PAD = 10;
const STACK_TOP = 8;
const STACK_HEIGHT = 26;

export function stackedSvg(parts: VizPart[], opts: { title?: string } = {}): string {
  const usable = parts.filter((p) => finite(p.value) && p.value > 0);
  const total = usable.reduce((sum, p) => sum + p.value, 0);
  if (usable.length === 0 || total <= 0) return emptySvg();

  const plotW = W - STACK_PAD * 2;
  let cursor = STACK_PAD;
  const segments = usable
    .map((p, i) => {
      const w = (p.value / total) * plotW;
      const rect =
        `<rect class="viz-part viz-part--${i % 4}" x="${n(cursor)}" y="${STACK_TOP}" ` +
        `width="${n(w)}" height="${STACK_HEIGHT}"><title>${esc(p.label)}: ${esc(p.display ?? n(p.value))}</title></rect>`;
      cursor += w;
      return rect;
    })
    .join('');

  // Legend: swatch + label + value, wrapped across rows of two so long labels stay readable.
  const perRow = 2;
  const colW = plotW / perRow;
  const legend = usable
    .map((p, i) => {
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      const lx = STACK_PAD + col * colW;
      const ly = STACK_TOP + STACK_HEIGHT + 16 + row * 16;
      const pct = Math.round((p.value / total) * 100);
      const text = `${p.label} ${p.display ?? `${pct}%`}`;
      return (
        `<rect class="viz-part viz-part--${i % 4}" x="${n(lx)}" y="${n(ly - 7)}" width="8" height="8" />` +
        `<text class="viz-legend" x="${n(lx + 12)}" y="${n(ly)}">${esc(text)}</text>`
      );
    })
    .join('');

  const rows = Math.ceil(usable.length / perRow);
  const height = Math.max(STACK_H, STACK_TOP + STACK_HEIGHT + 16 + rows * 16 + 6);
  return svg(height, opts.title ?? 'Breakdown by share', segments + legend);
}

// ── bars ────────────────────────────────────────────────────────────────────────────────────────
// Horizontal labelled bars, longest at the top. Serves heart-rate zone ladders and any ranked set.

const BARS_PAD = 10;
const BARS_ROW_H = 22;
const BARS_LABEL_W = 84;

export function barsSvg(parts: VizPart[], opts: { title?: string } = {}): string {
  const usable = parts.filter((p) => finite(p.value));
  if (usable.length === 0) return emptySvg();
  const max = Math.max(...usable.map((p) => p.value));
  if (!(max > 0)) return emptySvg();

  const trackX = BARS_PAD + BARS_LABEL_W;
  const trackW = W - trackX - BARS_PAD - 4;

  const rows = usable
    .map((p, i) => {
      const y = BARS_PAD + i * BARS_ROW_H;
      const w = Math.max(1, (p.value / max) * trackW);
      return (
        `<text class="viz-row-label" x="${BARS_PAD}" y="${n(y + 12)}">${esc(p.label)}</text>` +
        `<rect class="viz-bar viz-bar--ranked" x="${n(trackX)}" y="${n(y + 3)}" width="${n(w)}" height="12" rx="2">` +
        `<title>${esc(p.label)}: ${esc(p.display ?? n(p.value))}</title></rect>` +
        `<text class="viz-row-value" x="${n(trackX + w + 4)}" y="${n(y + 12)}">${esc(p.display ?? n(p.value))}</text>`
      );
    })
    .join('');

  const height = BARS_PAD * 2 + usable.length * BARS_ROW_H;
  return svg(height, opts.title ?? 'Values by size', rows);
}

// ── sparkline ───────────────────────────────────────────────────────────────────────────────────
// A compact trend line with no axes, for a calculator's saved history. Deliberately minimal: the
// numbers are already in the panel, this only shows direction.

const SPARK_H = 44;
const SPARK_PAD = 6;

export function sparklineSvg(values: number[], opts: { title?: string } = {}): string {
  const usable = values.filter((v) => finite(v));
  if (usable.length < 2) return emptySvg();

  let lo = Math.min(...usable);
  let hi = Math.max(...usable);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const plotW = W - SPARK_PAD * 2;
  const plotH = SPARK_H - SPARK_PAD * 2;
  const x = (i: number) => SPARK_PAD + (i / (usable.length - 1)) * plotW;
  const y = (v: number) => SPARK_PAD + (1 - (v - lo) / (hi - lo)) * plotH;

  const d = usable.map((v, i) => `${i === 0 ? 'M' : 'L'}${n(x(i))} ${n(y(v))}`).join(' ');
  const last = usable[usable.length - 1];
  const dot = `<circle class="viz-spark-dot" cx="${n(x(usable.length - 1))}" cy="${n(y(last))}" r="3" />`;

  return svg(SPARK_H, opts.title ?? 'Trend over your saved history', `<path class="viz-spark" d="${d}" fill="none" />${dot}`);
}


// ── histogram (+ optional box plot) ─────────────────────────────────────────────────────────────
// Vertical frequency bars for equal-width bins, with a five-number box plot under them on the same
// numeric scale. Serves descriptive statistics where the shape of the paste matters as much as the
// summary numbers.

const HIST_PAD = 10;
const HIST_TOP = 8;
const HIST_PLOT_H = 88;
const HIST_AXIS_H = 14;
const HIST_BOX_GAP = 10;
const HIST_BOX_H = 36;
const HIST_LABEL_H = 12;

export function histogramSvg(
  parts: VizPart[],
  box: VizBox | undefined,
  opts: { title?: string } = {},
): string {
  const usable = parts.filter((p) => typeof p.value === 'number' && Number.isFinite(p.value) && p.value >= 0);
  if (usable.length === 0) return emptySvg();
  const maxCount = Math.max(...usable.map((p) => p.value));
  if (!(maxCount > 0)) return emptySvg();

  const plotW = W - HIST_PAD * 2;
  const barGap = usable.length > 8 ? 1 : 2;
  const barW = Math.max(2, (plotW - barGap * (usable.length - 1)) / usable.length);

  const bars = usable
    .map((p, i) => {
      const h = Math.max(1, (p.value / maxCount) * HIST_PLOT_H);
      const x = HIST_PAD + i * (barW + barGap);
      const y = HIST_TOP + HIST_PLOT_H - h;
      return (
        `<rect class="viz-hist-bar" x="${n(x)}" y="${n(y)}" width="${n(barW)}" height="${n(h)}" rx="1">` +
        `<title>${esc(p.label)}: ${esc(p.display ?? String(p.value))}</title></rect>`
      );
    })
    .join('');

  // Sparse x labels: first, middle, last bin so the axis stays readable on a phone.
  const labelIdx = new Set([0, Math.floor((usable.length - 1) / 2), usable.length - 1]);
  const labels = usable
    .map((p, i) => {
      if (!labelIdx.has(i)) return '';
      const x = HIST_PAD + i * (barW + barGap) + barW / 2;
      const y = HIST_TOP + HIST_PLOT_H + HIST_AXIS_H;
      const anchor = i === 0 ? 'start' : i === usable.length - 1 ? 'end' : 'middle';
      return `<text class="viz-axis" x="${n(x)}" y="${n(y)}" text-anchor="${anchor}">${esc(p.label)}</text>`;
    })
    .join('');

  let boxMark = '';
  let height = HIST_TOP + HIST_PLOT_H + HIST_AXIS_H + 4;
  if (box && finite(box.min, box.q1, box.median, box.q3, box.max) && box.max >= box.min) {
    const y0 = HIST_TOP + HIST_PLOT_H + HIST_AXIS_H + HIST_BOX_GAP;
    const cy = y0 + HIST_BOX_H / 2;
    const lo = box.min;
    const hi = box.max === box.min ? box.min + 1 : box.max;
    const xAt = (v: number) => HIST_PAD + ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * plotW;
    const xMin = xAt(box.min);
    const xQ1 = xAt(box.q1);
    const xMed = xAt(box.median);
    const xQ3 = xAt(box.q3);
    const xMax = xAt(box.max);
    const boxW = Math.max(1, xQ3 - xQ1);
    boxMark =
      `<line class="viz-box-whisker" x1="${n(xMin)}" y1="${n(cy)}" x2="${n(xQ1)}" y2="${n(cy)}" />` +
      `<line class="viz-box-whisker" x1="${n(xQ3)}" y1="${n(cy)}" x2="${n(xMax)}" y2="${n(cy)}" />` +
      `<line class="viz-box-cap" x1="${n(xMin)}" y1="${n(cy - 6)}" x2="${n(xMin)}" y2="${n(cy + 6)}" />` +
      `<line class="viz-box-cap" x1="${n(xMax)}" y1="${n(cy - 6)}" x2="${n(xMax)}" y2="${n(cy + 6)}" />` +
      `<rect class="viz-box-body" x="${n(xQ1)}" y="${n(cy - 10)}" width="${n(boxW)}" height="20" rx="2">` +
      `<title>Q1 ${n(box.q1)} · median ${n(box.median)} · Q3 ${n(box.q3)}</title></rect>` +
      `<line class="viz-box-median" x1="${n(xMed)}" y1="${n(cy - 10)}" x2="${n(xMed)}" y2="${n(cy + 10)}" />`;
    if (box.outliers && box.outliers.length > 0) {
      boxMark += box.outliers
        .filter((v) => finite(v))
        .map((v) => `<circle class="viz-box-outlier" cx="${n(xAt(v))}" cy="${n(cy)}" r="2.5"><title>${n(v)}</title></circle>`)
        .join('');
    }
    height = y0 + HIST_BOX_H + HIST_LABEL_H;
  }

  return svg(height, opts.title ?? 'Histogram and box plot', bars + labels + boxMark);
}

// ── dispatch ────────────────────────────────────────────────────────────────────────────────────

/**
 * Render any VizSpec to an SVG string. An unsupported kind or degenerate data yields an empty SVG,
 * never a throw, so a bad spec can never break a result panel.
 */
export function renderViz(spec: VizSpec | undefined): string {
  if (!spec || !spec.data) return emptySvg();
  const { kind, data, title } = spec;

  switch (kind) {
    case 'band':
      return bandSvg(data.value ?? NaN, data.bands ?? [], {
        highlight: data.highlight,
        valueLabel: data.valueLabel,
        title,
      });
    case 'stacked':
    case 'distribution':
      return stackedSvg(data.parts ?? [], { title });
    case 'bars':
      return barsSvg(data.parts ?? [], { title });
    case 'histogram':
      return histogramSvg(data.parts ?? [], data.box, { title });
    case 'line':
    case 'area':
      return sparklineSvg((data.series?.[0]?.points ?? []).map((p) => p.y), { title });
    default:
      return emptySvg();
  }
}
