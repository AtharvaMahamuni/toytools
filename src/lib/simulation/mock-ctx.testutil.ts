// Shared test helper: a minimal CanvasRenderingContext2D stand-in for happy-dom (which
// returns null from getContext('2d')). It records nothing and returns sane values so the
// pure draw/graph routines run to completion. Excluded from coverage (see vitest.config.ts).

export function makeMockCtx(): CanvasRenderingContext2D {
  const noop = () => undefined;
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_t, prop) {
      if (prop === 'measureText') return () => ({ width: 24 }) as TextMetrics;
      if (prop === 'canvas') return undefined;
      return noop;
    },
    set: () => true,
  };
  return new Proxy({}, handler) as unknown as CanvasRenderingContext2D;
}

/** Install a mock 2D context + a fixed layout size on a canvas so sizeCanvas() succeeds. */
export function primeCanvas(canvas: HTMLCanvasElement, cssWidth = 640): void {
  (canvas as unknown as { getContext: () => CanvasRenderingContext2D }).getContext = makeMockCtx as unknown as () => CanvasRenderingContext2D;
  const ctx = makeMockCtx();
  (canvas as unknown as { getContext: () => CanvasRenderingContext2D }).getContext = () => ctx;
  Object.defineProperty(canvas, 'clientWidth', { value: cssWidth, configurable: true });
}
