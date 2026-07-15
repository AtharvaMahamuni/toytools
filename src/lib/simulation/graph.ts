// Live canvas line-graph renderer for GraphDef.
//
// Deliberately NOT built on src/lib/visualization (VizSpec): that contract is a static,
// declarative spec with no shipped renderer — right for calculator results, wrong for a
// graph that is a per-frame function of simulation state. If a static snapshot is ever
// needed (share/export), an adapter can emit a VizSpec from the same GraphDef.
//
// Browser-glue module — excluded from unit coverage; exercised by the Playwright suite.

import type { GraphDef, Palette, SimState, Viewport } from './types';

// top leaves room for the horizontal header row (y-axis label + legend) — a rotated y label
// clips on the compact console strip, so it is drawn upright above the plot instead.
const MARGIN = { top: 28, right: 14, bottom: 30, left: 48 };
const DEFAULT_WINDOW = 8;
const SPACE_SAMPLES = 160;
/** Stream-mode history resolution — dense enough for smooth traces at any speed. */
const TRACE_MIN_DT = 1 / 60;

interface TracePoint {
  t: number;
  v: number;
}

export interface GraphRenderer {
  /** stream mode: record the current values against s.t. No-op in snapshot mode. */
  push(s: SimState): void;
  draw(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void;
  /** Drop accumulated history (reset / restart-on-param-change). */
  reset(): void;
}

export function createGraphRenderer(def: GraphDef): GraphRenderer {
  const traces = new Map<string, TracePoint[]>();
  const windowSec = def.window ?? DEFAULT_WINDOW;

  function push(s: SimState): void {
    if (def.mode !== 'stream') return;
    for (const series of def.series) {
      let trace = traces.get(series.id);
      if (!trace) {
        trace = [];
        traces.set(series.id, trace);
      }
      const last = trace[trace.length - 1];
      if (last && s.t - last.t < TRACE_MIN_DT) continue;
      trace.push({ t: s.t, v: series.sample(s, 0) });
      // Evict points older than the visible window (keep one for edge continuity).
      const cutoff = s.t - windowSec;
      let drop = 0;
      while (drop < trace.length - 1 && trace[drop + 1].t < cutoff) drop++;
      if (drop > 0) trace.splice(0, drop);
    }
  }

  function frame(vp: Viewport): { x: number; y: number; w: number; h: number } {
    return {
      x: MARGIN.left,
      y: MARGIN.top,
      w: Math.max(10, vp.width - MARGIN.left - MARGIN.right),
      h: Math.max(10, vp.height - MARGIN.top - MARGIN.bottom),
    };
  }

  function drawChrome(
    ctx: CanvasRenderingContext2D,
    vp: Viewport,
    f: { x: number; y: number; w: number; h: number },
    yMin: number,
    yMax: number,
  ): void {
    const p: Palette = vp.palette;
    ctx.clearRect(0, 0, vp.width, vp.height);
    ctx.fillStyle = p.surface;
    ctx.fillRect(0, 0, vp.width, vp.height);

    ctx.strokeStyle = p.border;
    ctx.lineWidth = 1;
    ctx.font = '11px "Geist Mono Variable", ui-monospace, monospace';
    ctx.fillStyle = p.muted;

    // Horizontal gridlines + y tick labels.
    const ticks = 4;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= ticks; i++) {
      const frac = i / ticks;
      const y = f.y + f.h - frac * f.h;
      ctx.beginPath();
      ctx.moveTo(f.x, y);
      ctx.lineTo(f.x + f.w, y);
      ctx.stroke();
      const value = yMin + frac * (yMax - yMin);
      ctx.fillText(formatTick(value), f.x - 6, y);
    }

    // Axis labels. The y label sits upright in the header row above the plot (a rotated label
    // gets clipped when the strip is short); the legend joins it there for multi-series graphs.
    ctx.font = '12px "Geist Variable", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(def.xLabel, f.x + f.w / 2, vp.height - 8);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(def.yLabel, f.x, 13);
  }

  function draw(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
    const f = frame(vp);
    const [yMin, yMax] = def.yRange(s);
    const ySpan = yMax - yMin || 1;
    const toY = (v: number) => f.y + f.h - ((v - yMin) / ySpan) * f.h;
    drawChrome(ctx, vp, f, yMin, yMax);

    ctx.save();
    ctx.beginPath();
    ctx.rect(f.x, f.y, f.w, f.h);
    ctx.clip();
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    for (const series of def.series) {
      ctx.strokeStyle = vp.palette[series.color];
      ctx.beginPath();
      if (def.mode === 'snapshot') {
        const [xMin, xMax] = def.xRange ? def.xRange(s) : [0, 1];
        const xSpan = xMax - xMin || 1;
        for (let i = 0; i <= SPACE_SAMPLES; i++) {
          const xVal = xMin + (i / SPACE_SAMPLES) * xSpan;
          const px = f.x + (i / SPACE_SAMPLES) * f.w;
          const py = toY(series.sample(s, xVal));
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      } else {
        const trace = traces.get(series.id) ?? [];
        const tMax = Math.max(s.t, windowSec);
        const tMin = tMax - windowSec;
        for (let i = 0; i < trace.length; i++) {
          const px = f.x + ((trace[i].t - tMin) / windowSec) * f.w;
          const py = toY(trace[i].v);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }
    ctx.restore();

    // Legend for multi-series graphs — in the header row beside the y label, clear of the plot.
    if (def.series.length > 1) {
      ctx.save();
      ctx.font = '12px "Geist Variable", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      let lx = f.x + ctx.measureText(def.yLabel).width + 20;
      for (const series of def.series) {
        ctx.fillStyle = vp.palette[series.color];
        ctx.fillRect(lx, 12, 14, 3);
        ctx.fillStyle = vp.palette.muted;
        ctx.fillText(series.label, lx + 18, 13);
        lx += 18 + ctx.measureText(series.label).width + 16;
      }
      ctx.restore();
    }
  }

  return { push, draw, reset: () => traces.clear() };
}

function formatTick(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100 || Number.isInteger(value)) return String(Math.round(value));
  if (abs >= 1) return value.toFixed(1);
  return value.toFixed(2);
}
