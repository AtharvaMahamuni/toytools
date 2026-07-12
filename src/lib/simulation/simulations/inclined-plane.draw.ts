// Canvas scene for the Inclined Plane: a right-triangle ramp with a block that slides down from the
// top, plus force arrows for the weight component along the incline and the resisting friction. The
// block position comes from the model's replaying slide. Excluded from unit coverage.

import type { SimState, Viewport } from '../types';
import { clear, drawArrow, drawLabel } from '../canvas';
import { distanceDown, RAMP_M, isSliding, gravityComponent, frictionForce } from './inclined-plane';

export function drawInclinedPlane(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const th = (s.params.angle * Math.PI) / 180;
  const baseY = vp.height * 0.84;
  const originX = vp.width * 0.14;
  // Ramp hypotenuse length in pixels: fit the ramp width into the canvas.
  const rampPx = Math.min(vp.width * 0.72, (vp.height * 0.66) / Math.max(0.12, Math.sin(th)));
  const topX = originX + rampPx * Math.cos(th);
  const topY = baseY - rampPx * Math.sin(th);

  // The ramp triangle.
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.fillStyle = vp.palette.surface;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(originX, baseY);
  ctx.lineTo(topX, topY);
  ctx.lineTo(topX, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Angle label near the base corner.
  drawLabel(ctx, `${s.params.angle.toFixed(0)}°`, originX + 34, baseY - 12, vp.palette.muted, 'left');

  // Block position: fraction of the ramp travelled from the top.
  const frac = Math.min(1, distanceDown(s) / RAMP_M);
  // Direction unit vector pointing down the incline (from top toward origin).
  const dx = (originX - topX) / rampPx;
  const dy = (baseY - topY) / rampPx;
  const blockCx = topX + dx * rampPx * frac;
  const blockCy = topY + dy * rampPx * frac;
  const size = 30 + s.params.mass * 3;

  // Draw the block aligned to the ramp surface, sitting on top of the incline.
  const nx = -dy; // outward normal (up-left of the surface)
  const ny = dx;
  const cx = blockCx + nx * size * 0.5;
  const cy = blockCy + ny * size * 0.5;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(th * -1);
  ctx.fillStyle = vp.palette.accent;
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.strokeRect(-size / 2, -size / 2, size, size);
  ctx.restore();

  // Force arrows from the block centre: weight component (down the incline) and friction (up it).
  const gLen = Math.min(80, gravityComponent(s.params) * 1.6);
  drawArrow(ctx, cx, cy, cx + dx * gLen, cy + dy * gLen, vp.palette.danger, 2.5);
  if (frictionForce(s.params) > 0.1) {
    const fLen = Math.min(80, frictionForce(s.params) * 1.6);
    drawArrow(ctx, cx, cy, cx - dx * fLen, cy - dy * fLen, vp.palette.muted, 2.5);
  }

  // Status readout.
  ctx.save();
  ctx.fillStyle = vp.palette.muted;
  ctx.font = '13px var(--font-mono, monospace)';
  ctx.textAlign = 'center';
  ctx.fillText(isSliding(s.params) ? 'sliding' : 'static (friction holds it)', vp.width / 2, vp.height - 14);
  ctx.restore();
}
