// Canvas plumbing shared by every simulation: DPR-aware sizing, theme palette resolution,
// resize observation, and a few primitive draw helpers. Browser-glue module — excluded from
// unit coverage (vitest.config.ts), exercised by the Playwright physics suite instead.

import type { Palette, Viewport } from './types';

const PALETTE_VARS: Record<keyof Palette, [name: string, fallback: string]> = {
  ink: ['--color-text', '#1F1D1A'],
  muted: ['--color-text-muted', '#6E6961'],
  accent: ['--color-accent', '#2F6B4F'],
  accentSubtle: ['--color-accent-subtle', '#DFEBE4'],
  bg: ['--color-bg', '#FAF9F7'],
  surface: ['--color-surface', '#F4F2EE'],
  border: ['--color-border', '#E5E1DA'],
  danger: ['--color-danger', '#dc2626'],
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
