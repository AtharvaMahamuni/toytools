// Canvas scene for the Ohm's Law Explorer: a rectangular single-loop circuit with a battery on
// the left and a resistor on the top edge. Charge carriers circulate clockwise at a speed set by
// the current, and the resistor's glow tracks the dissipated power. Excluded from unit coverage.

import type { SimState, Viewport } from '../types';
import { clear } from '../canvas';
import { current, power, driftRate } from './ohms-law';

const CARRIERS = 16;

/** Perimeter parametrization: map a loop fraction u in [0,1) to an (x,y) on the rectangle. */
function loopPoint(u: number, x0: number, y0: number, x1: number, y1: number): { x: number; y: number } {
  const w = x1 - x0;
  const h = y1 - y0;
  const perim = 2 * (w + h);
  let d = ((u % 1) + 1) % 1 * perim;
  // Clockwise from top-left: right along the top, down the right, left along the bottom, up the left.
  if (d < w) return { x: x0 + d, y: y0 };
  d -= w;
  if (d < h) return { x: x1, y: y0 + d };
  d -= h;
  if (d < w) return { x: x1 - d, y: y1 };
  d -= w;
  return { x: x0, y: y1 - d };
}

export function drawOhmsLaw(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const pad = Math.min(vp.width, vp.height) * 0.18;
  const x0 = pad;
  const y0 = pad;
  const x1 = vp.width - pad;
  const y1 = vp.height - pad;

  // The wire loop.
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.restore();

  // Battery on the left edge: a long plate (+) and a short plate (-).
  const midY = (y0 + y1) / 2;
  ctx.save();
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0 - 10, midY - 16);
  ctx.lineTo(x0 + 10, midY - 16); // long plate (+)
  ctx.moveTo(x0 - 5, midY + 16);
  ctx.lineTo(x0 + 5, midY + 16); // short plate (-)
  ctx.stroke();
  ctx.restore();

  // Resistor: a filled block on the top edge whose glow tracks power dissipation.
  const p = power(s.params);
  const glow = Math.min(1, p / 24);
  const rx = (x0 + x1) / 2 - 34;
  const rw = 68;
  const rh = 20;
  ctx.save();
  ctx.fillStyle = vp.palette.surface;
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2;
  ctx.fillRect(rx, y0 - rh / 2, rw, rh);
  ctx.strokeRect(rx, y0 - rh / 2, rw, rh);
  if (glow > 0.02) {
    ctx.globalAlpha = glow;
    ctx.fillStyle = vp.palette.danger;
    ctx.fillRect(rx, y0 - rh / 2, rw, rh);
  }
  ctx.restore();

  // Charge carriers circulating clockwise; spacing even, speed proportional to the current.
  const offset = driftRate(s.params) * s.t;
  const i = current(s.params);
  const radius = Math.min(5, 3 + Math.min(2, i * 0.5));
  ctx.save();
  ctx.fillStyle = vp.palette.accent;
  for (let k = 0; k < CARRIERS; k++) {
    const u = k / CARRIERS + offset;
    const pt = loopPoint(u, x0, y0, x1, y1);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Labels: current direction arrow near the bottom edge and readouts.
  ctx.save();
  ctx.fillStyle = vp.palette.muted;
  ctx.font = '13px var(--font-mono, monospace)';
  ctx.textAlign = 'center';
  ctx.fillText(`I = ${i.toFixed(3)} A`, (x0 + x1) / 2, y1 + 26);
  ctx.textAlign = 'left';
  ctx.fillText(`${s.params.voltage.toFixed(1)} V`, x0 - 4, midY + 40);
  ctx.textAlign = 'center';
  ctx.fillText(`${s.params.resistance.toFixed(0)} Ω`, (x0 + x1) / 2, y0 - 22);
  ctx.restore();
}
