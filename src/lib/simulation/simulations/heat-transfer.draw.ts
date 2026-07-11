// Canvas scene for the Heat Transfer Simulator: two temperature-colored blocks joined by
// a conducting bridge, with flow particles drifting hot → cold at a rate set by ΔT.
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawArrow, drawLabel } from '../canvas';
import { EQUILIBRIUM_EPSILON } from './heat-transfer';

/** Map 0–100 °C to a cold-blue → hot-red color. Theme-invariant on purpose: temperature
 *  color is data, not chrome, and must read identically in light and dark mode. */
export function tempColor(tempC: number): string {
  const f = Math.min(Math.max(tempC / 100, 0), 1);
  const r = Math.round(43 + f * (214 - 43));
  const g = Math.round(94 + f * (69 - 94));
  const b = Math.round(190 + f * (52 - 190));
  return `rgb(${r}, ${g}, ${b})`;
}

export function drawHeatTransfer(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const blockW = vp.width * 0.26;
  const blockH = vp.height * 0.52;
  const blockY = vp.height * 0.16;
  const ax = vp.width * 0.12;
  const bx = vp.width * 0.62;
  const bridgeY = blockY + blockH / 2;

  // Conducting bridge.
  ctx.save();
  ctx.fillStyle = vp.palette.border;
  ctx.fillRect(ax + blockW, bridgeY - 9, bx - (ax + blockW), 18);
  ctx.restore();

  // Blocks, tinted by their live temperature.
  for (const [x, temp, label] of [
    [ax, s.vars.ta, 'A'],
    [bx, s.vars.tb, 'B'],
  ] as const) {
    ctx.save();
    ctx.fillStyle = tempColor(temp);
    ctx.fillRect(x, blockY, blockW, blockH);
    ctx.strokeStyle = vp.palette.ink;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, blockY, blockW, blockH);
    ctx.restore();
    // White text stays readable on every block tint (the tints are mid-saturation).
    drawLabel(ctx, `${label} · ${temp.toFixed(1)} °C`, x + blockW / 2, blockY + blockH / 2, '#FFFFFF');
  }

  // Flow particles across the bridge, hot → cold, density ∝ ΔT.
  const dT = s.vars.ta - s.vars.tb;
  if (Math.abs(dT) >= EQUILIBRIUM_EPSILON) {
    const dir = dT > 0 ? 1 : -1;
    const startX = dir > 0 ? ax + blockW : bx;
    const endX = dir > 0 ? bx : ax + blockW;
    const span = endX - startX;
    const count = Math.min(8, Math.max(2, Math.round(Math.abs(dT) / 12)));
    ctx.save();
    ctx.fillStyle = vp.palette.ink;
    for (let i = 0; i < count; i++) {
      // Particles cycle along the bridge; phase spreads them out and time drifts them.
      const phase = ((s.t * 0.35 * Math.abs(s.params.conductance) * 4 + i / count) % 1 + 1) % 1;
      const px = startX + phase * span;
      ctx.beginPath();
      ctx.arc(px, bridgeY + (i % 2 === 0 ? -3 : 3), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    const arrowY = blockY - 12;
    drawArrow(
      ctx,
      dir > 0 ? ax + blockW + 8 : bx - 8,
      arrowY,
      dir > 0 ? bx - 8 : ax + blockW + 8,
      arrowY,
      vp.palette.danger,
      2,
    );
    drawLabel(ctx, 'heat flow', (ax + blockW + bx) / 2, arrowY - 10, vp.palette.muted);
  } else {
    drawLabel(ctx, 'thermal equilibrium — no net flow', (ax + blockW + bx) / 2, blockY - 14, vp.palette.muted);
  }

  // Hotter/colder captions follow the live temperatures.
  if (Math.abs(dT) >= EQUILIBRIUM_EPSILON) {
    drawLabel(ctx, dT > 0 ? 'hotter' : 'colder', ax + blockW / 2, blockY + blockH + 16, vp.palette.muted);
    drawLabel(ctx, dT > 0 ? 'colder' : 'hotter', bx + blockW / 2, blockY + blockH + 16, vp.palette.muted);
  }
}
