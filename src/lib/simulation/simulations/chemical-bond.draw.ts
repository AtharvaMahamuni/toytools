// Canvas scene for the Chemical Bond Simulator: two atoms, the electron pair they share, and the
// continuum the bond sits on.
//
// The shared pair is drawn offset from the midpoint by the ionic character, so a nonpolar bond has
// it centred and caesium fluoride has it sitting all but on top of the fluorine. It breathes with a
// slow oscillation rather than sitting still, because a bonding pair is not a static dot.
//
// The band along the bottom is the whole argument of the tool: the conventional boundaries are
// drawn as thin marks on a continuous strip, not as walls between three boxes.
//
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import {
  IONIC_LIMIT,
  MAX_DELTA,
  NONPOLAR_LIMIT,
  chargeOffset,
  deltaEN,
  ionicCharacter,
  isDefined,
  isMisclassifiedNonmetalPair,
  polarityDirection,
} from './chemical-bond';
import { elementOf } from '../data/elements';

export function drawChemicalBond(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const p = vp.palette;
  const a = elementOf(Math.round(s.params.elementA));
  const b = elementOf(Math.round(s.params.elementB));
  const defined = isDefined(s);
  const delta = deltaEN(s);

  drawLabel(ctx, `${a.symbol}-${b.symbol}`, vp.width * 0.5, vp.height * 0.09, p.ink);

  // ── The two atoms and the pair between them ─────────────────────────────────────────────────
  const midY = vp.height * 0.44;
  const leftX = vp.width * 0.24;
  const rightX = vp.width * 0.76;
  const radius = Math.max(16, Math.min(vp.width * 0.09, vp.height * 0.17));

  for (const [x, element] of [[leftX, a], [rightX, b]] as const) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, midY, radius, 0, Math.PI * 2);
    ctx.fillStyle = p.surface;
    ctx.fill();
    ctx.strokeStyle = p.muted;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, element.symbol, x, midY, p.ink);
    drawLabel(ctx, defined ? String(element.electronegativity) : 'no value', x, midY + radius + 14, p.muted);
  }

  // The bond axis.
  ctx.save();
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftX + radius, midY);
  ctx.lineTo(rightX - radius, midY);
  ctx.stroke();
  ctx.restore();

  if (defined) {
    // The shared pair, offset toward the more electronegative atom and breathing gently.
    const breathe = Math.sin(s.vars.phase * Math.PI * 2) * ((rightX - leftX) * 0.012);
    const pairX = (leftX + rightX) / 2 + chargeOffset(s) * ((rightX - leftX) / 2 - radius) + breathe;
    ctx.save();
    ctx.fillStyle = p.accent;
    for (const dy of [-5, 5]) {
      ctx.beginPath();
      ctx.arc(pairX, midY + dy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Partial charges, but only once the bond is polar enough for them to mean anything.
    if (delta >= 0.1) {
      const negativeX = polarityDirection(s) > 0 ? rightX : leftX;
      const positiveX = polarityDirection(s) > 0 ? leftX : rightX;
      drawLabel(ctx, 'δ−', negativeX, midY - radius - 12, p.accent);
      drawLabel(ctx, 'δ+', positiveX, midY - radius - 12, p.muted);
    }
  }

  // ── The continuum ───────────────────────────────────────────────────────────────────────────
  const barX = vp.width * 0.1;
  const barW = vp.width * 0.8;
  const barY = vp.height * 0.78;
  const barH = Math.max(7, vp.height * 0.035);

  ctx.save();
  ctx.fillStyle = p.accentSubtle;
  ctx.fillRect(barX, barY, barW, barH);
  ctx.restore();

  // The conventional boundaries, drawn as thin marks ON the strip rather than as walls.
  ctx.save();
  ctx.strokeStyle = p.muted;
  ctx.lineWidth = 1;
  for (const limit of [NONPOLAR_LIMIT, IONIC_LIMIT]) {
    const x = barX + (limit / MAX_DELTA) * barW;
    ctx.beginPath();
    ctx.moveTo(x, barY - 3);
    ctx.lineTo(x, barY + barH + 3);
    ctx.stroke();
  }
  ctx.restore();
  drawLabel(ctx, String(NONPOLAR_LIMIT), barX + (NONPOLAR_LIMIT / MAX_DELTA) * barW, barY + barH + 13, p.muted);
  drawLabel(ctx, String(IONIC_LIMIT), barX + (IONIC_LIMIT / MAX_DELTA) * barW, barY + barH + 13, p.muted);

  if (defined) {
    const markerX = barX + (Math.min(delta, MAX_DELTA) / MAX_DELTA) * barW;
    ctx.save();
    ctx.fillStyle = isMisclassifiedNonmetalPair(s) ? p.danger : p.accent;
    ctx.fillRect(markerX - 2, barY - 5, 4, barH + 10);
    ctx.restore();
    drawLabel(ctx, `${ionicCharacter(s).toFixed(0)}% ionic`, vp.width * 0.5, vp.height * 0.68, p.ink);
  } else {
    drawLabel(ctx, 'no electronegativity value', vp.width * 0.5, vp.height * 0.68, p.muted);
  }

  drawLabel(ctx, 'covalent', barX, barY - 10, p.muted, 'left');
  drawLabel(ctx, 'ionic', barX + barW, barY - 10, p.muted, 'right');
}
