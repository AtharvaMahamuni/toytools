import { describe, expect, it } from 'vitest';
import { createBoardGameApi } from './registry';
import { pawnDirection } from './rules/chess-tac-toe';
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
