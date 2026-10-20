import { describe, expect, it } from 'vitest';
import { createBoardGameApi } from './registry';
import type { MatchState } from './types';

const api = createBoardGameApi();

function play(state: MatchState, ...indexes: number[]): MatchState {
  return indexes.reduce((current, index) => {
    const result = api.apply(current, index);
    expect(result.ok, result.reason).toBe(true);
    return result.state;
  }, state);
}

describe('tic-tac-toe', () => {
  it('starts with X to play and an empty score', () => {
    const view = api.view(api.create('tic-tac-toe'));
    expect(view.banner).toBe('X to play. Pass the phone.');
    expect(view.scoreText).toBe('X 0, O 0, draws 0');
    expect(view.cells).toHaveLength(9);
    expect(view.cells.every(cell => cell.shape === 'empty')).toBe(true);
    expect(view.canUndo).toBe(false);
  });

  it('refuses a second mark on the same square and leaves the turn unchanged', () => {
    const start = api.create('tic-tac-toe');
    const first = api.apply(start, 0);
    expect(first.ok).toBe(true);
    expect(first.state.cells[0]).toBe('X');
    expect(first.state.turn).toBe('O');

    const second = api.apply(first.state, 0);
    expect(second.ok).toBe(false);
    expect(second.reason).toBe('That square already has a mark.');
    expect(second.state).toBe(first.state);
    expect(second.state.cells.filter(Boolean)).toEqual(['X']);
    expect(second.state.turn).toBe('O');
    expect(start.cells.every(cell => cell === null)).toBe(true);
  });

  it('gives the win and the point to X on the top row, then undo takes both back', () => {
    const won = play(api.create('tic-tac-toe'), 0, 3, 1, 4, 2);
    expect(api.view(won).banner).toBe('X wins.');
    expect(won.score).toEqual({ X: 1, O: 0, draws: 0 });
    expect(won.cells.slice(0, 3)).toEqual(['X', 'X', 'X']);
    expect(api.view(won).cells.filter(cell => cell.win).map(cell => cell.index)).toEqual([0, 1, 2]);
    expect(api.view(won).cells[0]).toMatchObject({ shape: 'cross', letter: 'X' });
    expect(api.view(won).cells[3]).toMatchObject({ shape: 'ring', letter: 'O' });

    const undone = api.undo(won);
    expect(api.view(undone).banner).toBe('X to play. Pass the phone.');
    expect(undone.cells[2]).toBeNull();
    expect(undone.score).toEqual({ X: 0, O: 0, draws: 0 });
    expect(api.undo(api.undo(api.undo(api.undo(api.undo(undone))))).past).toHaveLength(0);
  });

  it('keeps the session score across rematch and drops the board', () => {
    const won = play(api.create('tic-tac-toe'), 0, 3, 1, 4, 2);
    const again = api.rematch(won);
    expect(again.score).toEqual({ X: 1, O: 0, draws: 0 });
    expect(again.cells.every(cell => cell === null)).toBe(true);
    expect(again.turn).toBe('X');
    expect(again.past).toHaveLength(0);
    expect(api.view(again).banner).toBe('X to play. Pass the phone.');
  });

  it('scores a draw and refuses another move until rematch', () => {
    const drawn = play(api.create('tic-tac-toe'), 0, 1, 2, 4, 3, 5, 7, 6, 8);
    expect(api.view(drawn).banner).toBe('Draw.');
    expect(drawn.score.draws).toBe(1);
    const extra = api.apply(drawn, 0);
    expect(extra.ok).toBe(false);
    expect(extra.reason).toBe('The match is over. Rematch to play again.');
    expect(extra.state).toBe(drawn);
  });

  it('rejects a square that is not on the board', () => {
    const start = api.create('tic-tac-toe');
    expect(api.apply(start, -1).ok).toBe(false);
    expect(api.apply(start, 9).ok).toBe(false);
    expect(api.apply(start, 1.5).ok).toBe(false);
  });

  it('restores a saved score onto a fresh board and ignores a broken one', () => {
    const saved = api.create('tic-tac-toe', { X: 4, O: 2, draws: 1 });
    expect(saved.score).toEqual({ X: 4, O: 2, draws: 1 });
    expect(api.view(saved).scoreText).toBe('X 4, O 2, draws 1');
    expect(api.create('tic-tac-toe', { X: -1, O: 0, draws: 0 }).score.X).toBe(0);
  });

  it('names an unknown board instead of throwing', () => {
    const missing = api.create('chess');
    expect(api.view(missing).banner).toBe('This board is not available.');
    expect(api.apply(missing, 0)).toMatchObject({ ok: false, state: missing });
    expect(api.rematch(missing)).toBe(missing);
  });

  it('undo of the opening move is a no-op once history is empty', () => {
    const start = api.create('tic-tac-toe');
    expect(api.undo(start)).toBe(start);
    const once = api.apply(start, 4).state;
    const back = api.undo(once);
    expect(back.cells[4]).toBeNull();
    expect(api.undo(back)).toBe(back);
  });
});
