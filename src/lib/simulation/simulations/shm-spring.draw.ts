// Canvas scene for Simple Harmonic Motion: a coiled spring anchored on the left with a mass block
// that slides horizontally as x(t) = A·cos(ωt), plus PE/KE energy bars that trade in step. The
// equilibrium line is marked. Excluded from unit coverage (browser drawing); smoke-tested no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import { displacement, currentEnergies, totalEnergy } from './shm-spring';

const COILS = 10;

export function drawShmSpring(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const midY = vp.height * 0.42;
  const wallX = vp.width * 0.08;
  const centreX = vp.width * 0.55;
  // Amplitude of 1.5 m maps to 34% of the width so the block never leaves the canvas.
  const xScale = vp.width * 0.34 / 1.5;
  const x = displacement(s.params, s.t);
  const blockX = centreX + x * xScale;
  const blockW = 52;
  const blockH = 52;

  // Wall anchor.
  ctx.save();
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(wallX, midY - 44);
  ctx.lineTo(wallX, midY + 44);
  ctx.stroke();
  ctx.restore();

  // Equilibrium line.
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(centreX, midY - 60);
  ctx.lineTo(centreX, midY + 60);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, 'equilibrium', centreX, midY + 74, vp.palette.muted);

  // The spring: a zig-zag from the wall to the left face of the block.
  const springEnd = blockX - blockW / 2;
  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(wallX, midY);
  const span = springEnd - wallX;
  const seg = span / (COILS + 1);
  for (let i = 1; i <= COILS; i++) {
    const px = wallX + seg * i;
    const py = midY + (i % 2 === 0 ? -16 : 16);
    ctx.lineTo(px, py);
  }
  ctx.lineTo(springEnd, midY);
  ctx.stroke();
  ctx.restore();

  // The mass block.
  ctx.save();
  ctx.fillStyle = vp.palette.accent;
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2;
  ctx.fillRect(blockX - blockW / 2, midY - blockH / 2, blockW, blockH);
  ctx.strokeRect(blockX - blockW / 2, midY - blockH / 2, blockW, blockH);
  ctx.restore();
  drawLabel(ctx, `${s.params.mass.toFixed(1)} kg`, blockX, midY - blockH / 2 - 12, vp.palette.muted);

  // Energy bars: PE (spring) and KE (motion), each scaled to the constant total.
  const { pe, ke } = currentEnergies(s);
  const total = Math.max(totalEnergy(s.params), 1e-6);
  const barBase = vp.height - 26;
  const barMaxH = vp.height * 0.28;
  const barW = 34;
  const gap = 16;
  const barsX = vp.width * 0.8;

  const drawBar = (bx: number, frac: number, color: string, label: string) => {
    const h = Math.max(0, Math.min(1, frac)) * barMaxH;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(bx, barBase - h, barW, h);
    ctx.strokeStyle = vp.palette.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, barBase - barMaxH, barW, barMaxH);
    ctx.restore();
    drawLabel(ctx, label, bx + barW / 2, barBase + 14, vp.palette.muted);
  };

  drawBar(barsX, pe / total, vp.palette.accentSubtle, 'PE');
  drawBar(barsX + barW + gap, ke / total, vp.palette.danger, 'KE');
}
