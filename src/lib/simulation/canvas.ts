// Canvas plumbing shared by every simulation: DPR-aware sizing, theme palette resolution,
// resize observation, and a few primitive draw helpers. Browser-glue module — excluded from
// unit coverage (vitest.config.ts), exercised by the Playwright physics suite instead.

import type { Palette, Viewport } from './types';

const PALETTE_VARS: Record<keyof Palette, [name: string, fallback: string]> = {
  ink: ['--color-text', '#26251e'],
  muted: ['--color-text-muted', '#5a5852'],
  accent: ['--color-accent', '#f54e00'],
  accentSubtle: ['--color-accent-subtle', 'rgba(245, 78, 0, 0.12)'],
  bg: ['--color-bg', '#f7f7f4'],
  surface: ['--color-surface', '#ffffff'],
  border: ['--color-border', '#e6e5e0'],
  danger: ['--color-danger', '#cf2d56'],
};

/** Resolve the active theme's colors from the CSS custom properties (canvas can't use var()). */
export function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const palette = {} as Palette;
  for (const key of Object.keys(PALETTE_VARS) as (keyof Palette)[]) {
    const [name, fallback] = PALETTE_VARS[key];
    palette[key] = styles.getPropertyValue(name).trim() || fallback;
  }
  return palette;
}

/**
 * Size a canvas's backing store to its CSS width × devicePixelRatio and pre-scale the context,
 * so all draw code works in CSS pixels and stays crisp on high-DPI screens.
 * Returns null when the canvas is not laid out yet (zero width).
 */
export function sizeCanvas(
  canvas: HTMLCanvasElement,
  aspect: number,
  palette: Palette,
): { ctx: CanvasRenderingContext2D; viewport: Viewport } | null {
  const cssWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || 0;
  if (cssWidth <= 0) return null;
  const cssHeight = Math.max(1, Math.round(cssWidth / aspect));
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.height = `${cssHeight}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, viewport: { width: cssWidth, height: cssHeight, dpr, palette } };
}

/** Observe element size changes. Returns an unobserve function; no-ops where unsupported. */
export function observeResize(el: Element, onResize: () => void): () => void {
  if (typeof ResizeObserver === 'undefined') return () => {};
  let lastWidth = el.clientWidth;
  const ro = new ResizeObserver(() => {
    // Only react to real width changes — height mutations from our own sizing would loop.
    if (el.clientWidth !== lastWidth) {
      lastWidth = el.clientWidth;
      onResize();
    }
  });
  ro.observe(el);
  return () => ro.disconnect();
}

export function clear(ctx: CanvasRenderingContext2D, vp: Viewport): void {
  ctx.clearRect(0, 0, vp.width, vp.height);
  ctx.fillStyle = vp.palette.surface;
  ctx.fillRect(0, 0, vp.width, vp.height);
}

/** Faint square grid to give motion a spatial reference. */
export function drawGrid(ctx: CanvasRenderingContext2D, vp: Viewport, spacing = 40): void {
  ctx.save();
  ctx.strokeStyle = vp.palette.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = spacing; x < vp.width; x += spacing) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, vp.height);
  }
  for (let y = spacing; y < vp.height; y += spacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(vp.width, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Arrow from (x1,y1) to (x2,y2) — used for velocity/acceleration/heat-flow vectors. */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 2,
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;
  const head = Math.min(10, len * 0.35);
  const angle = Math.atan2(dy, dx);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - 0.45), y2 - head * Math.sin(angle - 0.45));
  ctx.lineTo(x2 - head * Math.cos(angle + 0.45), y2 - head * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Small annotation label in the house sans stack. */
export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign = 'center',
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = '12px "Geist Variable", system-ui, sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** Interactive affordance halo ring around a draggable target (e.g. bob, mass block, handle). */
export function drawAffordanceHalo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  isHeld = false,
): void {
  ctx.save();
  if (isHeld) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/** Angle sector arc with degrees annotation label. */
export function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  label: string,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle, startAngle > endAngle);
  ctx.stroke();
  const midAngle = (startAngle + endAngle) / 2;
  const lx = cx + (radius + 12) * Math.cos(midAngle);
  const ly = cy + (radius + 12) * Math.sin(midAngle);
  drawLabel(ctx, label, lx, ly, color);
  ctx.restore();
}

/** Tactile grip ridges for draggable handles (e.g. gas pistons, slider blocks). */
export function drawGripRidges(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  for (const dx of [-3, 0, 3]) {
    ctx.beginPath();
    ctx.moveTo(x + dx, y - height / 2);
    ctx.lineTo(x + dx, y + height / 2);
    ctx.stroke();
  }
  ctx.restore();
}
