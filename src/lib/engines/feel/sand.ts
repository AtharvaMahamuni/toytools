// Column pile. Cheap enough for a phone; intensity picks the column count.

export type SandIntensity = 'low' | 'medium' | 'high';

export const SAND_COLS: Record<SandIntensity, number> = {
  low: 24,
  medium: 40,
  high: 56,
};

export interface SandPile {
  cols: number;
  maxHeight: number;
  heights: Float32Array;
}

export function createPile(intensity: SandIntensity = 'medium', maxHeight = 48): SandPile {
  const cols = SAND_COLS[intensity] ?? SAND_COLS.medium;
  const pile: SandPile = { cols, maxHeight, heights: new Float32Array(cols) };
  resetPile(pile);
  return pile;
}

/** Centred mound. The reset craft restores this instead of reloading. */
export function resetPile(pile: SandPile): void {
  const { cols, maxHeight, heights } = pile;
  const mid = (cols - 1) / 2;
  const spread = cols / 6;
  for (let i = 0; i < cols; i++) {
    const x = (i - mid) / spread;
    heights[i] = Math.max(2, maxHeight * 0.72 * Math.exp(-x * x * 0.5));
  }
}

export function poke(pile: SandPile, col: number, radius = 3, amount = 2.4): void {
  const { cols, heights, maxHeight } = pile;
  const c = Math.max(0, Math.min(cols - 1, Math.round(col)));
  for (let i = Math.max(0, c - radius); i <= Math.min(cols - 1, c + radius); i++) {
    const w = 1 - Math.abs(i - c) / (radius + 1);
    heights[i] = Math.max(0.4, heights[i] - amount * w);
  }
  // Displaced grains land nearby rather than vanishing.
  const spill = amount * 0.35;
  const left = Math.max(0, c - radius - 2);
  const right = Math.min(cols - 1, c + radius + 2);
  heights[left] = Math.min(maxHeight, heights[left] + spill);
  heights[right] = Math.min(maxHeight, heights[right] + spill);
}

/** One rest pass: grains fall toward neighbours. Returns whether anything moved. */
export function settle(pile: SandPile, slope = 1.15): boolean {
  const { cols, heights, maxHeight } = pile;
  let moved = false;
  for (let i = 0; i < cols - 1; i++) {
    const diff = heights[i] - heights[i + 1];
    if (diff > slope) {
      const give = Math.min((diff - slope) * 0.5, heights[i] - 0.4);
      heights[i] -= give;
      heights[i + 1] = Math.min(maxHeight, heights[i + 1] + give);
      moved = true;
    } else if (diff < -slope) {
      const give = Math.min((-diff - slope) * 0.5, heights[i + 1] - 0.4);
      heights[i + 1] -= give;
      heights[i] = Math.min(maxHeight, heights[i] + give);
      moved = true;
    }
  }
  return moved;
}

export function colAt(x: number, width: number, cols: number): number {
  if (!(width > 0)) return 0;
  const t = Math.min(0.999, Math.max(0, x / width));
  return Math.floor(t * cols);
}

export const sandApi = {
  createPile,
  resetPile,
  poke,
  settle,
  colAt,
  SAND_COLS,
};
