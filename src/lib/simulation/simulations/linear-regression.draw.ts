// Canvas scene for the Linear Regression Playground: axes 0..10, the points, the fitted line
// once two points exist, and the outlier (when the observation would fire) in the danger color.
// Colors come from vp.palette only. Excluded from unit coverage.

import type { SimState, Viewport } from '../types';
import { clear, drawGrid, drawLabel } from '../canvas';
import {
  WORLD,
  fitOf,
  formatEquation,
  outlierHit,
  pointCount,
  pointsOf,
  showsLine,
} from './linear-regression';

function toPx(wx: number, width: number): number {
  return (wx / WORLD) * width;
}

function toPy(wy: number, height: number): number {
  return ((WORLD - wy) / WORLD) * height;
}

/** Segment of y = mx + b that stays inside the world square, or null when it misses. */
function clipLine(slope: number, intercept: number): [number, number, number, number] | null {
  const hits: [number, number][] = [];
  const push = (x: number, y: number) => {
    if (x < -1e-6 || x > WORLD + 1e-6 || y < -1e-6 || y > WORLD + 1e-6) return;
    const cx = Math.min(WORLD, Math.max(0, x));
    const cy = Math.min(WORLD, Math.max(0, y));
    if (hits.some(([px, py]) => Math.hypot(px - cx, py - cy) < 1e-6)) return;
    hits.push([cx, cy]);
  };
  push(0, intercept);
  push(WORLD, slope * WORLD + intercept);
  if (Math.abs(slope) > 1e-12) {
    push(-intercept / slope, 0);
    push((WORLD - intercept) / slope, WORLD);
  }
  if (hits.length < 2) return null;
  return [hits[0][0], hits[0][1], hits[1][0], hits[1][1]];
}

export function drawLinearRegression(ctx: CanvasRenderingContext2D, s: SimState, vp: Viewport): void {
  clear(ctx, vp);
  drawGrid(ctx, vp);

  const xOf = (wx: number) => toPx(wx, vp.width);
  const yOf = (wy: number) => toPy(wy, vp.height);

  ctx.save();
  ctx.strokeStyle = vp.palette.muted;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(0));
  ctx.lineTo(xOf(WORLD), yOf(0));
  ctx.moveTo(xOf(0), yOf(0));
  ctx.lineTo(xOf(0), yOf(WORLD));
  for (let tick = 2; tick < WORLD; tick += 2) {
    ctx.moveTo(xOf(tick), yOf(0) - 4);
    ctx.lineTo(xOf(tick), yOf(0) + 4);
    ctx.moveTo(xOf(0) - 4, yOf(tick));
    ctx.lineTo(xOf(0) + 4, yOf(tick));
  }
  ctx.stroke();
  ctx.restore();

  drawLabel(ctx, '0', xOf(0) + 12, yOf(0) - 12, vp.palette.muted);
  drawLabel(ctx, '10', xOf(WORLD) - 14, yOf(0) - 12, vp.palette.muted);
  drawLabel(ctx, '10', xOf(0) + 14, yOf(WORLD) + 12, vp.palette.muted);

  const fit = fitOf(s);
  if (showsLine(s)) {
    const seg = clipLine(fit.slope, fit.intercept);
    if (seg) {
      ctx.save();
      ctx.strokeStyle = vp.palette.ink;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(xOf(seg[0]), yOf(seg[1]));
      ctx.lineTo(xOf(seg[2]), yOf(seg[3]));
      ctx.stroke();
      ctx.restore();
    }
  }

  const flagged = outlierHit(s);
  const pts = pointsOf(s);
  for (let i = 0; i < pts.length; i++) {
    const [px, py] = pts[i];
    const danger = flagged !== null && flagged.index === i;
    if (danger) {
      const yHat = Math.min(WORLD, Math.max(0, fit.slope * px + fit.intercept));
      ctx.save();
      ctx.strokeStyle = vp.palette.danger;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xOf(px), yOf(py));
      ctx.lineTo(xOf(px), yOf(yHat));
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = danger ? vp.palette.danger : vp.palette.accent;
    ctx.beginPath();
    ctx.arc(xOf(px), yOf(py), danger ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (danger) drawLabel(ctx, String(i + 1), xOf(px), yOf(py) - 16, vp.palette.danger);
  }

  const caption = showsLine(s) ? formatEquation(fit.slope, fit.intercept) : 'Two points are required';
  drawLabel(ctx, caption, 12, 16, vp.palette.ink, 'left');
  if (pointCount(s) === 0) {
    drawLabel(ctx, 'Tap to add a point', vp.width / 2, vp.height / 2, vp.palette.muted);
  }
}
