import { describe, expect, it } from 'vitest';
import { createBoardGameApi } from './registry';
import type { BoardMove, MatchState } from './types';

const api = createBoardGameApi();

function play(state: MatchState, ...moves: BoardMove[]): MatchState {
  return moves.reduce((current, move) => {
    const result = api.apply(current, move);
    expect(result.ok, result.reason).toBe(true);
    return result.state;
  }, state);
}

const mark = (a: number, b: number): BoardMove => ({ kind: 'mark', a, b });

describe('quantum tic tac toe', () => {
  it('names the two resolutions of a 3-cycle and undo restores them', () => {
    const pending = play(api.create('quantum-tic-tac-toe'), mark(0, 1), mark(1, 2), mark(2, 0));
    const view = api.view(pending);
    expect(view.banner).toBe('O to choose the collapse. Pass the phone.');
    expect(view.links).toEqual([
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 0 },
    ]);
    expect(view.choices.map(choice => choice.label).sort()).toEqual([
      'X3 in the top left',
      'X3 in the top right',
    ]);
    expect(view.cells[1].letter).toBe('X1 O2');

    const chosen = api.apply(pending, { kind: 'collapse', resolution: 0 });
    expect(chosen.ok).toBe(true);
    expect(api.view(chosen.state).choices).toEqual([]);
    expect(chosen.state.cells.filter(Boolean)).toHaveLength(3);

    const back = api.undo(chosen.state);
    expect(api.view(back).choices).toHaveLength(2);
    expect(api.view(back).links).toHaveLength(3);
    expect(back.cells.every(cell => cell === null)).toBe(true);
  });

  it('refuses a classical square before it complains about a repeated square', () => {
    const pending = play(api.create('quantum-tic-tac-toe'), mark(0, 1), mark(1, 2), mark(2, 0));
    const chosen = api.apply(pending, { kind: 'collapse', resolution: 0 }).state;
    const classical = chosen.cells.findIndex(cell => cell !== null);
    const refused = api.apply(chosen, mark(classical, classical));
    expect(refused.ok).toBe(false);
    expect(refused.reason).toBe('That square already has a classical mark.');
    expect(refused.state).toBe(chosen);

    const start = api.create('quantum-tic-tac-toe');
    const same = api.apply(start, mark(4, 4));
    expect(same.reason).toBe('A move marks two different squares.');
    expect(same.state).toBe(start);
  });

  it('keeps a pending collapse until a resolution is chosen', () => {
    const pending = play(api.create('quantum-tic-tac-toe'), mark(0, 1), mark(1, 2), mark(2, 0));
    const early = api.apply(pending, mark(3, 4));
    expect(early.reason).toBe('Choose how the cycle collapses.');
    expect(early.state).toBe(pending);
    const missing = api.apply(pending, { kind: 'collapse', resolution: 2 });
    expect(missing.reason).toBe('That collapse is not one of the two resolutions.');
    expect(missing.state).toBe(pending);
  });

  it('gives the point to the earlier line when one collapse makes both', () => {
    const pending = play(
      api.create('quantum-tic-tac-toe'),
      mark(0, 1),
      mark(8, 7),
      mark(1, 2),
      mark(7, 6),
      mark(2, 8),
      mark(6, 0),
    );
    expect(api.view(pending).banner).toBe('X to choose the collapse. Pass the phone.');
    const options = [0, 1].map(resolution => api.apply(pending, { kind: 'collapse', resolution }).state);
    const won = options.find(state => state.outcome === 'X');
    expect(won).toBeTruthy();
    expect(api.view(won!).banner).toBe('X wins. O has a later line.');
    expect(won!.score).toEqual({ X: 1, O: 0, draws: 0 });
    expect(won!.cells.slice(0, 3)).toEqual(['X', 'X', 'X']);
    expect(won!.cells.slice(6)).toEqual(['O', 'O', 'O']);
  });
});
