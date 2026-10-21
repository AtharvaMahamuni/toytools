import { describe, expect, it } from 'vitest';
import { createBoardGameApi } from './registry';
import { decide } from './rules/quantum-tic-tac-toe';
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
    expect(early.reason).toBe('Choose how the cycle collapses with the buttons under the board.');
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

  it('collapses a same-pair 2-cycle (X 0-1, then O 0-1) both ways', () => {
    const pending = play(api.create('quantum-tic-tac-toe'), mark(0, 1), mark(0, 1));
    const view = api.view(pending);
    expect(view.banner).toBe('X to choose the collapse. Pass the phone.');
    expect(view.choices.map(choice => choice.label).sort()).toEqual(['O2 in the top left', 'O2 in the top middle']);
    const results = [0, 1].map(resolution => api.apply(pending, { kind: 'collapse', resolution }));
    expect(results.every(result => result.ok)).toBe(true);
    const boards = results.map(result => result.state.cells.slice(0, 2));
    expect(boards).toContainEqual(['X', 'O']);
    expect(boards).toContainEqual(['O', 'X']);
    for (const result of results) {
      expect(result.state.outcome).toBeNull();
      expect(api.view(result.state).links).toEqual([]);
    }
  });

  /** A board with classical marks and exactly one open square, X to move. */
  function oneLeft(cells: ('X' | 'O' | null)[]): MatchState {
    const start = api.create('quantum-tic-tac-toe');
    const extra = start.extra as { subs: number[]; next: number };
    const subs = cells.map((cell, i) => (cell ? i + 1 : 0));
    return { ...start, cells, extra: { ...extra, subs, next: 9 } };
  }

  it('does not call a draw while a square is open: the last square takes a classical mark', () => {
    // X O X / X O O / O X _ : no line yet, the bottom right is open.
    const state = oneLeft(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null]);
    expect(state.outcome).toBeNull();
    expect(api.view(state).banner).toBe('X: tap the last square to finish.');
    // Marking two squares is impossible with one left, and a classical square is still refused.
    expect(api.apply(state, mark(8, 0)).reason).toBe('That square already has a classical mark.');
    const last = api.apply(state, mark(8, 8));
    expect(last.ok).toBe(true);
    expect(last.state.cells[8]).toBe('X');
    expect(last.state.outcome).toBe('draw');
    expect(last.state.score.draws).toBe(1);
  });

  it('lets the last square win instead of calling it a draw early', () => {
    // X X _ / O O X / O X O : X takes the top right for the top row.
    const state = oneLeft(['X', 'X', null, 'O', 'O', 'X', 'O', 'X', 'O']);
    const last = api.apply(state, mark(2, 2));
    expect(last.ok).toBe(true);
    expect(last.state.outcome).toBe('X');
    expect(api.view(last.state).banner).toBe('X wins.');
    expect(api.view(last.state).cells.filter(cell => cell.win).map(cell => cell.index)).toEqual([0, 1, 2]);
  });

  it('a non-cycle move with two squares open is never a draw', () => {
    // Seven classical, two open (7 and 8), no line: a quantum move is legal and the game goes on.
    const start = api.create('quantum-tic-tac-toe');
    const cells: ('X' | 'O' | null)[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', null, null];
    const extra = start.extra as { subs: number[] };
    const state = { ...start, cells, extra: { ...extra, subs: cells.map((c, i) => (c ? i + 1 : 0)), next: 8 } };
    const moved = api.apply(state, mark(7, 8));
    expect(moved.ok).toBe(true);
    expect(moved.state.outcome).toBeNull();
  });
});

describe('quantum tic tac toe mutant guards', () => {
  it('a collapse that leaves one square open is not a draw', () => {
    // _ _ _ / X O O / O X X : no line. A 2-cycle on the top left and top middle collapses and
    // leaves the top right open either way, with no line.
    const start = api.create('quantum-tic-tac-toe');
    const cells: ('X' | 'O' | null)[] = [null, null, null, 'X', 'O', 'O', 'O', 'X', 'X'];
    const extra = start.extra as { subs: number[] };
    const state = { ...start, cells, extra: { ...extra, subs: cells.map((c, i) => (c ? i : 0)), next: 10 } };
    const pending = play(state, mark(0, 1), mark(0, 1));
    for (const resolution of [0, 1]) {
      const done = api.apply(pending, { kind: 'collapse', resolution });
      expect(done.ok).toBe(true);
      expect(done.state.cells.filter(c => c === null)).toHaveLength(1);
      expect(done.state.outcome).toBeNull();
      expect(api.view(done.state).banner).toMatch(/: tap the last square to finish\.$/);
    }
  });

  it('the earlier line is the one whose latest mark is lower, not whose first mark is lower', () => {
    // X's top row was finished by move 9 but started at move 1; O's bottom row ran 6 to 8.
    // O's latest mark (8) is earlier than X's (9), so O takes the point. A min-based rule would say X.
    const cells: ('X' | 'O' | null)[] = ['X', 'X', 'X', null, null, null, 'O', 'O', 'O'];
    const subs = [1, 2, 9, 0, 0, 0, 6, 7, 8];
    expect(decide(cells, subs)).toEqual({ outcome: 'O', note: 'X has a later line.' });
    // And the mirror: X's latest (5) beats O's latest (8) even though O started at 3 and X at 4.
    expect(decide(cells, [4, 5, 5, 0, 0, 0, 3, 3, 8]).outcome).toBe('X');
  });

  it('banner hints at the last square, and one move there finishes', () => {
    const start = api.create('quantum-tic-tac-toe');
    const cells: ('X' | 'O' | null)[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    const extra = start.extra as { subs: number[] };
    const state = { ...start, cells, extra: { ...extra, subs: cells.map((c, i) => (c ? i + 1 : 0)), next: 9 } };
    expect(api.view(state).banner).toBe('X: tap the last square to finish.');
  });
});
