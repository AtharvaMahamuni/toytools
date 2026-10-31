// Canvas for fraction bars and circles. Excluded from unit coverage.

import type { SimState, Viewport } from '../types';
import { clear, drawLabel } from '../canvas';
import {
  caption,
  circleView,
  clampedParts,
  fmtFraction,
  fmtParts,
  lengthOf,
  modeOf,
  partsOf,
  shownLength,
  sumOf,
  diffOf,
  wholesUsed,
  wholeSlots,
  fillOfWhole,
} from './fraction-bars';

interface Row {
  label: string;
  den: number;
  length: number;
}

function rowsFor(s: SimState): Row[] {
  const a = partsOf(s.params, 'A');
  const b = partsOf(s.params, 'B');
  const mode = modeOf(s.params.mode);
  const rows: Row[] = [{ label: fmtParts(a.n, a.d), den: a.d, length: shownLength(s, 'A') }];
  if (mode !== 'show') rows.push({ label: fmtParts(b.n, b.d), den: b.d, length: shownLength(s, 'B') });
  if (mode === 'add') {
    const sum = sumOf(a, b);
    rows.push({ label: fmtFraction(sum), den: Number(sum.d), length: lengthOf(Number(sum.n), Number(sum.d)) });
  } else if (mode === 'subtract') {
    const diff = diffOf(a, b);
    rows.push({
      label: fmtFraction(diff.fraction),
      den: Number(diff.fraction.d),
      length: lengthOf(Number(diff.fraction.n), Number(diff.fraction.d)),
    });
  }
  return rows;
}

function drawTicks(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, den: number, color: string): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < den; i++) {
    const tx = x + (w * i) / den;
    ctx.moveTo(tx, y);
    ctx.lineTo(tx, y + h);
  }
  ctx.stroke();
  ctx.restore();
}

function drawWhole(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, den: number, fill: number, vp: Viewport): void {
  ctx.save();
  ctx.fillStyle = vp.palette.surface;
  ctx.fillRect(x, y, w, h);
  const shaded = Math.min(1, Math.max(0, fill));
  ctx.fillStyle = vp.palette.accent;
  ctx.fillRect(x, y, w * shaded, h);
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
  drawTicks(ctx, x, y, w, h, den, vp.palette.ink);
}

function drawPie(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, den: number, fill: number, vp: Viewport): void {
  ctx.save();
  ctx.fillStyle = vp.palette.surface;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  const shaded = Math.min(1, Math.max(0, fill));
  if (shaded > 0) {
    ctx.fillStyle = vp.palette.accent;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + shaded * Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = vp.palette.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  for (let i = 0; i < den; i++) {
    const ang = -Math.PI / 2 + (i / den) * Math.PI * 2;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
  }
  ctx.stroke();
  ctx.restore();
}

export function drawFractionBars(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  const rows = rowsFor(s);
  drawLabel(ctx, caption(s), vp.width / 2, vp.height * 0.08, vp.palette.ink);

  const circles = circleView(s.params.view);
  rows.forEach((row, i) => {
    const y = vp.height * (0.24 + i * (0.7 / Math.max(rows.length, 1)));
    const label = row.label;
    if (circles) {
      const slots = wholeSlots(wholesUsed(row.length));
      const span = (slots[0]!.x1 - slots[0]!.x0) * vp.width;
      const r = Math.min(Math.min(vp.width, vp.height) * 0.12, span / 2);
      const cy = y + r * 0.2;
      slots.forEach((slot, k) => {
        drawPie(ctx, vp.width * (slot.x0 + slot.x1) / 2, cy, r, row.den, fillOfWhole(row.length, k), vp);
      });
      const mid = slots.length === 1 ? (slots[0]!.x0 + slots[0]!.x1) / 2 : 0.5;
      drawLabel(ctx, label, vp.width * mid, cy + r + 14, vp.palette.muted);
      return;
    }
    const h = Math.max(18, vp.height * 0.12);
    wholeSlots(wholesUsed(row.length)).forEach((slot, k) => {
      drawWhole(ctx, vp.width * slot.x0, y, vp.width * (slot.x1 - slot.x0), h, row.den, fillOfWhole(row.length, k), vp);
    });
    drawLabel(ctx, label, vp.width * 0.5, y + h + 12, vp.palette.muted);
  });
}
