// Canvas scene for the Wave Speed Explorer: the travelling wave curve, medium particles
// that only oscillate vertically, and a tracked crest marker moving at v = fλ.
// Excluded from unit coverage (browser drawing); a stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawGrid, drawLabel } from '../canvas';
import { crestX, displacement, WAVE_DOMAIN_M } from './wave-speed';

const PARTICLES = 12;

export function drawWaveSpeed(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const midY = vp.height / 2;
  // 1 m of amplitude maps to 38% of the half-height so the max amplitude never clips.
  const yScale = vp.height * 0.38;
  const toX = (x: number) => (x / WAVE_DOMAIN_M) * vp.width;
  const toY = (y: number) => midY - y * yScale;

  // Equilibrium line.
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(vp.width, midY);
  ctx.stroke();
  ctx.restore();

  // The wave curve.
  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const samples = Math.max(120, Math.round(vp.width / 4));
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * WAVE_DOMAIN_M;
    const px = toX(x);
    const py = toY(displacement(s.params, x, s.t));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  // Medium particles: fixed x, vertical motion only — the wave moves, the medium doesn't.
  ctx.save();
  ctx.fillStyle = vp.palette.ink;
  for (let i = 0; i < PARTICLES; i++) {
    const x = ((i + 0.5) / PARTICLES) * WAVE_DOMAIN_M;
    ctx.beginPath();
    ctx.arc(toX(x), toY(displacement(s.params, x, s.t)), 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Tracked crest: rides the peak at speed v, wrapping across the domain.
  const cx = crestX(s.params, s.t);
  ctx.save();
  ctx.fillStyle = vp.palette.danger;
  ctx.beginPath();
  ctx.arc(toX(cx), toY(s.params.amplitude), 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, 'crest', toX(cx), toY(s.params.amplitude) - 14, vp.palette.muted);

  // Wavelength bracket between two adjacent crests, drawn near the bottom edge.
  const lam = s.params.wavelength;
  if (lam < WAVE_DOMAIN_M * 0.8) {
    const x0 = toX(cx);
    const x1 = toX(Math.min(cx + lam, WAVE_DOMAIN_M));
    if (x1 - x0 > 24) {
      const by = vp.height - 22;
      ctx.save();
      ctx.strokeStyle = vp.palette.muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, by - 5);
      ctx.lineTo(x0, by);
      ctx.lineTo(x1, by);
      ctx.lineTo(x1, by - 5);
      ctx.stroke();
      ctx.restore();
      drawLabel(ctx, `λ = ${lam.toFixed(1)} m`, (x0 + x1) / 2, by + 10, vp.palette.muted);
    }
  }
}
