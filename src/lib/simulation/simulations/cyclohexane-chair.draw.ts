// Chair silhouette. The substituent marker stays above its carbon for the whole flip.
// Excluded from unit coverage; the model tests pin the labels.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import { isMethyl, readout } from './cyclohexane-chair';

const CHAIR: Array<[number, number]> = [
  [0.22, 0.62],
  [0.46, 0.74],
  [0.7, 0.56],
  [0.74, 0.34],
  [0.5, 0.24],
  [0.26, 0.4],
];

export function drawCyclohexaneChair(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;
  const t = Math.min(1, Math.max(0, s.params.flip / 100));
  const ox = vp.width * 0.08;
  const oy = vp.height * 0.12;
  const w = vp.width * 0.84;
  const h = vp.height * 0.7;

  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  CHAIR.forEach(([x, y], i) => {
    const px = ox + x * w;
    const py = oy + y * h;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.stroke();

  const carbon = CHAIR[0];
  const cx = ox + carbon[0] * w;
  const cy = oy + carbon[1] * h;
  const equatorial = { x: cx - w * 0.12, y: cy + h * 0.08 };
  const axial = { x: cx, y: cy - h * 0.22 };
  const mx = equatorial.x + (axial.x - equatorial.x) * t;
  const my = equatorial.y + (axial.y - equatorial.y) * t;

  ctx.strokeStyle = p.accent;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(mx, my);
  ctx.stroke();

  if (isMethyl(s.params.substituent)) {
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(mx, my, Math.max(10, vp.width * 0.018), 0, Math.PI * 2);
    ctx.fill();
    drawLabel(ctx, 'Me', mx, my - 16, p.ink);
  }

  ctx.restore();
  drawLabel(ctx, readout(s.params.flip), vp.width * 0.5, vp.height * 0.08, p.ink);
}
