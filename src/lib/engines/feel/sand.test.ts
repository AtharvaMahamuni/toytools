import { describe, expect, it } from 'vitest';

import { colAt, createPile, poke, resetPile, settle } from './sand';

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
});
