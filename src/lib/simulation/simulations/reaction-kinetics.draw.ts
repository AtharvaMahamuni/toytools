// Canvas scene for the Reaction Rate Simulator. Two panels: the reaction coordinate on the left,
// where the barrier height tracks the activation energy slider, and the flask on the right, where
// reactant particles turn into product particles as the run proceeds.
//
// The barrier is drawn on a scale relative to the slider's own range rather than to an absolute
// energy axis. A 200 kJ/mol barrier drawn to the same scale as a 10 kJ/mol one would leave the
// small case invisible, and the number beside it carries the real value either way.
//
// Layout is banded: conversion caption at the top, panels in the middle, elapsed time at the
// bottom. Nothing is positioned above the canvas.
//
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawArrow, drawLabel } from '../canvas';
import { conversion, describeSeconds } from './reaction-kinetics';

/** Particles drawn in the flask. Enough that a single conversion step is visible, few enough to
 *  stay legible at 390px wide. */
const PARTICLE_COLS = 6;
const PARTICLE_ROWS = 4;
const PARTICLE_COUNT = PARTICLE_COLS * PARTICLE_ROWS;

/** Relative height of the reaction coordinate at fraction `u` along it: a well, a barrier, a lower
 *  well. Units are fractions of the barrier height, so 1 is the transition state. */
function profileHeight(u: number): number {
  const drop = -0.3 * (1 / (1 + Math.exp(-(u - 0.5) * 12)));
  const barrier = Math.exp(-Math.pow((u - 0.5) / 0.16, 2));
  return drop + barrier;
}

export function drawReactionKinetics(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;
  const done = conversion(s);

  drawLabel(ctx, `${(done * 100).toFixed(1)}% converted`, vp.width * 0.5, vp.height * 0.08, p.ink);

  // ── Reaction coordinate ──────────────────────────────────────────────────────────────────────
  const profileLeft = vp.width * 0.06;
  const profileWidth = vp.width * 0.46;
  const baseY = vp.height * 0.74;
  // The tallest barrier on the slider fills the panel; everything else is drawn in proportion.
  const scale = (vp.height * 0.42 * s.params.activationEnergy) / 200;

  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const x = profileLeft + u * profileWidth;
    const y = baseY - profileHeight(u) * scale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // The activation energy, measured from the reactant well up to the transition state.
  const peakX = profileLeft + profileWidth * 0.5;
  const peakY = baseY - profileHeight(0.5) * scale;
  const wellY = baseY - profileHeight(0) * scale;
  drawArrow(ctx, peakX - profileWidth * 0.22, wellY, peakX - profileWidth * 0.22, peakY, p.accent, 1.6);
  drawLabel(ctx, `Ea ${s.params.activationEnergy.toFixed(0)} kJ/mol`, peakX - profileWidth * 0.2, (wellY + peakY) / 2, p.accent, 'left');

  // A molecule making the journey, so the barrier reads as something crossed rather than drawn.
  const travel = (s.t * 0.35) % 1;
  const travelX = profileLeft + travel * profileWidth;
  const travelY = baseY - profileHeight(travel) * scale;
  ctx.save();
  ctx.beginPath();
  ctx.arc(travelX, travelY - 6, 5, 0, Math.PI * 2);
  ctx.fillStyle = travel < 0.5 ? p.accent : p.danger;
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, 'reaction coordinate', profileLeft + profileWidth / 2, vp.height * 0.85, p.muted);

  // ── The flask ────────────────────────────────────────────────────────────────────────────────
  const flaskX = vp.width * 0.62;
  const flaskW = vp.width * 0.3;
  const flaskTop = vp.height * 0.2;
  const flaskBottom = vp.height * 0.78;
  ctx.save();
  ctx.strokeStyle = p.muted;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(flaskX, flaskTop);
  ctx.lineTo(flaskX, flaskBottom);
  ctx.lineTo(flaskX + flaskW, flaskBottom);
  ctx.lineTo(flaskX + flaskW, flaskTop);
  ctx.stroke();
  ctx.restore();

  const converted = Math.round(done * PARTICLE_COUNT);
  const cellW = flaskW / (PARTICLE_COLS + 1);
  const cellH = (flaskBottom - flaskTop) / (PARTICLE_ROWS + 1);
  const dot = Math.max(4, Math.min(cellW, cellH) * 0.3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const col = i % PARTICLE_COLS;
    const row = Math.floor(i / PARTICLE_COLS);
    const x = flaskX + cellW * (col + 1);
    const y = flaskTop + cellH * (row + 1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, dot, 0, Math.PI * 2);
    ctx.fillStyle = i < converted ? p.danger : p.accent;
    ctx.fill();
    ctx.restore();
  }
  drawLabel(ctx, 'A', flaskX + cellW, flaskTop - 12, p.accent);
  drawLabel(ctx, 'B', flaskX + flaskW - cellW, flaskTop - 12, p.danger);

  drawLabel(ctx, `elapsed ${describeSeconds(s.vars.elapsed)}`, vp.width * 0.5, vp.height * 0.94, p.muted);
}
