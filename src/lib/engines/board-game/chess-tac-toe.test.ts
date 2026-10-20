import { describe, expect, it } from 'vitest';
import { createBoardGameApi } from './registry';
import { pawnDirection, pawnTargets } from './rules/chess-tac-toe';
import type { BoardMove, MatchState } from './types';

const api = createBoardGameApi();

function play(state: MatchState, ...moves: BoardMove[]): MatchState {
  return moves.reduce((current, move) => {
    const result = api.apply(current, move);
    expect(result.ok, result.reason).toBe(true);
    return result.state;
  }, state);
}

const place = (piece: string, index: number): BoardMove => ({ kind: 'place', piece, index });
const slide = (from: number, to: number): BoardMove => ({ kind: 'slide', from, to });

describe('chess tac toe', () => {
  it('starts with four pieces in each hand', () => {
    const view = api.view(api.create('chess-tac-toe'));
    expect(view.banner).toBe('X to place. Pass the phone.');
    expect(view.input).toBe('chess');
    expect(view.hand.map(piece => piece.letter)).toEqual(['P', 'R', 'N', 'B']);
    expect(view.cells).toHaveLength(16);
  });

  it('refuses a placement on an occupied square and leaves that state', () => {
    const placed = play(api.create('chess-tac-toe'), place('pawn', 0));
    expect(api.view(placed).banner).toBe('O to place. Pass the phone.');
    const refused = api.apply(placed, place('pawn', 0));
    expect(refused.ok).toBe(false);
    expect(refused.reason).toBe('You cannot capture by placing from your hand.');
    expect(refused.state).toBe(placed);
    expect(api.view(refused.state).banner).toBe('O to place. Pass the phone.');
  });

  it('wins when the fourth piece completes your line', () => {
    const won = play(
      api.create('chess-tac-toe'),
      place('pawn', 0),
      place('pawn', 4),
      place('rook', 1),
      place('rook', 5),
      place('knight', 2),
      place('knight', 6),
      place('bishop', 3),
    );
    expect(api.view(won).banner).toBe('X wins.');
    expect(won.score).toEqual({ X: 1, O: 0, draws: 0 });
    expect(api.view(won).cells.filter(cell => cell.win).map(cell => cell.index)).toEqual([0, 1, 2, 3]);
  });

  it('moves a knight in an L from the corner and names any other step', () => {
    const ready = play(
      api.create('chess-tac-toe'),
      place('knight', 0),
      place('pawn', 3),
      place('pawn', 5),
      place('rook', 7),
      place('rook', 10),
      place('knight', 11),
      place('bishop', 14),
      place('bishop', 6),
    );
    expect(api.view(ready).banner).toBe('X to move. Pass the phone.');
    const illegal = api.apply(ready, slide(0, 1));
    expect(illegal.ok).toBe(false);
    expect(illegal.reason).toBe('A knight moves in an L.');
    expect(illegal.state).toBe(ready);
    const jumped = api.apply(ready, slide(0, 6));
    expect(jumped.ok).toBe(true);
    expect(jumped.state.cells[6]).toBe('X');
    expect(jumped.state.cells[0]).toBeNull();
    expect(api.view(api.apply(ready, slide(0, 9)).state).cells[9]).toMatchObject({ shape: 'knight', letter: 'N' });
  });

  it('sends a captured piece back to its hand and flips a pawn off the far rank', () => {
    expect(pawnDirection(0, -1)).toBe(1);
    const ready = play(
      api.create('chess-tac-toe'),
      place('rook', 5),
      place('pawn', 6),
      place('pawn', 1),
      place('rook', 2),
      place('knight', 10),
      place('knight', 3),
      place('bishop', 14),
      place('bishop', 7),
    );
    const captured = api.apply(ready, slide(5, 6));
    expect(captured.ok).toBe(true);
    expect(captured.state.cells[6]).toBe('X');
    expect(api.view(captured.state).banner).toBe('O to place. Pass the phone.');
    expect(api.view(captured.state).hand.map(piece => piece.id)).toContain('pawn');

    const pawnReady = play(
      api.create('chess-tac-toe'),
      place('pawn', 0),
      place('pawn', 3),
      place('rook', 5),
      place('rook', 7),
      place('knight', 9),
      place('knight', 11),
      place('bishop', 14),
      place('bishop', 6),
    );
    const stepped = api.apply(pawnReady, slide(0, 4));
    expect(stepped.ok).toBe(true);
    expect(stepped.state.cells[4]).toBe('X');
    expect(stepped.state.cells[0]).toBeNull();
  });
});

describe('chess tac toe mutant guards', () => {
  type Cell = 'X' | 'O' | null;
  /** Hands empty (sliding phase), X to move, with the given pieces on the board. */
  function slidePhase(marks: Record<number, ['X' | 'O', 'pawn' | 'rook' | 'knight' | 'bishop']>, dir: Record<number, number> = {}): MatchState {
    const start = api.create('chess-tac-toe');
    const cells: Cell[] = Array(16).fill(null);
    const pieces: (string | null)[] = Array(16).fill(null);
    const dirs: number[] = Array(16).fill(0);
    for (const [i, [seat, piece]] of Object.entries(marks)) {
      cells[Number(i)] = seat;
      pieces[Number(i)] = piece;
    }
    for (const [i, d] of Object.entries(dir)) dirs[Number(i)] = d;
    return { ...start, cells, turn: 'X', extra: { hands: { X: [], O: [] }, pieces, dir: dirs } };
  }

  it('a pawn cannot step forward onto an occupied square', () => {
    // X pawn on 9 moving up (dir -1); O rook sits straight ahead on 5.
    const state = slidePhase({ 9: ['X', 'pawn'], 5: ['O', 'rook'], 0: ['X', 'rook'], 15: ['O', 'knight'] }, { 9: -1 });
    const blocked = api.apply(state, slide(9, 5));
    expect(blocked.ok).toBe(false);
    expect(blocked.state).toBe(state);
    expect(pawnTargets(9, -1, state.cells, 'X').map(t => t.to)).not.toContain(5);
    // With the square empty the same step is legal.
    const open = slidePhase({ 9: ['X', 'pawn'], 0: ['X', 'rook'], 15: ['O', 'knight'] }, { 9: -1 });
    expect(api.apply(open, slide(9, 5)).ok).toBe(true);
  });

  it('a pawn never lists its own piece as a capture, only the other player', () => {
    const cells: Cell[] = Array(16).fill(null);
    cells[9] = 'X';
    cells[4] = 'X'; // diagonal forward-left, own piece
    cells[6] = 'O'; // diagonal forward-right, other player
    const targets = pawnTargets(9, -1, cells, 'X');
    expect(targets).toContainEqual({ to: 6, capture: true });
    expect(targets.map(t => t.to)).not.toContain(4);
    const state = slidePhase({ 9: ['X', 'pawn'], 4: ['X', 'rook'], 6: ['O', 'rook'] }, { 9: -1 });
    expect(api.apply(state, slide(9, 4)).ok).toBe(false);
    const took = api.apply(state, slide(9, 6));
    expect(took.ok).toBe(true);
    expect(took.state.cells[6]).toBe('X');
  });
});
