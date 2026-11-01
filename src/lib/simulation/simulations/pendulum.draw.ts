// Canvas scene for the Pendulum Explorer: pivot, rod, bob, velocity + acceleration
// vectors, and live PE/KE energy bars. Excluded from unit coverage; stub-context smoke
// test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawAffordanceHalo, drawAngleArc, drawArrow, drawLabel } from '../canvas';
import { kineticEnergy, potentialEnergy } from './pendulum';

export function drawPendulum(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const pivotX = vp.width * 0.42;
  const pivotY = vp.height * 0.12;
  // Scale the rod so the longest pendulum still fits above the energy bars.
  const rodPx = (s.params.length / 3) * vp.height * 0.62 + vp.height * 0.08;
  const theta = s.vars.theta;
  const isHeld = s.vars.holding === 1;
  const bobX = pivotX + rodPx * Math.sin(theta);
  const bobY = pivotY + rodPx * Math.cos(theta);

  // Rest-position reference line (dashed vertical).
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, pivotY + rodPx + 20);
  ctx.stroke();
  ctx.restore();

  // Angle arc at pivot between vertical (π/2) and rod.
  if (Math.abs(theta) > 0.04) {
    const arcR = Math.min(48, rodPx * 0.45);
    const startA = Math.PI / 2;
    const endA = Math.PI / 2 + theta;
    const deg = Math.round(Math.abs((theta * 180) / Math.PI));
    drawAngleArc(ctx, pivotX, pivotY, arcR, startA, endA, `${deg}°`, vp.palette.accent);
  }

  // Rod + pivot + bob.
  ctx.save();
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Pivot mount
  ctx.fillStyle = vp.palette.muted;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Interactive affordance halo around the bob
  drawAffordanceHalo(ctx, bobX, bobY, 15, vp.palette.accent, isHeld);

  // Bob
  ctx.fillStyle = vp.palette.accent;
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Velocity vector — tangential, proportional to Lω.
  const v = s.params.length * s.vars.omega;
  const vScale = 26;
  const tangX = Math.cos(theta);
  const tangY = -Math.sin(theta);
  if (Math.abs(v) > 0.05) {
    drawArrow(
      ctx,
      bobX,
      bobY,
      bobX + tangX * v * vScale,
      bobY + tangY * v * vScale,
      vp.palette.accent,
      2.5,
    );
    drawLabel(ctx, 'v', bobX + tangX * v * vScale, bobY + tangY * v * vScale - 12, vp.palette.accent);
  }

  // Acceleration vector — tangential (gravity restoring) + centripetal (along the rod).
  const g = s.params.gravity;
  const aTan = -g * Math.sin(theta);
  const aCen = (v * v) / s.params.length;
  const aScale = 5;
  const ax = tangX * aTan * aScale + ((pivotX - bobX) / rodPx) * aCen * aScale;
  const ay = tangY * aTan * aScale + ((pivotY - bobY) / rodPx) * aCen * aScale;
  if (Math.hypot(ax, ay) > 4) {
    drawArrow(ctx, bobX, bobY, bobX + ax, bobY + ay, vp.palette.danger, 2);
    drawLabel(ctx, 'a', bobX + ax + 12, bobY + ay, vp.palette.danger, 'left');
  }

  // Energy bars (PE / KE) along the right edge — the conservation story at a glance.
  const pe = potentialEnergy(s);
  const ke = kineticEnergy(s);
  const total = Math.max(pe + ke, 1e-9);
  const barX = vp.width - 86;
  const barW = 26;
  const barH = vp.height * 0.5;
  const barY = vp.height * 0.2;

  ctx.save();
  // Bar background tracks
  ctx.fillStyle = vp.palette.bg;
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillRect(barX + barW + 14, barY, barW, barH);

  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);
  ctx.strokeRect(barX + barW + 14, barY, barW, barH);

  // Energy fills
  ctx.fillStyle = vp.palette.muted;
  const peH = (pe / total) * barH;
  ctx.fillRect(barX, barY + barH - peH, barW, peH);

  ctx.fillStyle = vp.palette.accent;
  const keH = (ke / total) * barH;
  ctx.fillRect(barX + barW + 14, barY + barH - keH, barW, keH);
  ctx.restore();

  drawLabel(ctx, 'PE', barX + barW / 2, barY + barH + 12, vp.palette.muted);
  drawLabel(ctx, 'KE', barX + barW + 14 + barW / 2, barY + barH + 12, vp.palette.accent);
}
