// Canvas scene for the Doppler Effect: a source that loops across the canvas emitting circular
// wavefronts. The animation is scaled to the canvas, but the source moves at the true Mach fraction
// of the wave speed, so the wavefronts bunch ahead and stretch behind by exactly the right ratio.
// Two observers flag the higher (ahead) and lower (behind) frequencies. Excluded from unit coverage.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import { machNumber } from './doppler-effect';

const T_EMIT = 0.42; // seconds between drawn wavefronts

export function drawDopplerEffect(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const midY = vp.height * 0.5;
  const visC = vp.width * 0.16; // wavefront expansion speed in px/s
  const maxR = vp.width * 0.9;
  const mach = Math.min(0.97, machNumber(s.params));
  const sourceVisSpeed = mach * visC;

  const startX = vp.width * 0.1;
  const span = vp.width * 0.8;

  const sourcePx = (t: number): number => {
    if (sourceVisSpeed <= 0) return vp.width * 0.5;
    const d = (sourceVisSpeed * t) % span;
    return startX + d;
  };

  // Wavefronts emitted at regular past instants; radius grows at the visual wave speed.
  const maxAge = maxR / visC;
  const kMax = Math.floor(s.t / T_EMIT);
  const kMin = Math.ceil((s.t - maxAge) / T_EMIT);
  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 1.5;
  for (let k = kMin; k <= kMax; k++) {
    const te = k * T_EMIT;
    if (te < 0) continue;
    const age = s.t - te;
    const r = visC * age;
    if (r < 2 || r > maxR) continue;
    const cx = sourcePx(te);
    ctx.globalAlpha = Math.max(0.15, 1 - r / maxR);
    ctx.beginPath();
    ctx.arc(cx, midY, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // The source.
  const sx = sourcePx(s.t);
  ctx.save();
  ctx.fillStyle = vp.palette.danger;
  ctx.beginPath();
  ctx.arc(sx, midY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, `${s.params.frequency.toFixed(0)} Hz source`, sx, midY - 20, vp.palette.muted);

  // Observers at the two ends: ahead (right, higher pitch) and behind (left, lower pitch).
  ctx.save();
  ctx.fillStyle = vp.palette.ink;
  ctx.beginPath();
  ctx.arc(vp.width * 0.96, midY, 6, 0, Math.PI * 2);
  ctx.arc(vp.width * 0.04, midY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (s.params.sourceSpeed > 0) {
    drawLabel(ctx, 'higher', vp.width * 0.96, midY - 18, vp.palette.muted);
    drawLabel(ctx, 'lower', vp.width * 0.04, midY - 18, vp.palette.muted);
  }
}
