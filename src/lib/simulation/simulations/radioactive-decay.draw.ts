// Canvas for one decay sample: 400 nuclei, a screen-clock label, and the miss.
// Excluded from unit coverage.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import {
  N0,
  caption,
  formatHalfLife,
  isotopeOf,
  parentCount,
  unitFor,
} from './radioactive-decay';

const COLS = 20;
const ROWS = 20;

export function drawRadioactiveDecay(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const iso = isotopeOf(s.params.isotope ?? 0);
  const seed = s.vars.seed ?? 1;
  const halves = s.vars.halves ?? 0;
  const limit = 2 ** -halves;

  drawLabel(ctx, `${iso.symbol} · ${formatHalfLife(iso)}`, vp.width / 2, vp.height * 0.06, vp.palette.ink);
  drawLabel(ctx, 'Screen clock, not the real half-life', vp.width / 2, vp.height * 0.12, vp.palette.muted);

  const gridX = vp.width * 0.1;
  const gridY = vp.height * 0.18;
  const gridW = vp.width * 0.8;
  const gridH = vp.height * 0.62;
  const cellW = gridW / COLS;
  const cellH = gridH / ROWS;
  const radius = Math.max(1.5, Math.min(cellW, cellH) * 0.32);

  for (let i = 0; i < N0; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = gridX + cellW * (col + 0.5);
    const cy = gridY + cellH * (row + 0.5);
    const alive = unitFor(seed, i) < limit;
    ctx.beginPath();
    ctx.arc(cx, cy, alive ? radius : radius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = alive ? vp.palette.accent : vp.palette.border;
    ctx.fill();
  }

  ctx.save();
  ctx.fillStyle = vp.palette.ink;
  ctx.font = `600 ${Math.max(13, Math.round(vp.height * 0.045))}px "Geist Variable", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(caption(s), vp.width / 2, vp.height * 0.88);
  ctx.restore();

  const live = parentCount(seed, halves);
  drawLabel(ctx, `Parent ${live}. Daughter ${N0 - live}.`, vp.width / 2, vp.height * 0.95, vp.palette.muted);
}
