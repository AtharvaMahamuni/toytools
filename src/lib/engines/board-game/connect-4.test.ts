import { describe, expect, it } from 'vitest';
import { createBoardGameApi } from './registry';
import { winningRuns } from './rules/connect-4';
import type { MatchState } from './types';

const api = createBoardGameApi();

function play(state: MatchState, ...columns: number[]): MatchState {
  return columns.reduce((current, column) => {
    const result = api.apply(current, column);
    expect(result.ok, result.reason).toBe(true);
    return result.state;
  }, state);
}

describe('connect 4', () => {
  it('drops into the lowest empty cell and lets the same column be used again', () => {
    const start = api.create('connect-4');
    const first = api.apply(start, 0);
    expect(first.ok).toBe(true);
    expect(first.state.cells[35]).toBe('X');
    expect(first.state.turn).toBe('O');
    const second = api.apply(first.state, 0);
    expect(second.ok).toBe(true);
    expect(second.state.cells[28]).toBe('O');
    expect(second.state).not.toBe(first.state);
  });

  it('names a column that is missing or full and keeps the same state', () => {
    const start = api.create('connect-4');
    expect(api.apply(start, 7).reason).toBe('That column is not on the board.');
    expect(api.apply(start, 7).state).toBe(start);
    const filled = play(start, 0, 0, 0, 0, 0, 0);
    const again = api.apply(filled, 0);
    expect(again.ok).toBe(false);
    expect(again.reason).toBe('That column is full.');
    expect(again.state).toBe(filled);
  });

  it('scores a vertical four, then undo takes the point back', () => {
    const won = play(api.create('connect-4'), 0, 1, 0, 1, 0, 1, 0);
    expect(api.view(won).banner).toBe('X wins.');
    expect(won.score).toEqual({ X: 1, O: 0, draws: 0 });
    expect(api.view(won).cells.filter(cell => cell.win).map(cell => cell.index)).toEqual([14, 21, 28, 35]);
    const back = api.undo(won);
    expect(api.view(back).banner).toBe('X to play. Pass the phone.');
    expect(back.score).toEqual({ X: 0, O: 0, draws: 0 });
    expect(back.cells[14]).toBeNull();
  });

  it('shows a ghost disc in the column under the pointer and does not place it', () => {
    const start = api.create('connect-4');
    const view = api.view(start, { column: 3 });
    const ghost = view.cells.find(cell => cell.ghost);
    expect(ghost).toMatchObject({ index: 38, mark: null, shape: 'disc', letter: 'X', preview: true });
    expect(view.cells.filter(cell => cell.preview).every(cell => cell.index % 7 === 3)).toBe(true);
    expect(start.cells.every(cell => cell === null)).toBe(true);
  });

  it('wins a full board on a diagonal and on no other line', () => {
    const moves = [4, 1, 2, 4, 3, 5, 5, 2, 6, 0, 4, 6, 2, 0, 0, 3, 0, 3, 5, 5, 1, 5, 4, 4, 2, 6, 6, 6, 5, 6, 2, 0, 0, 2, 4, 1, 1, 1, 1, 3, 3, 3];
    const before = play(api.create('connect-4'), ...moves.slice(0, -1));
    expect(before.outcome).toBeNull();
    expect(winningRuns(before.cells)).toEqual([]);
    const won = api.apply(before, 3);
    expect(won.ok).toBe(true);
    expect(winningRuns(won.state.cells)).toEqual([[3, 11, 19, 27]]);
    expect(won.state.cells.every(cell => cell !== null)).toBe(true);
    expect(api.view(won.state).banner).toBe('O wins.');
    expect(won.state.score).toEqual({ X: 0, O: 1, draws: 0 });
  });
});

describe('connect 4 mutant guards', () => {
  type Cell = 'X' | 'O' | null;
  const at = (r: number, c: number) => r * 7 + c;
  function board(marks: Record<number, 'X' | 'O'>): Cell[] {
    const cells: Cell[] = Array(42).fill(null);
    for (const [i, m] of Object.entries(marks)) cells[Number(i)] = m;
    return cells;
  }
  function drop(cells: Cell[], column: number, turn: 'X' | 'O' = 'X') {
    const start = api.create('connect-4');
    return api.apply({ ...start, cells, turn }, column);
  }

  it('wins on the diagonal that rises to the right', () => {
    // X at (5,0) (4,1) (3,2); O stacks column 3 so X lands on (2,3).
    const cells = board({ [at(5, 0)]: 'X', [at(4, 1)]: 'X', [at(3, 2)]: 'X', [at(5, 3)]: 'O', [at(4, 3)]: 'O', [at(3, 3)]: 'O' });
    const result = drop(cells, 3);
    expect(result.ok).toBe(true);
    expect(result.state.cells[at(2, 3)]).toBe('X');
    expect(result.state.outcome).toBe('X');
    expect(api.view(result.state).cells.filter(c => c.win).map(c => c.index).sort((a, b) => a - b))
      .toEqual([at(2, 3), at(3, 2), at(4, 1), at(5, 0)].sort((a, b) => a - b));
  });

  it('wins on the anti-diagonal that rises to the left', () => {
    const cells = board({ [at(5, 6)]: 'X', [at(4, 5)]: 'X', [at(3, 4)]: 'X', [at(5, 3)]: 'O', [at(4, 3)]: 'O', [at(3, 3)]: 'O' });
    const result = drop(cells, 3);
    expect(result.state.cells[at(2, 3)]).toBe('X');
    expect(result.state.outcome).toBe('X');
    expect(api.view(result.state).banner).toBe('X wins.');
  });

  it('calls a draw when the last disc fills the board with no four', () => {
    // Columns alternate X/O, flipping every two rows: no four anywhere.
    const rows = ['XOXOXOX', 'XOXOXOX', 'OXOXOXO', 'OXOXOXO', 'XOXOXOX', 'XOXOXOX'];
    const cells: Cell[] = rows.join('').split('') as Cell[];
    cells[0] = null; // top of column 0, an X in the pattern
    const before = drop(cells.slice(), 1, 'O');
    expect(before.ok).toBe(false); // column 1 is full
    const result = drop(cells, 0);
    expect(result.ok).toBe(true);
    expect(result.state.outcome).toBe('draw');
    expect(result.state.score.draws).toBe(1);
    expect(api.view(result.state).banner).toBe('Draw.');
  });
});
