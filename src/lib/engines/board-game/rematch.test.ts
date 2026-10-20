import { describe, expect, it } from 'vitest';
import { createBoardGameApi, RULES } from './registry';

const api = createBoardGameApi();

describe('rematch and reset on every board', () => {
  for (const id of Object.keys(RULES)) {
    it(`${id}: rematch alternates the opener and keeps the score; reset zeroes it`, () => {
      const start = api.create(id);
      expect(start.turn).toBe('X');
      expect(start.starter).toBe('X');
      const scored = { ...start, score: { X: 2, O: 1, draws: 1 } };
      const second = api.rematch(scored);
      expect(second.starter).toBe('O');
      expect(second.turn).toBe('O');
      expect(second.score).toEqual({ X: 2, O: 1, draws: 1 });
      expect(second.past).toHaveLength(0);
      expect(api.view(second).banner.startsWith('O ')).toBe(true);
      const third = api.rematch(second);
      expect(third.turn).toBe('X');
      const reset = api.resetScore(second);
      expect(reset.score).toEqual({ X: 0, O: 0, draws: 0 });
      expect(reset.turn).toBe('O');
      expect(api.view(reset).canUndo).toBe(false);
    });
  }
});
