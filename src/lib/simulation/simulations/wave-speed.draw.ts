// Canvas scene for the Wave Speed Explorer: the travelling wave curve, medium particles
// that only oscillate vertically, and a tracked crest marker moving at v = fλ.
// Excluded from unit coverage (browser drawing); a stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawAffordanceHalo, drawArrow, drawGrid, drawLabel } from '../canvas';
import { crestX, displacement, waveSpeed, WAVE_DOMAIN_M } from './wave-speed';

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

  // Tracked crest: rides the peak at speed v with interactive amplitude handle.
  const cx = crestX(s.params, s.t);
  const crestPxX = toX(cx);
  const crestPxY = toY(s.params.amplitude);
  const isDragging = s.vars.dragging === 1;

  // Amplitude indicator line from equilibrium to crest
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(crestPxX, midY);
  ctx.lineTo(crestPxX, crestPxY);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, `A = ${s.params.amplitude.toFixed(2)} m`, crestPxX + 44, (midY + crestPxY) / 2, vp.palette.muted, 'left');

  // Interactive crest affordance halo
  drawAffordanceHalo(ctx, crestPxX, crestPxY, 8, vp.palette.danger, isDragging);

  ctx.save();
  ctx.fillStyle = vp.palette.danger;
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(crestPxX, crestPxY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, isDragging ? '▲ Drag ▼' : 'crest', crestPxX, crestPxY - 14, vp.palette.danger);

  // Wave speed vector arrow at the top right indicating wave propagation
  const v = waveSpeed(s.params);
  const vArrowX = vp.width - 90;
  const vArrowY = 24;
  drawArrow(ctx, vArrowX, vArrowY, vArrowX + 50, vArrowY, vp.palette.accent, 2);
  drawLabel(ctx, `v = ${v.toFixed(2)} m/s →`, vArrowX + 25, vArrowY - 12, vp.palette.accent);

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
