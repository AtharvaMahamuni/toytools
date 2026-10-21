import { scoreText } from './connect-4';
import { emptyScore } from './tic-tac-toe';
import type { BoardMove, BoardView, CellShape, CellView, Outcome, Ply, Rules, Seat } from '../types';

const COLUMNS = 4;
const ROWS = 4;
const SIZE = 16;
const OVER = 'The match is over. Rematch to play again.';

export type ChessPiece = 'pawn' | 'rook' | 'knight' | 'bishop';

interface ChessExtra {
  hands: Record<Seat, ChessPiece[]>;
  pieces: (ChessPiece | null)[];
  dir: number[];
}

const LINEUP: ChessPiece[] = ['pawn', 'rook', 'knight', 'bishop'];

const LINES: readonly (readonly number[])[] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

const LETTER: Record<ChessPiece, string> = { pawn: 'P', rook: 'R', knight: 'N', bishop: 'B' };

function freshExtra(): ChessExtra {
  return {
    hands: { X: [...LINEUP], O: [...LINEUP] },
    pieces: Array<ChessPiece | null>(SIZE).fill(null),
    dir: Array<number>(SIZE).fill(0),
  };
}

function extraOf(ply: Ply): ChessExtra {
  return ply.extra as ChessExtra;
}

function other(seat: Seat): Seat {
  return seat === 'X' ? 'O' : 'X';
}

function banner(ply: Ply): string {
  if (ply.outcome === 'draw') return 'Draw.';
  if (ply.outcome) return `${ply.outcome} wins.`;
  const bag = extraOf(ply);
  if (bag.hands[ply.turn].length) return `${ply.turn} to place. Pass the phone.`;
  return `${ply.turn} to move. Pass the phone.`;
}

function ownedLine(cells: readonly (Seat | null)[], seat: Seat): number[] {
  for (const line of LINES) {
    if (line.every(index => cells[index] === seat)) return [...line];
  }
  return [];
}

function onBoard(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < SIZE;
}

function pathClear(cells: readonly (Seat | null)[], from: number, to: number): boolean {
  const fr = Math.floor(from / COLUMNS);
  const fc = from % COLUMNS;
  const tr = Math.floor(to / COLUMNS);
  const tc = to % COLUMNS;
  const dr = Math.sign(tr - fr);
  const dc = Math.sign(tc - fc);
  let r = fr + dr;
  let c = fc + dc;
  while (r !== tr || c !== tc) {
    if (cells[r * COLUMNS + c]) return false;
    r += dr;
    c += dc;
  }
  return true;
}

function knightSquare(from: number, to: number): boolean {
  const fr = Math.floor(from / COLUMNS);
  const fc = from % COLUMNS;
  const tr = Math.floor(to / COLUMNS);
  const tc = to % COLUMNS;
  const dr = Math.abs(tr - fr);
  const dc = Math.abs(tc - fc);
  return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
}

function rookSquare(from: number, to: number): boolean {
  const fr = Math.floor(from / COLUMNS);
  const fc = from % COLUMNS;
  const tr = Math.floor(to / COLUMNS);
  const tc = to % COLUMNS;
  return fr === tr || fc === tc;
}

function bishopSquare(from: number, to: number): boolean {
  const fr = Math.floor(from / COLUMNS);
  const fc = from % COLUMNS;
  const tr = Math.floor(to / COLUMNS);
  const tc = to % COLUMNS;
  return Math.abs(tr - fr) === Math.abs(tc - fc) && from !== to;
}

/** Direction a pawn will use, flipping once it is already on the far rank. */
export function pawnDirection(index: number, dir: number): number {
  const row = Math.floor(index / COLUMNS);
  const far = dir < 0 ? 0 : ROWS - 1;
  return row === far ? -dir : dir;
}

/** Squares a pawn may slide to: forward if empty, diagonally forward onto the other player. Exported for tests. */
export function pawnTargets(index: number, dir: number, cells: readonly (Seat | null)[], owner: Seat): { to: number; capture: boolean }[] {
  const step = pawnDirection(index, dir);
  const row = Math.floor(index / COLUMNS);
  const col = index % COLUMNS;
  const destRow = row + step;
  if (destRow < 0 || destRow >= ROWS) return [];
  const out: { to: number; capture: boolean }[] = [];
  const forward = destRow * COLUMNS + col;
  if (!cells[forward]) out.push({ to: forward, capture: false });
  for (const dc of [-1, 1]) {
    const nextCol = col + dc;
    if (nextCol < 0 || nextCol >= COLUMNS) continue;
    const cap = destRow * COLUMNS + nextCol;
    if (cells[cap] && cells[cap] !== owner) out.push({ to: cap, capture: true });
  }
  return out;
}

function slideReason(piece: ChessPiece, from: number, to: number, cells: readonly (Seat | null)[], dir: number, owner: Seat): string {
  const occupant = cells[to];
  if (occupant === owner) return 'You cannot land on your own piece.';
  if (piece === 'knight') {
    return knightSquare(from, to) ? '' : 'A knight moves in an L.';
  }
  if (piece === 'pawn') {
    const targets = pawnTargets(from, dir, cells, owner);
    if (targets.some(target => target.to === to)) return '';
    const col = from % COLUMNS;
    const toCol = to % COLUMNS;
    if (col !== toCol) return 'A pawn captures one square diagonally forward.';
    return 'A pawn moves one square toward the other player.';
  }
  const aligned = piece === 'rook' ? rookSquare(from, to) : bishopSquare(from, to);
  if (!aligned) {
    return piece === 'rook' ? 'A rook moves in a straight line.' : 'A bishop moves on a diagonal.';
  }
  if (!pathClear(cells, from, to)) return 'That piece cannot pass through another piece.';
  return '';
}

function finish(cells: (Seat | null)[], seat: Seat, score: Ply['score'], bag: ChessExtra, turn: Seat) {
  const line = bag.hands[seat].length === 0 ? ownedLine(cells, seat) : [];
  const outcome: Outcome = line.length ? seat : null;
  const nextScore = { ...score };
  if (outcome === 'X' || outcome === 'O') nextScore[outcome] += 1;
  return {
    ok: true as const,
    ply: {
      cells,
      turn: outcome ? other(seat) : turn,
      score: nextScore,
      outcome,
      extra: bag,
    },
    reason: '',
  };
}

function viewCells(ply: Ply, win: ReadonlySet<number>): CellView[] {
  const bag = extraOf(ply);
  return ply.cells.map((mark, index) => {
    const piece = bag.pieces[index];
    return {
      index,
      mark,
      shape: (piece ?? 'empty') as CellShape,
      letter: piece ? LETTER[piece] : '',
      ...(piece ? { name: piece } : {}),
      win: win.has(index),
    };
  });
}

export const chessTacToe: Rules = {
  id: 'chess-tac-toe',
  columns: COLUMNS,
  rows: ROWS,
  create(starter: Seat = 'X'): Ply {
    return {
      cells: Array<Seat | null>(SIZE).fill(null),
      turn: starter,
      score: emptyScore(),
      outcome: null,
      extra: freshExtra(),
    };
  },
  apply(ply, move: BoardMove) {
    if (ply.outcome) return { ok: false, ply, reason: OVER };
    const bag = extraOf(ply);
    if (typeof move === 'number' || move.kind === 'mark' || move.kind === 'collapse') {
      return { ok: false, ply, reason: 'That square is not on the board.' };
    }
    if (move.kind === 'place') {
      const piece = move.piece as ChessPiece;
      if (!bag.hands[ply.turn].includes(piece)) {
        return { ok: false, ply, reason: 'Place a piece from your hand first.' };
      }
      if (!onBoard(move.index)) return { ok: false, ply, reason: 'That square is not on the board.' };
      if (ply.cells[move.index]) {
        return { ok: false, ply, reason: 'You cannot capture by placing from your hand.' };
      }
      const cells = ply.cells.slice();
      cells[move.index] = ply.turn;
      const pieces = bag.pieces.slice();
      pieces[move.index] = piece;
      const dir = bag.dir.slice();
      if (piece === 'pawn') dir[move.index] = ply.turn === 'X' ? -1 : 1;
      const hands = {
        X: bag.hands.X.slice(),
        O: bag.hands.O.slice(),
      };
      hands[ply.turn].splice(hands[ply.turn].indexOf(piece), 1);
      return finish(cells, ply.turn, ply.score, { hands, pieces, dir }, other(ply.turn));
    }

    if (bag.hands[ply.turn].length) {
      return { ok: false, ply, reason: 'Place a piece from your hand first.' };
    }
    if (!onBoard(move.from) || !onBoard(move.to)) {
      return { ok: false, ply, reason: 'That square is not on the board.' };
    }
    if (ply.cells[move.from] !== ply.turn) return { ok: false, ply, reason: 'That is not your piece.' };
    const piece = bag.pieces[move.from]!;
    const why = slideReason(piece, move.from, move.to, ply.cells, bag.dir[move.from] || (ply.turn === 'X' ? -1 : 1), ply.turn);
    if (why) return { ok: false, ply, reason: why };

    const cells = ply.cells.slice();
    const pieces = bag.pieces.slice();
    const dir = bag.dir.slice();
    const hands = { X: bag.hands.X.slice(), O: bag.hands.O.slice() };
    const captured = cells[move.to];
    if (captured) {
      const taken = pieces[move.to];
      if (taken) hands[captured].push(taken);
    }
    cells[move.to] = ply.turn;
    cells[move.from] = null;
    pieces[move.to] = piece;
    pieces[move.from] = null;
    if (piece === 'pawn') dir[move.to] = pawnDirection(move.from, bag.dir[move.from] || -1);
    else dir[move.to] = 0;
    dir[move.from] = 0;
    return finish(cells, ply.turn, ply.score, { hands, pieces, dir }, other(ply.turn));
  },
  view(ply, canUndo): BoardView {
    const bag = extraOf(ply);
    const win = new Set(ply.outcome && ply.outcome !== 'draw' ? ownedLine(ply.cells, ply.outcome) : []);
    const hand = bag.hands[ply.turn].map(piece => ({ id: piece, letter: LETTER[piece], name: piece }));
    return {
      columns: COLUMNS,
      rows: ROWS,
      cells: viewCells(ply, win),
      banner: banner(ply),
      scoreText: scoreText(ply),
      canUndo,
      status: ply.outcome === null ? 'playing' : ply.outcome === 'draw' ? 'draw' : 'won',
      input: 'chess',
      hand: ply.outcome ? [] : hand,
      choices: [],
      links: [],
    };
  },
};
