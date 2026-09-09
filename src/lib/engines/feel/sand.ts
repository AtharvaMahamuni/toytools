// Column pile. Cheap enough for a phone; intensity picks the column count.

export type SandIntensity = 'low' | 'medium' | 'high';

export const SAND_COLS: Record<SandIntensity, number> = {
  low: 24,
  medium: 40,
  high: 56,
};

/** Peak column height. Taller than the old 48 so a mound still has range above the tray. */
export const SAND_MAX_HEIGHT = 56;
/** Packed-tray floor. Flattening used to drain to 0.4, which read as an empty stage. */
export const SAND_FLOOR = 10;
/** Reset mound peak as a fraction of maxHeight. */
export const SAND_MOUND = 0.88;

export interface SandPile {
  cols: number;
  maxHeight: number;
  heights: Float32Array;
}

function trayFloor(maxHeight: number): number {
  return Math.min(maxHeight, SAND_FLOOR);
}

export function createPile(intensity: SandIntensity = 'medium', maxHeight = SAND_MAX_HEIGHT): SandPile {
  const cols = SAND_COLS[intensity] ?? SAND_COLS.medium;
  const pile: SandPile = { cols, maxHeight, heights: new Float32Array(cols) };
  resetPile(pile);
  return pile;
}

/** Centred mound on a packed tray. The reset craft restores this instead of reloading. */
export function resetPile(pile: SandPile): void {
  const { cols, maxHeight, heights } = pile;
  const mid = (cols - 1) / 2;
  const spread = cols / 6;
  const peak = maxHeight * SAND_MOUND;
  const floor = trayFloor(maxHeight);
  for (let i = 0; i < cols; i++) {
    const x = (i - mid) / spread;
    heights[i] = Math.max(floor, peak * Math.exp(-x * x * 0.5));
  }
}

export function poke(pile: SandPile, col: number, radius = 3, amount = 2.4): void {
  const { cols, heights, maxHeight } = pile;
  const floor = trayFloor(maxHeight);
  const c = Math.max(0, Math.min(cols - 1, Math.round(col)));
  let removed = 0;
  for (let i = Math.max(0, c - radius); i <= Math.min(cols - 1, c + radius); i++) {
    const w = 1 - Math.abs(i - c) / (radius + 1);
    const next = Math.max(floor, heights[i] - amount * w);
    removed += heights[i] - next;
    heights[i] = next;
  }
  if (!(removed > 0)) return;
  // Displaced grains land nearby rather than vanishing, so a flatten stays a slab.
  const left = Math.max(0, c - radius - 2);
  const right = Math.min(cols - 1, c + radius + 2);
  const half = removed / 2;
  heights[left] = Math.min(maxHeight, heights[left] + half);
  heights[right] = Math.min(maxHeight, heights[right] + half);
}

export const SAND_SLOPE = 1.15;
/** How hard a ±1 tilt pushes grains downhill. */
export const SAND_TILT_GRAVITY = 2.2;

/** One rest pass: grains fall toward neighbours. `tiltX` -1..1 pours left/right. */
export function settle(pile: SandPile, slope = SAND_SLOPE, tiltX = 0): boolean {
  const { cols, heights, maxHeight } = pile;
  const floor = trayFloor(maxHeight);
  const gravity = Math.max(-2.4, Math.min(2.4, tiltX * SAND_TILT_GRAVITY));
  let moved = false;
  for (let i = 0; i < cols - 1; i++) {
    const drive = heights[i] - heights[i + 1] + gravity;
    if (drive > slope) {
      const room = maxHeight - heights[i + 1];
      const give = Math.min((drive - slope) * 0.45, heights[i] - floor, room);
      if (give > 0) {
        heights[i] -= give;
        heights[i + 1] += give;
        moved = true;
      }
    } else if (drive < -slope) {
      const room = maxHeight - heights[i];
      const give = Math.min((-drive - slope) * 0.45, heights[i + 1] - floor, room);
      if (give > 0) {
        heights[i + 1] -= give;
        heights[i] += give;
        moved = true;
      }
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
  SAND_MAX_HEIGHT,
  SAND_FLOOR,
  SAND_MOUND,
  SAND_SLOPE,
};
