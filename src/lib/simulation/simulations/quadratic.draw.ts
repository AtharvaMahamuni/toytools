// Canvas scene for the Quadratic Equation Explorer: centered axes, the parabola, the vertex with
// its dashed axis of symmetry, root and y-intercept markers, the animated sweep dot, and the live
// equation label. Excluded from unit coverage; the stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawGrid, drawLabel } from '../canvas';
import { discriminant, evaluate, realRoots, vertexX, vertexY, VIEW_X, VIEW_Y } from './quadratic';

export function drawQuadratic(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const toPx = (wx: number): number => ((wx + VIEW_X) / (2 * VIEW_X)) * vp.width;
  const toPy = (wy: number): number => ((VIEW_Y - wy) / (2 * VIEW_Y)) * vp.height;
  const cx = toPx(0);
  const cy = toPy(0);

  // Axes with unit ticks every 2 world units.
  ctx.save();
  ctx.strokeStyle = vp.palette.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(vp.width, cy);
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, vp.height);
  for (let x = -VIEW_X + 2; x < VIEW_X; x += 2) {
    if (x === 0) continue;
    ctx.moveTo(toPx(x), cy - 4);
    ctx.lineTo(toPx(x), cy + 4);
  }
  for (let y = -VIEW_Y + 2; y < VIEW_Y; y += 2) {
    if (y === 0) continue;
    ctx.moveTo(cx - 4, toPy(y));
    ctx.lineTo(cx + 4, toPy(y));
  }
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, `${VIEW_X}`, vp.width - 12, cy + 12, vp.palette.muted);
  drawLabel(ctx, `${VIEW_Y}`, cx + 12, 10, vp.palette.muted);

  // The parabola.
  ctx.save();
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= 160; i++) {
    const wx = -VIEW_X + (2 * VIEW_X * i) / 160;
    const wy = evaluate(s, wx);
    // Skip segments far outside the window so steep parabolas don't smear edge artifacts.
    if (wy < -VIEW_Y * 3 || wy > VIEW_Y * 3) {
      started = false;
      continue;
    }
    const px = toPx(wx);
    const py = toPy(wy);
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Axis of symmetry + vertex.
  const h = vertexX(s);
  const k = vertexY(s);
  if (Math.abs(h) <= VIEW_X) {
    ctx.save();
    ctx.strokeStyle = vp.palette.accent;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toPx(h), 0);
    ctx.lineTo(toPx(h), vp.height);
    ctx.stroke();
    ctx.restore();
  }
  if (Math.abs(h) <= VIEW_X && Math.abs(k) <= VIEW_Y) {
    ctx.save();
    ctx.fillStyle = vp.palette.accent;
    ctx.beginPath();
    ctx.arc(toPx(h), toPy(k), 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawLabel(ctx, `vertex (${h.toFixed(1)}, ${k.toFixed(1)})`, toPx(h), toPy(k) + 20, vp.palette.accent);
  }

  // Real roots on the x-axis.
  const roots = realRoots(s);
  if (roots && discriminant(s) >= -1e-9) {
    ctx.save();
    ctx.fillStyle = vp.palette.danger;
    for (const r of roots) {
      if (Math.abs(r) > VIEW_X) continue;
      ctx.beginPath();
      ctx.arc(toPx(r), cy, 6, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, `x = ${r.toFixed(2)}`, toPx(r), cy - 14, vp.palette.danger);
    }
    ctx.restore();
  }

  // y-intercept (0, c).
  if (Math.abs(s.params.c) <= VIEW_Y) {
    ctx.save();
    ctx.fillStyle = vp.palette.muted;
    ctx.beginPath();
    ctx.arc(cx, toPy(s.params.c), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawLabel(ctx, `(0, ${s.params.c.toFixed(1)})`, cx + 40, toPy(s.params.c), vp.palette.muted);
  }

  // Animated sweep dot travelling along the curve.
  const sx = VIEW_X * 0.8 * Math.sin(s.vars.sweep);
  const sy = evaluate(s, sx);
  if (Math.abs(sy) <= VIEW_Y) {
    ctx.save();
    ctx.fillStyle = vp.palette.ink;
    ctx.beginPath();
    ctx.arc(toPx(sx), toPy(sy), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawLabel(ctx, `(${sx.toFixed(1)}, ${sy.toFixed(1)})`, toPx(sx), toPy(sy) - 14, vp.palette.ink);
  }

  // Live equation, top-left.
  const { a, b, c } = s.params;
  drawLabel(
    ctx,
    `y = ${a.toFixed(1)}x² ${b < 0 ? '-' : '+'} ${Math.abs(b).toFixed(1)}x ${c < 0 ? '-' : '+'} ${Math.abs(c).toFixed(1)}`,
    14,
    16,
    vp.palette.ink,
    'left',
  );
}
