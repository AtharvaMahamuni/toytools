// Canvas scene for the Projectile Motion Simulator: a tilted launcher, the full flight parabola
// (dashed), the live trail up to the current position, apex and range markers, the moving
// projectile, and its velocity arrow (constant horizontal, shrinking-then-growing vertical).
// Uniform world→pixel scale so the arc keeps its true, physical shape.
// Excluded from unit coverage (browser drawing); a stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawAffordanceHalo, drawAngleArc, drawArrow, drawGrid, drawLabel } from '../canvas';
import { flightTau, flightTime, maxHeight, posX, posY, range } from './projectile-motion';

const PAD = { left: 44, right: 20, top: 20, bottom: 34 };

export function drawProjectileMotion(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const R = range(s.params);
  const H = maxHeight(s.params);
  const T = flightTime(s.params);

  const availW = vp.width - PAD.left - PAD.right;
  const availH = vp.height - PAD.top - PAD.bottom;
  const worldW = Math.max(R, 1);
  const worldH = Math.max(H, 1);
  // Uniform scale keeps the parabola physically correct (a flat shot looks flat, a lob looks tall).
  const scale = Math.min(availW / worldW, availH / worldH);

  const ox = PAD.left;
  const oy = vp.height - PAD.bottom;
  const toX = (xm: number) => ox + xm * scale;
  const toY = (ym: number) => oy - ym * scale;

  // Ground line.
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, oy);
  ctx.lineTo(vp.width, oy);
  ctx.stroke();
  ctx.restore();

  // Launcher barrel, tilted to the launch angle.
  const th = (s.params.angle * Math.PI) / 180;
  const barrel = 28;
  const isAiming = s.vars.aiming === 1;

  // Aiming arc at the barrel base
  if (s.params.angle > 10) {
    drawAngleArc(ctx, ox, oy, 30, 0, -th, `${Math.round(s.params.angle)}°`, vp.palette.accent);
  }

  // Interactive launcher affordance halo
  drawAffordanceHalo(ctx, ox, oy, 14, vp.palette.accent, isAiming);

  ctx.save();
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox + barrel * Math.cos(th), oy - barrel * Math.sin(th));
  ctx.stroke();

  ctx.fillStyle = vp.palette.accent;
  ctx.beginPath();
  ctx.arc(ox, oy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // If aiming, draw slingshot aiming guide line & speed badge
  if (isAiming) {
    const tipX = ox + barrel * Math.cos(th) * 2;
    const tipY = oy - barrel * Math.sin(th) * 2;
    ctx.save();
    ctx.strokeStyle = vp.palette.accent;
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, `${s.params.speed.toFixed(0)} m/s`, tipX + 16, tipY - 8, vp.palette.accent);
  }

  // Full flight path (dashed), sampled across the whole flight time.
  const steps = 80;
  ctx.save();
  ctx.strokeStyle = vp.palette.muted;
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const tau = (i / steps) * T;
    const px = toX(posX(s.params, tau));
    const py = toY(posY(s.params, tau));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  const tauNow = flightTau(s.params, s.t);

  // Live trail up to the current position (solid accent).
  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const trailSteps = Math.max(2, Math.round((tauNow / Math.max(T, 0.001)) * steps));
  for (let i = 0; i <= trailSteps; i++) {
    const tau = (i / trailSteps) * tauNow;
    const px = toX(posX(s.params, tau));
    const py = toY(posY(s.params, tau));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  // Apex marker.
  if (H > 0.05) {
    const ax = toX(R / 2);
    const ay = toY(H);
    ctx.save();
    ctx.strokeStyle = vp.palette.border;
    ctx.setLineDash([2, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax, oy);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, `H = ${H.toFixed(1)} m`, ax, ay - 12, vp.palette.muted);
  }

  // Range flag at the landing point.
  const rx = toX(R);
  ctx.save();
  ctx.strokeStyle = vp.palette.danger;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rx, oy);
  ctx.lineTo(rx, oy - 16);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, `R = ${R.toFixed(1)} m`, rx, oy + 14, vp.palette.muted);

  // The projectile with subtle motion halo.
  const bx = toX(posX(s.params, tauNow));
  const by = toY(posY(s.params, tauNow));
  drawAffordanceHalo(ctx, bx, by, 7, vp.palette.danger, false);
  ctx.save();
  ctx.fillStyle = vp.palette.danger;
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(bx, by, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Velocity arrow at the projectile: horizontal component is constant, vertical shrinks to zero
  // at the apex and grows again on the way down.
  const vx = s.params.speed * Math.cos(th);
  const vy = s.params.speed * Math.sin(th) - s.params.gravity * tauNow;
  const velPx = 0.7;
  drawArrow(ctx, bx, by, bx + vx * velPx, by - vy * velPx, vp.palette.accent, 2);
}
