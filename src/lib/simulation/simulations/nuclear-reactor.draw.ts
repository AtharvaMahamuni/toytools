// Canvas scene for the Nuclear Reactor Simulator: a control rod sliding into a vessel over a
// fuel core whose glow tracks live power, with a temperature gauge on the side.
//
// The vertical layout reserves a band at the top for the rod caption / trip banner and a band at
// the bottom for the readout captions, because everything here is positioned as a fraction of the
// canvas: on a 390px phone the stage is only ~292px tall, and an earlier layout that hung the rod
// caption above the vessel put it at y = -4, off the canvas entirely. Captions live inside the
// bands, never in negative space above the geometry.
//
// Excluded from unit coverage; stub-context smoke test asserts no-throw.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import { AMBIENT_TEMP, TRIP_TEMP, effectiveRodPosition } from './nuclear-reactor';

/** Rod position where the rod's own reactivity is zero (see rodReactivityDollars). */
const CRITICAL_ROD_PERCENT = 50;

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

  const captionTop = vp.height * 0.06; // rod caption / trip banner
  const travelTop = vp.height * 0.13; // top of the rod's travel
  const vesselTop = vp.height * 0.24;
  const vesselBottom = vp.height * 0.86;
  const captionBottom = vp.height * 0.94; // live readout captions
  const vesselX = vp.width * 0.3;
  const vesselW = vp.width * 0.4;
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
  // White text stays readable across every core tint (they are mid-saturation through white-hot).
  drawLabel(ctx, `${power.toFixed(0)}% power`, vesselX + vesselW / 2, coreTop + coreH / 2, '#FFFFFF');

  // Control rod: a bar entering from the top, its depth set by the EFFECTIVE rod position
  // (fully inserted once tripped, even while the slider still shows the pre-trip value).
  const rodPos = effectiveRodPosition(s); // 0 = fully inserted, 100 = fully withdrawn
  const travelBottom = coreTop + coreH * 0.85;
  const rodBottom = travelBottom - (rodPos / 100) * (travelBottom - travelTop);
  const rodW = vesselW * 0.16;
  const rodX = vesselX + vesselW / 2 - rodW / 2;
  ctx.save();
  ctx.fillStyle = s.vars.tripped ? vp.palette.danger : vp.palette.muted;
  ctx.fillRect(rodX, travelTop, rodW, Math.max(0, rodBottom - travelTop));
  ctx.restore();

  // The critical mark: the height at which the rod's own reactivity crosses zero. Without it the
  // rod is a bar at an arbitrary height and nothing on the canvas says which side of the balance
  // point you are on, which is the single question the whole tool is about.
  const criticalY = travelBottom - (CRITICAL_ROD_PERCENT / 100) * (travelBottom - travelTop);
  ctx.save();
  ctx.strokeStyle = vp.palette.accent;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(vesselX + 4, criticalY);
  ctx.lineTo(rodX - 4, criticalY);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, 'critical', vesselX - 6, criticalY, vp.palette.accent, 'right');

  // Temperature gauge on the right: a vertical bar from ambient to a ceiling above the trip point,
  // filled to the live temperature.
  const gaugeCeil = TRIP_TEMP * 1.25;
  const gaugeX = vp.width * 0.78;
  const gaugeW = vp.width * 0.07;
  const tempFrac = Math.min(Math.max((s.vars.temp - AMBIENT_TEMP) / (gaugeCeil - AMBIENT_TEMP), 0), 1);
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(gaugeX, vesselTop, gaugeW, vesselH);
  ctx.fillStyle = powerColor(Math.min(s.vars.temp / TRIP_TEMP, 1) * 100);
  const fillH = vesselH * tempFrac;
  ctx.fillRect(gaugeX, vesselBottom - fillH, gaugeW, fillH);
  const tripY = vesselBottom - vesselH * ((TRIP_TEMP - AMBIENT_TEMP) / (gaugeCeil - AMBIENT_TEMP));
  ctx.strokeStyle = vp.palette.danger;
  ctx.beginPath();
  ctx.moveTo(gaugeX - 4, tripY);
  ctx.lineTo(gaugeX + gaugeW + 4, tripY);
  ctx.stroke();
  ctx.restore();
  // Name the red line rather than leaving it to be inferred from the trip that eventually fires.
  // Just "trip": the setpoint itself is one glance away on the live temperature readout.
  drawLabel(ctx, 'trip', gaugeX + gaugeW + 7, tripY, vp.palette.danger, 'left');
  drawLabel(ctx, `${s.vars.temp.toFixed(0)}°C`, gaugeX + gaugeW / 2, captionBottom, vp.palette.muted);

  if (s.vars.tripped) {
    ctx.save();
    ctx.fillStyle = vp.palette.danger;
    ctx.font = 'bold 16px "Geist Variable", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('REACTOR TRIP', vp.width / 2, captionTop);
    ctx.restore();
    // The way out belongs on the canvas: a trip is the one state with no obvious next move, and
    // Reset (the only other exit) would also throw away the operator's parameter setup.
    drawLabel(ctx, 'tap to restart', vesselX + vesselW / 2, captionBottom, vp.palette.muted);
  } else {
    drawLabel(ctx, 'control rod', rodX + rodW / 2, captionTop, vp.palette.muted);
  }
}
