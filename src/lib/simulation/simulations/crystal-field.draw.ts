// Canvas scene for the Crystal Field Splitting Simulator. Two panels side by side: the complex
// itself on the left, tinted with the colour its absorption band leaves behind, and the d-orbital
// splitting diagram on the right with the electrons drawn in as arrows.
//
// The diagram gap is drawn on a compressed scale rather than in proportion to the splitting: a
// linear map would put the d1 diagram off the top of an 8000 cm^-1 canvas and squash a 33000 cm^-1
// one into a hairline. The label always carries the real number, so the picture stays readable
// while the reading stays honest.
//
// Layout is banded: caption at the top, panels in the middle, colour caption at the bottom.
//
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawArrow, drawLabel } from '../canvas';
import {
  absorptionNm,
  colourFor,
  hasTransition,
  isTetrahedral,
  observedColour,
  occupancyOf,
  orbitalSets,
  setLabels,
  splittingCm,
} from './crystal-field';

/** Electrons in orbital `index` of a set holding `count` electrons across `orbitals` orbitals. */
export function electronsInSlot(count: number, orbitals: number, index: number): number {
  const singles = Math.min(count, orbitals) > index ? 1 : 0;
  const pairs = count - orbitals > index ? 1 : 0;
  return singles + pairs;
}

/** Half the drawn gap between the two levels, as a fraction of the panel height. Compressed. */
export function gapFraction(splitting: number): number {
  const t = Math.min(1, Math.max(0, splitting / 40000));
  return 0.09 + 0.21 * Math.sqrt(t);
}

function drawElectrons(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  slotW: number,
  electrons: number,
  color: string,
): void {
  const h = slotW * 0.55;
  if (electrons >= 1) drawArrow(ctx, x - slotW * 0.16, y + h, x - slotW * 0.16, y - h, color, 1.6);
  if (electrons >= 2) drawArrow(ctx, x + slotW * 0.16, y - h, x + slotW * 0.16, y + h, color, 1.6);
}

function drawLevel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  orbitals: number,
  electrons: number,
  slotW: number,
  ink: string,
): void {
  const gap = slotW * 1.35;
  const start = cx - ((orbitals - 1) * gap) / 2;
  for (let i = 0; i < orbitals; i++) {
    const x = start + i * gap;
    ctx.save();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - slotW / 2, y);
    ctx.lineTo(x + slotW / 2, y);
    ctx.stroke();
    ctx.restore();
    drawElectrons(ctx, x, y, slotW, electronsInSlot(electrons, orbitals, i), ink);
  }
}

function drawComplex(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  tetrahedral: boolean,
  fill: string,
  ink: string,
  muted: string,
): void {
  const angles = tetrahedral ? [90, 210, 330, 30] : [90, 270, 0, 180, 40, 220];
  ctx.save();
  ctx.strokeStyle = muted;
  ctx.lineWidth = 2;
  for (const deg of angles) {
    const rad = (deg * Math.PI) / 180;
    const lx = cx + Math.cos(rad) * radius;
    const ly = cy - Math.sin(rad) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(lx, ly, Math.max(5, radius * 0.16), 0, Math.PI * 2);
    ctx.fillStyle = muted;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(12, radius * 0.36), 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

export function drawCrystalField(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;
  const tet = isTetrahedral(s);
  const sets = orbitalSets(tet);
  const labels = setLabels(tet);
  const occ = occupancyOf(s);
  const delta = splittingCm(s);
  const colour = observedColour(s);

  // Left panel: the complex, filled with the colour the eye actually sees.
  const leftX = vp.width * 0.19;
  const midY = vp.height * 0.5;
  const complexR = Math.min(vp.width * 0.13, vp.height * 0.25);
  drawComplex(ctx, leftX, midY, complexR, tet, colour.hex, p.ink, p.muted);
  drawLabel(ctx, tet ? 'tetrahedral' : 'octahedral', leftX, midY + complexR + 16, p.muted);
  drawLabel(ctx, `looks ${colour.observed}`, leftX, vp.height * 0.93, p.ink);

  // Right panel: the splitting diagram.
  const rightX = vp.width * 0.63;
  const half = gapFraction(delta) * vp.height;
  const upperY = midY - half;
  const lowerY = midY + half;
  const slotW = Math.max(16, Math.min(vp.width * 0.055, vp.height * 0.1));

  // Barycentre: where the five orbitals sat before the ligands arrived.
  ctx.save();
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(rightX - vp.width * 0.2, midY);
  ctx.lineTo(rightX + vp.width * 0.2, midY);
  ctx.stroke();
  ctx.restore();

  drawLevel(ctx, rightX, upperY, sets.upper, occ.upper, slotW, p.ink);
  drawLevel(ctx, rightX, lowerY, sets.lower, occ.lower, slotW, p.ink);
  drawLabel(ctx, labels.upper, rightX - vp.width * 0.215, upperY, p.muted, 'right');
  drawLabel(ctx, labels.lower, rightX - vp.width * 0.215, lowerY, p.muted, 'right');

  // The splitting itself, measured between the two levels.
  const arrowX = rightX + vp.width * 0.15;
  ctx.save();
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(arrowX, upperY);
  ctx.lineTo(arrowX, lowerY);
  ctx.stroke();
  ctx.restore();
  // Centred above the arrow rather than beside it: a left-aligned label here ran past the right
  // edge of a 390px canvas once the splitting reached five digits.
  drawLabel(ctx, `Δ ${delta.toFixed(0)} cm⁻¹`, arrowX, upperY - 14, p.accent);

  // The absorption, animated: a photon of the absorbed colour arrives, then an electron climbs.
  if (hasTransition(s) && occ.lower > 0 && occ.upper < sets.upper * 2) {
    const phase = s.vars.phase;
    const absorbed = colourFor(absorptionNm(s));
    if (phase < 0.5) {
      const travel = phase / 0.5;
      const px = vp.width * 0.4 + travel * (rightX - vp.width * 0.42);
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, midY, 5, 0, Math.PI * 2);
      ctx.fillStyle = absorbed.observed === 'colourless' ? p.muted : absorbed.hex;
      ctx.fill();
      ctx.restore();
    } else if (phase < 0.8) {
      const climb = (phase - 0.5) / 0.3;
      const y = lowerY + (upperY - lowerY) * climb;
      drawArrow(ctx, rightX - slotW * 1.5, lowerY, rightX - slotW * 1.5, y, p.danger, 2);
    }
  }

  drawLabel(
    ctx,
    `d${Math.round(s.params.dElectrons)} · ${occ.unpaired} unpaired`,
    vp.width * 0.5,
    vp.height * 0.08,
    p.ink,
  );
}
