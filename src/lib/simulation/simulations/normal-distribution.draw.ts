// Canvas scene for the Normal Distribution Visualizer: axes, the bell over x in [-4, 4],
// the shaded left tail, a vertical line at the bound, and ticks at the mean and mean ± sigma.
// Colors come from the viewport palette only. Excluded from unit coverage.

import type { SimState, Viewport } from '../types';
import { clear, drawGrid, drawLabel } from '../canvas';
import { AXIS_MAX, AXIS_MIN, normalPdf, zScore } from './normal-distribution';

const SAMPLES = 160;

export function drawNormalDistribution(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const toPx = (x: number): number => ((x - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * vp.width;
  const peak = normalPdf(s, s.params.mean);
  const baseY = vp.height * 0.82;
  const peakY = vp.height * 0.16;
  const toPy = (density: number): number => {
    const t = peak > 0 ? density / peak : 0;
    return baseY - t * (baseY - peakY);
  };

  const bound = Math.min(AXIS_MAX, Math.max(AXIS_MIN, s.params.bound));

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(toPx(AXIS_MIN), baseY);
  for (let i = 0; i <= SAMPLES; i++) {
    const x = AXIS_MIN + ((bound - AXIS_MIN) * i) / SAMPLES;
    ctx.lineTo(toPx(x), toPy(normalPdf(s, x)));
  }
  ctx.lineTo(toPx(bound), baseY);
  ctx.closePath();
  ctx.fillStyle = vp.palette.accent;
  ctx.globalAlpha = 0.28;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i <= SAMPLES; i++) {
    const x = AXIS_MIN + ((AXIS_MAX - AXIS_MIN) * i) / SAMPLES;
    const px = toPx(x);
    const py = toPy(normalPdf(s, x));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = vp.palette.muted;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  ctx.lineTo(vp.width, baseY);
  ctx.moveTo(toPx(0), peakY);
  ctx.lineTo(toPx(0), baseY);
  const mean = s.params.mean;
  const sigma = s.params.sigma;
  for (const tick of [mean - sigma, mean, mean + sigma]) {
    if (tick < AXIS_MIN || tick > AXIS_MAX) continue;
    ctx.moveTo(toPx(tick), baseY - 7);
    ctx.lineTo(toPx(tick), baseY + 7);
  }
  ctx.stroke();
  ctx.restore();

  const tickLabelY = Math.min(vp.height - 10, baseY + 18);
  const tickLabels: [number, string][] = [
    [mean - sigma, 'μ-σ'],
    [mean, 'μ'],
    [mean + sigma, 'μ+σ'],
  ];
  for (const [tick, label] of tickLabels) {
    if (tick < AXIS_MIN || tick > AXIS_MAX) continue;
    drawLabel(ctx, label, toPx(tick), tickLabelY, vp.palette.muted);
  }

  const bx = toPx(bound);
  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx, peakY);
  ctx.lineTo(bx, baseY);
  ctx.stroke();
  ctx.fillStyle = vp.palette.accent;
  ctx.beginPath();
  ctx.arc(bx, toPy(normalPdf(s, bound)), 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawLabel(ctx, 'bound', bx, Math.max(12, peakY - 10), vp.palette.accent);
  drawLabel(ctx, `z = ${zScore(s).toFixed(2)}`, 12, 16, vp.palette.accent, 'left');
}
