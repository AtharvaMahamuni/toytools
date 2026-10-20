import type { BoardMove, BoardView, CellView, Outcome, Ply, Rules, Score, Seat } from '../types';

const LINES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function emptyScore(): Score {
  return { X: 0, O: 0, draws: 0 };
}

function winnerOf(cells: readonly (Seat | null)[]): Outcome {
  for (const [a, b, c] of LINES) {
    const mark = cells[a!];
    if (mark && mark === cells[b!] && mark === cells[c!]) return mark;
  }
  if (cells.every(cell => cell !== null)) return 'draw';
  return null;
}

export function winningLine(cells: readonly (Seat | null)[]): number[] {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = cells[a!];
    if (mark && mark === cells[b!] && mark === cells[c!]) return [...line];
  }
  return [];
}

function banner(ply: Ply): string {
  if (ply.outcome === 'draw') return 'Draw.';
  if (ply.outcome) return `${ply.outcome} wins.`;
  return `${ply.turn} to play. Pass the phone.`;
}

function viewCells(cells: readonly (Seat | null)[], win: ReadonlySet<number>): CellView[] {
  return cells.map((mark, index) => ({
    index,
    mark,
    shape: mark === 'X' ? 'cross' : mark === 'O' ? 'ring' : 'empty',
    letter: mark ?? '',
    win: win.has(index),
  }));
}

export const ticTacToe: Rules = {
  id: 'tic-tac-toe',
  columns: 3,
  rows: 3,
  create(): Ply {
    return {
      cells: Array<Seat | null>(9).fill(null),
      turn: 'X',
      score: emptyScore(),
      outcome: null,
    };
  },
  apply(ply, move: BoardMove) {
    if (ply.outcome) {
      return { ok: false, ply, reason: 'The match is over. Rematch to play again.' };
    }
    const index = typeof move === 'number' ? move : -1;
    if (!Number.isInteger(index) || index < 0 || index >= ply.cells.length) {
      return { ok: false, ply, reason: 'That square is not on the board.' };
    }
    if (ply.cells[index]) {
      return { ok: false, ply, reason: 'That square already has a mark.' };
    }
    const cells = ply.cells.slice();
    cells[index] = ply.turn;
    const outcome = winnerOf(cells);
    const score = { ...ply.score };
    if (outcome === 'X' || outcome === 'O') score[outcome] += 1;
    if (outcome === 'draw') score.draws += 1;
    return {
      ok: true,
      ply: {
        cells,
        turn: ply.turn === 'X' ? 'O' : 'X',
        score,
        outcome,
      },
      reason: '',
    };
  },
  view(ply, canUndo): BoardView {
    const win = new Set(winningLine(ply.cells));
    return {
      columns: 3,
      rows: 3,
      cells: viewCells(ply.cells, win),
      banner: banner(ply),
      scoreText: `X ${ply.score.X}, O ${ply.score.O}, draws ${ply.score.draws}`,
      canUndo,
      status: ply.outcome === null ? 'playing' : ply.outcome === 'draw' ? 'draw' : 'won',
      input: 'cell',
      hand: [],
      choices: [],
      links: [],
    };
  },
};
