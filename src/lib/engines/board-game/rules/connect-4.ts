import { emptyScore } from './tic-tac-toe';
import type { BoardMove, BoardView, CellView, Outcome, Ply, Rules, Seat, ViewHint } from '../types';

const COLUMNS = 7;
const ROWS = 6;
const NEED = 4;

const OVER = 'The match is over. Rematch to play again.';

export function scoreText(ply: Ply): string {
  return `X ${ply.score.X}, O ${ply.score.O}, draws ${ply.score.draws}`;
}

function banner(ply: Ply): string {
  if (ply.outcome === 'draw') return 'Draw.';
  if (ply.outcome) return `${ply.outcome} wins.`;
  return `${ply.turn} to play. Pass the phone.`;
}

function statusOf(ply: Ply): BoardView['status'] {
  if (ply.outcome === null) return 'playing';
  if (ply.outcome === 'draw') return 'draw';
  return 'won';
}

/** Every run of 4 or more that shares one mark. Used to prove a diagonal is the only win. */
export function winningRuns(cells: readonly (Seat | null)[]): number[][] {
  const runs: number[][] = [];
  const dirs: readonly (readonly [number, number])[] = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      const start = row * COLUMNS + col;
      const mark = cells[start];
      if (!mark) continue;
      for (const [dr, dc] of dirs) {
        const prevR = row - dr;
        const prevC = col - dc;
        if (
          prevR >= 0 &&
          prevR < ROWS &&
          prevC >= 0 &&
          prevC < COLUMNS &&
          cells[prevR * COLUMNS + prevC] === mark
        ) {
          continue;
        }
        const line = [start];
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS && cells[r * COLUMNS + c] === mark) {
          line.push(r * COLUMNS + c);
          r += dr;
          c += dc;
        }
        if (line.length >= NEED) runs.push(line);
      }
    }
  }
  return runs;
}

function outcomeOf(cells: readonly (Seat | null)[]): { outcome: Outcome; win: number[] } {
  const runs = winningRuns(cells);
  if (runs.length) {
    const mark = cells[runs[0]![0]!]!;
    const win = [...new Set(runs.filter(line => cells[line[0]!] === mark).flat())];
    return { outcome: mark, win };
  }
  if (cells.every(cell => cell !== null)) return { outcome: 'draw', win: [] };
  return { outcome: null, win: [] };
}

function landingRow(cells: readonly (Seat | null)[], column: number): number {
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (cells[row * COLUMNS + column] === null) return row;
  }
  return -1;
}

function viewCells(ply: Ply, win: ReadonlySet<number>, column: number | null): CellView[] {
  const land = column === null ? -1 : landingRow(ply.cells, column);
  return ply.cells.map((mark, index) => {
    const col = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);
    const inColumn = column !== null && col === column && land >= 0;
    const ghost = inColumn && row === land && !ply.outcome;
    return {
      index,
      mark,
      shape: ghost ? (ply.turn === 'X' ? 'disc' : 'ring') : mark === 'X' ? 'disc' : mark === 'O' ? 'ring' : 'empty',
      letter: ghost ? ply.turn : mark ?? '',
      win: win.has(index),
      preview: inColumn,
      ghost,
    };
  });
}

export const connect4: Rules = {
  id: 'connect-4',
  columns: COLUMNS,
  rows: ROWS,
  create(starter: Seat = 'X'): Ply {
    return {
      cells: Array<Seat | null>(COLUMNS * ROWS).fill(null),
      turn: starter,
      score: emptyScore(),
      outcome: null,
    };
  },
  apply(ply, move: BoardMove) {
    if (ply.outcome) return { ok: false, ply, reason: OVER };
    const column = typeof move === 'number' ? move : -1;
    if (!Number.isInteger(column) || column < 0 || column >= COLUMNS) {
      return { ok: false, ply, reason: 'That column is not on the board.' };
    }
    const row = landingRow(ply.cells, column);
    if (row < 0) return { ok: false, ply, reason: 'That column is full.' };
    const cells = ply.cells.slice();
    cells[row * COLUMNS + column] = ply.turn;
    const { outcome } = outcomeOf(cells);
    const score = { ...ply.score };
    if (outcome === 'X' || outcome === 'O') score[outcome] += 1;
    if (outcome === 'draw') score.draws += 1;
    return {
      ok: true,
      ply: { cells, turn: ply.turn === 'X' ? 'O' : 'X', score, outcome },
      reason: '',
    };
  },
  view(ply, canUndo, hint?: ViewHint): BoardView {
    const column = hint?.column;
    const preview = column !== undefined && column !== null && !ply.outcome ? column : null;
    const { win } = outcomeOf(ply.cells);
    return {
      columns: COLUMNS,
      rows: ROWS,
      cells: viewCells(ply, new Set(win), preview),
      banner: banner(ply),
      scoreText: scoreText(ply),
      canUndo,
      status: statusOf(ply),
      input: 'column',
      hand: [],
      choices: [],
      links: [],
    };
  },
};
