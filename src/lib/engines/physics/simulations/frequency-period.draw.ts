// Canvas scene for the Frequency & Period Explorer: an oscillating bob on a guide rail,
// plus a cycle timeline that drops a tick every completed period.
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawGrid, drawLabel } from '../canvas';
import { cyclesCompleted, OSC_AMPLITUDE, oscillation, period } from './frequency-period';

export function drawFrequencyPeriod(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const railX = vp.width * 0.22;
  const midY = vp.height * 0.44;
  const yScale = vp.height * 0.3;
  const y = oscillation(s.params, s.t);
  const bobY = midY - (y / OSC_AMPLITUDE) * yScale;

  // Guide rail with equilibrium mark.
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(railX, midY - yScale - 14);
  ctx.lineTo(railX, midY + yScale + 14);
  ctx.stroke();
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(railX - 26, midY);
  ctx.lineTo(railX + 26, midY);
  ctx.stroke();
  ctx.restore();

  // Bob.
  ctx.save();
  ctx.fillStyle = vp.palette.accent;
  ctx.beginPath();
  ctx.arc(railX, bobY, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Phase dial: one revolution per cycle, a compact "clock" for the period.
  const dialX = vp.width * 0.62;
  const dialR = Math.min(vp.height * 0.22, 56);
  const phase = 2 * Math.PI * s.params.frequency * s.t - Math.PI / 2;
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(dialX, midY, dialR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = vp.palette.accent;
  ctx.beginPath();
  ctx.moveTo(dialX, midY);
  ctx.lineTo(dialX + dialR * Math.cos(phase), midY + dialR * Math.sin(phase));
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, 'one revolution = one cycle', dialX, midY + dialR + 14, vp.palette.muted);

  // Cycle timeline along the bottom: a tick per completed cycle in the last few seconds.
  const T = period(s.params);
  const tlY = vp.height - 26;
  const windowSec = 6;
  const t0 = Math.max(0, s.t - windowSec);
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.beginPath();
  ctx.moveTo(20, tlY);
  ctx.lineTo(vp.width - 20, tlY);
  ctx.stroke();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 2;
  const firstCycle = Math.ceil(t0 / T);
  for (let n = firstCycle; n * T <= s.t; n++) {
    const px = 20 + ((n * T - t0) / windowSec) * (vp.width - 40);
    ctx.beginPath();
    ctx.moveTo(px, tlY - 7);
    ctx.lineTo(px, tlY + 7);
    ctx.stroke();
  }
  ctx.restore();
  drawLabel(
    ctx,
    `cycle ticks — ${cyclesCompleted(s.params, s.t)} completed`,
    vp.width / 2,
    tlY + 14,
    vp.palette.muted,
  );
}
