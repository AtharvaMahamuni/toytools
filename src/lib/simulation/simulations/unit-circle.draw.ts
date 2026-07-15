// Canvas scene for the Unit Circle Explorer: the circle with axes and angle arc on the left, the
// reference triangle with its cos/sin legs, and the sine curve unrolling on the right with a live
// projection line from the point to the moving dot. Excluded from unit coverage; the stub-context
// smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawGrid, drawLabel } from '../canvas';
import { angleDegrees, cosTheta, sinTheta, CIRCLE_CX, CIRCLE_CY } from './unit-circle';

const TWO_PI = Math.PI * 2;

export function drawUnitCircle(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const cx = vp.width * CIRCLE_CX;
  const cy = vp.height * CIRCLE_CY;
  const R = vp.height * 0.34;
  const theta = s.vars.theta;
  const px = cx + R * Math.cos(theta);
  const py = cy - R * Math.sin(theta);

  // Axes through the centre.
  ctx.save();
  ctx.strokeStyle = vp.palette.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - R * 1.25, cy);
  ctx.lineTo(cx + R * 1.25, cy);
  ctx.moveTo(cx, cy - R * 1.25);
  ctx.lineTo(cx, cy + R * 1.25);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, '1', cx + R + 10, cy + 12, vp.palette.muted);
  drawLabel(ctx, '1', cx - 10, cy - R - 10, vp.palette.muted);

  // The circle itself.
  ctx.save();
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, TWO_PI);
  ctx.stroke();
  ctx.restore();

  // Angle arc from 0 to θ (canvas arcs run clockwise, math angles counter-clockwise).
  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.24, 0, -theta, true);
  ctx.stroke();
  ctx.restore();
  const midAngle = theta / 2;
  drawLabel(
    ctx,
    `θ = ${angleDegrees(s).toFixed(0)}°`,
    cx + R * 0.42 * Math.cos(midAngle),
    cy - R * 0.42 * Math.sin(midAngle),
    vp.palette.accent,
  );

  // Reference triangle: cos leg along the x-axis (accent), sin leg vertical (danger).
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = vp.palette.accent;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px, cy);
  ctx.stroke();
  ctx.strokeStyle = vp.palette.danger;
  ctx.beginPath();
  ctx.moveTo(px, cy);
  ctx.lineTo(px, py);
  ctx.stroke();
  // Hypotenuse (the radius arm).
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.restore();

  const sinVal = sinTheta(s);
  const cosVal = cosTheta(s);
  drawLabel(ctx, `cos θ = ${cosVal.toFixed(2)}`, (cx + px) / 2, cy + (sinVal >= 0 ? 14 : -14), vp.palette.accent);
  drawLabel(ctx, `sin θ = ${sinVal.toFixed(2)}`, px + (cosVal >= 0 ? 14 : -14), (cy + py) / 2, vp.palette.danger, cosVal >= 0 ? 'left' : 'right');

  // The point on the circle.
  ctx.save();
  ctx.fillStyle = vp.palette.accent;
  ctx.beginPath();
  ctx.arc(px, py, 9, 0, TWO_PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, `(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`, px, py - 18, vp.palette.ink);

  // Sine curve panel: y = sin(φ) for φ in [0, 2π], unrolled to the right of the circle.
  const waveX0 = cx + R * 1.45;
  const waveX1 = vp.width - 28;
  const waveW = waveX1 - waveX0;
  if (waveW > 60) {
    ctx.save();
    ctx.strokeStyle = vp.palette.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(waveX0, cy);
    ctx.lineTo(waveX1, cy);
    ctx.stroke();
    // Quarter-turn ticks.
    for (let q = 1; q <= 4; q++) {
      const tx = waveX0 + (waveW * q) / 4;
      ctx.beginPath();
      ctx.moveTo(tx, cy - 4);
      ctx.lineTo(tx, cy + 4);
      ctx.stroke();
      drawLabel(ctx, `${q * 90}°`, tx, cy + 16, vp.palette.muted);
    }
    // The full sine curve.
    ctx.strokeStyle = vp.palette.muted;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const phi = (TWO_PI * i) / 120;
      const wx = waveX0 + (waveW * i) / 120;
      const wy = cy - R * Math.sin(phi);
      if (i === 0) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();
    ctx.restore();

    // Moving dot at the current angle + dashed projection from the circle point.
    const dotX = waveX0 + (waveW * theta) / TWO_PI;
    const dotY = cy - R * Math.sin(theta);
    ctx.save();
    ctx.strokeStyle = vp.palette.danger;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(dotX, dotY);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = vp.palette.danger;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, TWO_PI);
    ctx.fill();
    ctx.restore();
    drawLabel(ctx, 'sin θ traced against the angle', waveX0 + waveW / 2, cy - R - 14, vp.palette.muted);
  }
}
