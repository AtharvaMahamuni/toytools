import { describe, expect, it } from 'vitest';

import { colAt, createPile, poke, resetPile, SAND_FLOOR, settle } from './sand';

describe('kinetic sand pile', () => {
  it('opens as a centred mound and reset restores it', () => {
    const pile = createPile('low');
    const mid = Math.floor(pile.cols / 2);
    expect(pile.heights[mid]).toBeGreaterThan(pile.heights[0]);
    poke(pile, mid, 4, 8);
    expect(pile.heights[mid]).toBeLessThan(createPile('low').heights[mid]);
    resetPile(pile);
    const fresh = createPile('low');
    expect(pile.heights[mid]).toBeCloseTo(fresh.heights[mid], 5);
  });

  it('settles a steep pile toward rest', () => {
    const pile = createPile('low');
    pile.heights.fill(4);
    pile.heights[2] = 40;
    let moved = false;
    for (let i = 0; i < 40; i++) moved = settle(pile) || moved;
    expect(moved).toBe(true);
    expect(pile.heights[2]).toBeLessThan(40);
  });

  it('maps a pointer x onto a column', () => {
    expect(colAt(0, 100, 10)).toBe(0);
    expect(colAt(99, 100, 10)).toBe(9);
  });

  it('pours downhill when the phone tilts and stays put when level', () => {
    const flat = createPile('low');
    flat.heights.fill(22);
    expect(settle(flat)).toBe(false);
    const pile = createPile('low');
    pile.heights.fill(22);
    for (let i = 0; i < 40; i++) settle(pile, 1.15, 1);
    const left = pile.heights.slice(0, 6).reduce((sum, h) => sum + h, 0);
    const right = pile.heights.slice(-6).reduce((sum, h) => sum + h, 0);
    expect(right).toBeGreaterThan(left);
  });

  it('keeps a packed tray when flattened instead of draining to empty', () => {
    const pile = createPile('low');
    const before = pile.heights.reduce((sum, h) => sum + h, 0);
    poke(pile, Math.floor(pile.cols / 2));
    const after = pile.heights.reduce((sum, h) => sum + h, 0);
    expect(after).toBeCloseTo(before, 4);
    for (let i = 0; i < pile.cols; i++) {
      for (let k = 0; k < 10; k++) poke(pile, i, 4, 8);
    }
    for (let s = 0; s < 80; s++) settle(pile);
    let sum = 0;
    for (let i = 0; i < pile.cols; i++) {
      expect(pile.heights[i]).toBeGreaterThanOrEqual(SAND_FLOOR);
      sum += pile.heights[i];
    }
    expect(sum / pile.cols).toBeGreaterThan(SAND_FLOOR * 1.6);
  });
});
