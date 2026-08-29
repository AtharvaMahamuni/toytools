// Canvas scene for the Newman Projection Simulator: the standard organic-chemistry projection,
// looking straight down the carbon-carbon bond. The front carbon is the point where three bonds
// meet; the back carbon is the circle behind it, and its three bonds start at the circumference.
// That is the whole convention, and drawing it literally is what makes the picture teachable.
//
// The angle drawn is the set dihedral plus the current thermal libration, so the molecule shimmers
// around its conformer instead of standing frozen. A clash marker appears wherever a front bond and
// a back bond line up, because "eclipsed" is otherwise hard to see at a glance on a phone.
//
// Layout is banded like the other simulations: a caption band at the top, the projection in the
// middle, a strain bar at the bottom. Nothing is positioned above the canvas.
//
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import {
  displayAngle,
  highestBarrier,
  offsetFromEclipsed,
  sizeFraction,
  strainAt,
  wrapSigned,
} from './newman-projection';

/** Chemical angle (degrees, zero pointing up, increasing clockwise on screen) to a canvas point. */
function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

/** Name of the conformer at a dihedral angle, for the caption. */
export function conformerName(deg: number): string {
  const off = offsetFromEclipsed(deg);
  const syn = Math.abs(wrapSigned(deg)) <= 10;
  if (off <= 10) return syn ? 'Fully eclipsed' : 'Eclipsed';
  if (Math.abs(off - 60) <= 10) return Math.abs(wrapSigned(deg - 180)) <= 12 ? 'Anti' : 'Gauche';
  return 'Skew';
}

function drawGroup(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  ink: string,
  label: string,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, label, x, y, ink);
}

export function drawNewmanProjection(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;

  const b = sizeFraction(s.params.size);
  const phi = displayAngle(s);
  const cx = vp.width * 0.5;
  const cy = vp.height * 0.5;
  // The projection is sized from the VERTICAL budget, not the width. Its tallest point is the top
  // substituent, which is outer + the big group's own radius above the centre, and that has to stay
  // below the caption band: an earlier width-derived radius put the top group at y = -6 on a 390px
  // phone, drawn off the canvas entirely. 1.72 is the same sum expressed as a multiple of `ring`.
  const ring = Math.min(vp.width * 0.2, (vp.height * 0.34) / 1.72);
  const outer = ring * 1.4;
  const groupR = Math.max(9, ring * 0.2);
  const bigR = groupR * (0.85 + 0.6 * b);
  const frontAngles = [0, 120, 240];
  const backAngles = [phi, phi + 120, phi + 240];

  // Caption band: which conformer this is, and the angle that makes it one.
  drawLabel(ctx, `${conformerName(s.params.dihedral)} · ${s.params.dihedral.toFixed(0)}°`, cx, vp.height * 0.08, p.ink);

  // Back carbon's bonds first, so the ring paints over their inner ends.
  ctx.save();
  ctx.strokeStyle = p.muted;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const a of backAngles) {
    const from = polar(cx, cy, ring * 0.98, a);
    const to = polar(cx, cy, outer, a);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  ctx.restore();

  // The back carbon itself: the circle the whole convention rests on.
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, ring, 0, Math.PI * 2);
  ctx.fillStyle = p.surface;
  ctx.fill();
  ctx.strokeStyle = p.muted;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Front carbon's bonds: three lines meeting at a point, drawn over the ring.
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  for (const a of frontAngles) {
    const to = polar(cx, cy, outer, a);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  ctx.restore();

  // Clash markers wherever a front bond and a back bond overlap.
  ctx.save();
  ctx.strokeStyle = p.danger;
  ctx.lineWidth = 2;
  for (const f of frontAngles) {
    for (const bk of backAngles) {
      if (Math.abs(wrapSigned(bk - f)) > 12) continue;
      const at = polar(cx, cy, outer * 0.72, f);
      ctx.beginPath();
      ctx.arc(at.x, at.y, groupR * 0.62, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Substituents. Index 0 is the large group on each carbon; the rest are hydrogens.
  const bigLabel = b === 0 ? 'H' : 'R';
  for (let i = 0; i < 3; i++) {
    const at = polar(cx, cy, outer, backAngles[i]);
    const r = i === 0 ? bigR : groupR;
    drawGroup(ctx, at.x, at.y, r, p.ink, p.bg, i === 0 ? bigLabel : 'H');
  }
  for (let i = 0; i < 3; i++) {
    const at = polar(cx, cy, outer, frontAngles[i]);
    const r = i === 0 ? bigR : groupR;
    drawGroup(ctx, at.x, at.y, r, i === 0 ? p.accent : p.muted, p.bg, i === 0 ? bigLabel : 'H');
  }

  // The front carbon's vertex, painted last so no bond end shows through it.
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = p.ink;
  ctx.fill();
  ctx.restore();

  // The dihedral itself, swept from the front large group round to the back one.
  ctx.save();
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, ring * 0.55, -Math.PI / 2, -Math.PI / 2 + (phi * Math.PI) / 180);
  ctx.stroke();
  ctx.restore();

  // Strain bar: where this conformer sits between anti (zero) and the tallest barrier.
  const barrier = highestBarrier(b);
  const strain = strainAt(s.params.dihedral, b);
  const barX = vp.width * 0.12;
  const barW = vp.width * 0.76;
  const barY = vp.height * 0.9;
  const barH = Math.max(6, vp.height * 0.022);
  ctx.save();
  ctx.fillStyle = p.accentSubtle;
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = strain > barrier * 0.75 ? p.danger : p.accent;
  ctx.fillRect(barX, barY, barW * Math.min(1, barrier > 0 ? strain / barrier : 0), barH);
  ctx.restore();
  drawLabel(ctx, `${strain.toFixed(1)} kJ/mol`, barX, barY - barH, p.ink, 'left');
  drawLabel(ctx, `barrier ${barrier.toFixed(1)}`, barX + barW, barY - barH, p.muted, 'right');
}
