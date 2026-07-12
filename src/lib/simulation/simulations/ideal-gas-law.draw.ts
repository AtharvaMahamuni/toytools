// Canvas scene for the Ideal Gas Law: a box of bouncing gas particles with a movable piston on the
// right. Particle count tracks the amount n, particle speed tracks the temperature, and the piston
// position tracks the volume. Positions are a deterministic function of time so the scene is
// reproducible and needs no stored state. Excluded from unit coverage (browser drawing).

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import { thermalSpeed, pressureKpa } from './ideal-gas-law';

const MAX_PARTICLES = 40;

/** Deterministic pseudo-random in [0,1) from an integer seed. */
function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Triangle-wave bounce in [0,1] for a value that reflects off 0 and 1. */
function bounce(u: number): number {
  const m = ((u % 2) + 2) % 2;
  return m < 1 ? m : 2 - m;
}

export function drawIdealGasLaw(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const boxX = vp.width * 0.12;
  const boxY = vp.height * 0.14;
  const boxBottom = vp.height * 0.86;
  const boxH = boxBottom - boxY;
  const fullW = vp.width * 0.76;
  // Piston position tracks the volume across the 5..40 L range.
  const volFrac = (s.params.volume - 5) / 35;
  const pistonX = boxX + fullW * volFrac;

  // Box walls (left, top, bottom) and the piston (right movable wall).
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pistonX, boxY);
  ctx.lineTo(boxX, boxY);
  ctx.lineTo(boxX, boxBottom);
  ctx.lineTo(pistonX, boxBottom);
  ctx.stroke();
  ctx.restore();

  // Piston.
  ctx.save();
  ctx.fillStyle = vp.palette.surface;
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 3;
  ctx.fillRect(pistonX, boxY - 4, 12, boxH + 8);
  ctx.strokeRect(pistonX, boxY - 4, 12, boxH + 8);
  ctx.restore();
  drawLabel(ctx, `${s.params.volume.toFixed(1)} L`, pistonX + 6, boxY - 14, vp.palette.muted);

  // Particles: count from amount, speed from temperature. Each bounces inside the current box.
  const count = Math.round((s.params.amount / 2) * MAX_PARTICLES);
  const speed = thermalSpeed(s.params);
  const innerW = pistonX - boxX - 12;
  const innerH = boxH - 12;
  ctx.save();
  ctx.fillStyle = vp.palette.accent;
  for (let i = 0; i < count; i++) {
    const sx = hash(i + 1);
    const sy = hash(i + 101);
    const dirx = 0.4 + hash(i + 201) * 0.6;
    const diry = 0.4 + hash(i + 301) * 0.6;
    const px = boxX + 6 + bounce(sx * 2 + s.t * speed * dirx) * innerW;
    const py = boxY + 6 + bounce(sy * 2 + s.t * speed * diry) * innerH;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Readouts.
  ctx.save();
  ctx.fillStyle = vp.palette.muted;
  ctx.font = '13px var(--font-mono, monospace)';
  ctx.textAlign = 'left';
  ctx.fillText(`${s.params.temperature.toFixed(0)} K`, boxX, boxBottom + 20);
  ctx.textAlign = 'right';
  ctx.fillText(`P = ${pressureKpa(s.params).toFixed(1)} kPa`, boxX + fullW, boxBottom + 20);
  ctx.restore();
}
