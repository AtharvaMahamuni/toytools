// Canvas scene for the Nuclear Reactor Simulator: a control rod sliding into a vessel over a
// fuel core whose glow tracks live power, with a temperature gauge on the side. Excluded from
// unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import { AMBIENT_TEMP, TRIP_TEMP, effectiveRodPosition } from './nuclear-reactor';

/** Map relative power (0-300%) to a cool blue -> orange -> white-hot glow. Theme-invariant on
 *  purpose: power color is data, not chrome, and must read identically in light and dark mode. */
export function powerColor(percent: number): string {
  const p = Math.min(Math.max(percent, 0), 300);
  if (p <= 100) {
    const f = p / 100;
    const r = Math.round(43 + f * (214 - 43));
    const g = Math.round(94 + f * (120 - 94));
    const b = Math.round(190 + f * (40 - 190));
    return `rgb(${r}, ${g}, ${b})`;
  }
  const f = Math.min((p - 100) / 200, 1);
  const r = Math.round(214 + f * (255 - 214));
  const g = Math.round(120 + f * (255 - 120));
  const b = Math.round(40 + f * (255 - 40));
  return `rgb(${r}, ${g}, ${b})`;
}

export function drawNuclearReactor(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);

  const vesselX = vp.width * 0.3;
  const vesselW = vp.width * 0.4;
  const vesselTop = vp.height * 0.08;
  const vesselBottom = vp.height * 0.86;
  const vesselH = vesselBottom - vesselTop;

  // Vessel outline.
  ctx.save();
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(vesselX, vesselTop, vesselW, vesselH);
  ctx.restore();

  // Fuel core: the bottom third, tinted by live power.
  const coreTop = vesselTop + vesselH * 0.62;
  const coreH = vesselBottom - coreTop;
  const power = s.vars.n * 100;
  ctx.save();
  ctx.fillStyle = powerColor(power);
  ctx.fillRect(vesselX + 3, coreTop, vesselW - 6, coreH - 3);
  ctx.restore();
  drawLabel(ctx, `${power.toFixed(0)}% power`, vesselX + vesselW / 2, coreTop + coreH / 2, '#FFFFFF');

  // Control rod: a dark bar entering from the top, its depth set by the EFFECTIVE rod position
  // (forced fully in once tripped, even while the slider still shows the pre-trip value).
  const rodPos = effectiveRodPosition(s); // 0 = fully inserted, 100 = fully withdrawn
  const travelTop = vesselTop - vp.height * 0.06;
  const travelBottom = coreTop + coreH * 0.85;
  const rodBottom = travelBottom - (rodPos / 100) * (travelBottom - travelTop);
  const rodW = vesselW * 0.16;
  const rodX = vesselX + vesselW / 2 - rodW / 2;
  ctx.save();
  ctx.fillStyle = s.vars.tripped ? vp.palette.danger : vp.palette.muted;
  ctx.fillRect(rodX, travelTop, rodW, Math.max(0, rodBottom - travelTop));
  ctx.restore();

  // Temperature gauge on the right: a vertical bar from ambient to a fixed ceiling above the trip
  // point, filled to the live temperature.
  const gaugeCeil = TRIP_TEMP * 1.25;
  const gaugeX = vp.width * 0.8;
  const gaugeW = vp.width * 0.08;
  const gaugeTop = vesselTop;
  const gaugeBottom = vesselBottom;
  const tempFrac = Math.min(Math.max((s.vars.temp - AMBIENT_TEMP) / (gaugeCeil - AMBIENT_TEMP), 0), 1);
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(gaugeX, gaugeTop, gaugeW, gaugeBottom - gaugeTop);
  ctx.fillStyle = powerColor(Math.min(s.vars.temp / TRIP_TEMP, 1) * 100);
  const fillH = (gaugeBottom - gaugeTop) * tempFrac;
  ctx.fillRect(gaugeX, gaugeBottom - fillH, gaugeW, fillH);
  // Trip-limit tick.
  const tripY = gaugeBottom - (gaugeBottom - gaugeTop) * ((TRIP_TEMP - AMBIENT_TEMP) / (gaugeCeil - AMBIENT_TEMP));
  ctx.strokeStyle = vp.palette.danger;
  ctx.beginPath();
  ctx.moveTo(gaugeX - 4, tripY);
  ctx.lineTo(gaugeX + gaugeW + 4, tripY);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, `${s.vars.temp.toFixed(0)}°C`, gaugeX + gaugeW / 2, gaugeBottom + 14, vp.palette.muted);

  drawLabel(ctx, 'control rod', rodX + rodW / 2, travelTop - 10, vp.palette.muted);

  if (s.vars.tripped) {
    ctx.save();
    ctx.fillStyle = vp.palette.danger;
    ctx.font = 'bold 16px "Geist Variable", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('REACTOR TRIP', vp.width / 2, vesselTop - 18);
    ctx.restore();
  }
}
