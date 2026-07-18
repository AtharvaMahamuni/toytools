// Canvas scene for the Probability Lab: the current outcome (coin face or die number), the running
// tally as a proportion bar with the theoretical mark, and the headline counts. Excluded from unit
// coverage; the stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawGrid, drawLabel } from '../canvas';
import { empirical, theoretical } from './probability';

export function drawProbability(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const sides = s.params.sides;
  const last = s.vars.last;
  const cx = vp.width * 0.26;
  const cy = vp.height * 0.44;
  const R = Math.min(vp.width, vp.height) * 0.2;

  // The current outcome: a coin (2 sides) or a die tile showing the face number.
  ctx.save();
  if (sides === 2) {
    ctx.fillStyle = last === 1 ? vp.palette.accent : vp.palette.surface;
    ctx.strokeStyle = vp.palette.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = last === 1 ? vp.palette.bg : vp.palette.ink;
    ctx.font = `bold ${Math.round(R * 0.9)}px "Geist Variable", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(last === 0 ? '?' : last === 1 ? 'H' : 'T', cx, cy + 2);
  } else {
    const half = R;
    ctx.fillStyle = last === 1 ? vp.palette.accent : vp.palette.surface;
    ctx.strokeStyle = vp.palette.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx - half, cy - half, half * 2, half * 2, R * 0.2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = last === 1 ? vp.palette.bg : vp.palette.ink;
    ctx.font = `bold ${Math.round(R * 0.9)}px "Geist Variable", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(last === 0 ? '?' : String(last), cx, cy + 2);
  }
  ctx.restore();
  drawLabel(
    ctx,
    last === 0 ? 'no trials yet' : last === 1 ? 'face 1: success' : `face ${sides === 2 ? '2 (tails)' : last}`,
    cx,
    cy + R + 18,
    vp.palette.muted,
  );

  // Headline counts.
  const rx = vp.width * 0.62;
  ctx.save();
  ctx.fillStyle = vp.palette.ink;
  ctx.font = `600 ${Math.round(vp.height * 0.09)}px "Geist Mono Variable", ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${s.vars.successes} / ${s.vars.trials}`, rx, vp.height * 0.3);
  ctx.restore();
  drawLabel(ctx, 'face 1 successes / trials', rx, vp.height * 0.3 + vp.height * 0.08, vp.palette.muted);

  // Proportion bar: the empirical share of face 1 against the theoretical mark.
  const barX = vp.width * 0.44;
  const barW = vp.width * 0.5;
  const barY = vp.height * 0.55;
  const barH = Math.max(18, vp.height * 0.07);
  const emp = empirical(s);
  const theo = theoretical(s);
  const span = Math.min(1, 3 / sides); // match the graph's adaptive range so the bar stays readable
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.strokeRect(barX, barY, barW, barH);
  ctx.fillStyle = vp.palette.accent;
  ctx.fillRect(barX, barY, Math.min(1, emp / span) * barW, barH);
  // Theoretical mark.
  const tx = barX + Math.min(1, theo / span) * barW;
  ctx.strokeStyle = vp.palette.danger;
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx, barY - 8);
  ctx.lineTo(tx, barY + barH + 8);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, `empirical ${emp.toFixed(3)}`, barX, barY + barH + 16, vp.palette.accent, 'left');
  drawLabel(ctx, `theoretical ${theo.toFixed(3)}`, tx, barY - 16, vp.palette.danger);
}
