// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clear,
  drawAffordanceHalo,
  drawAngleArc,
  drawArrow,
  drawGrid,
  drawGripRidges,
  drawLabel,
  observeResize,
  readPalette,
  sizeCanvas,
} from './canvas';
import { makeMockCtx, primeCanvas } from './mock-ctx.testutil';
import type { Viewport } from './types';

const viewport = (): Viewport => ({
  width: 640,
  height: 360,
  dpr: 2,
  palette: {
    ink: '#26251e',
    muted: '#5a5852',
    accent: '#f54e00',
    accentSubtle: 'rgba(245, 78, 0, 0.12)',
    bg: '#f7f7f4',
    surface: '#ffffff',
    border: '#e6e5e0',
    danger: '#cf2d56',
  },
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('readPalette', () => {
  it('falls back to the built-in colours when custom properties are unset', () => {
    // happy-dom's getComputedStyle returns empty strings for our --color-* vars.
    const palette = readPalette();
    expect(palette.accent).toBe('#f54e00');
    expect(palette.ink).toBe('#26251e');
    expect(palette.danger).toBe('#cf2d56');
  });
});

describe('sizeCanvas', () => {
  it('scales the backing store by DPR and pre-scales the context', () => {
    vi.stubGlobal('devicePixelRatio', 2);
    const canvas = document.createElement('canvas');
    primeCanvas(canvas, 600);
    const result = sizeCanvas(canvas, 2, viewport().palette);
    expect(result).not.toBeNull();
    expect(canvas.width).toBe(1200); // 600 css × dpr 2
    expect(canvas.height).toBe(600); // 300 css (600/2) × dpr 2
    expect(result!.viewport.width).toBe(600);
    expect(result!.viewport.height).toBe(300);
    expect(result!.viewport.dpr).toBe(2);
  });

  it('clamps DPR to 3 for very high-density screens', () => {
    vi.stubGlobal('devicePixelRatio', 8);
    const canvas = document.createElement('canvas');
    primeCanvas(canvas, 400);
    const result = sizeCanvas(canvas, 1, viewport().palette);
    expect(result!.viewport.dpr).toBe(3);
    expect(canvas.width).toBe(1200); // 400 × 3
  });

  it('returns null when the canvas has no layout width yet', () => {
    const canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 0, configurable: true });
    expect(sizeCanvas(canvas, 2, viewport().palette)).toBeNull();
  });

  it('returns null when a 2D context is unavailable', () => {
    const canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 500, configurable: true });
    (canvas as unknown as { getContext: () => null }).getContext = () => null;
    expect(sizeCanvas(canvas, 2, viewport().palette)).toBeNull();
  });

  it('falls back to the parent width when the canvas itself reports zero', () => {
    vi.stubGlobal('devicePixelRatio', 1);
    const parent = document.createElement('div');
    Object.defineProperty(parent, 'clientWidth', { value: 800, configurable: true });
    const canvas = document.createElement('canvas');
    parent.appendChild(canvas);
    Object.defineProperty(canvas, 'clientWidth', { value: 0, configurable: true });
    const ctx = makeMockCtx();
    (canvas as unknown as { getContext: () => CanvasRenderingContext2D }).getContext = () => ctx;
    const result = sizeCanvas(canvas, 2, viewport().palette);
    expect(result!.viewport.width).toBe(800);
  });
});

describe('observeResize', () => {
  it('invokes the callback only when the observed width actually changes', () => {
    let trigger: (() => void) | null = null;
    let observed = false;
    class FakeRO {
      constructor(private cb: () => void) {
        trigger = () => this.cb();
      }
      observe() {
        observed = true;
      }
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', FakeRO as unknown as typeof ResizeObserver);
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientWidth', { value: 300, configurable: true });
    const onResize = vi.fn();
    const stop = observeResize(el, onResize);
    expect(observed).toBe(true);

    trigger!(); // same width → ignored
    expect(onResize).not.toHaveBeenCalled();

    Object.defineProperty(el, 'clientWidth', { value: 420, configurable: true });
    trigger!(); // changed width → fires
    expect(onResize).toHaveBeenCalledTimes(1);
    stop();
  });

  it('no-ops safely where ResizeObserver is unsupported', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const stop = observeResize(document.createElement('div'), vi.fn());
    expect(typeof stop).toBe('function');
    expect(() => stop()).not.toThrow();
  });
});

describe('primitive draws run against a mock context', () => {
  it('clear, grid, arrow, label, halo, arc, and grip complete without throwing', () => {
    const ctx = makeMockCtx();
    const vp = viewport();
    expect(() => clear(ctx, vp)).not.toThrow();
    expect(() => drawGrid(ctx, vp, 50)).not.toThrow();
    expect(() => drawLabel(ctx, 'hi', 10, 10, '#000', 'left')).not.toThrow();
    // Normal arrow.
    expect(() => drawArrow(ctx, 0, 0, 40, 0, '#000', 3)).not.toThrow();
    // Degenerate (zero-length) arrow is skipped early — still no throw.
    expect(() => drawArrow(ctx, 5, 5, 5, 5, '#000')).not.toThrow();
    // Affordance halo (idle and held)
    expect(() => drawAffordanceHalo(ctx, 100, 100, 15, '#f54e00', false)).not.toThrow();
    expect(() => drawAffordanceHalo(ctx, 100, 100, 15, '#f54e00', true)).not.toThrow();
    // Angle arc
    expect(() => drawAngleArc(ctx, 100, 100, 30, 0, Math.PI / 4, '45°', '#f54e00')).not.toThrow();
    // Grip ridges
    expect(() => drawGripRidges(ctx, 100, 100, 20, '#f54e00')).not.toThrow();
  });
});
